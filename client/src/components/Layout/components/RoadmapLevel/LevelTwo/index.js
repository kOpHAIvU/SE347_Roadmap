import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faSquarePlus, faTrashCan, faPenToSquare as penRegular, faCircle } from '@fortawesome/free-regular-svg-icons';
import { faCircleCheck, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './LevelTwo.module.scss';
import NodeDetail from '../../NodeDetail/index.js';

const cx = classNames.bind(styles);

function LevelTwo({ userType, node, index, updateNodeContent
    , updateNodeDue, updateNodeDetail, handleDeleteNode, handleSameLevelClick
    , handleAddChildLevelNode, nodeBelowTypes, updateTickState, updateNodeComment
}) {
    const { ticked, content: initialContent, due_time, type } = node;
    const [content, setContent] = useState(initialContent);
    const [isEditing, setIsEditing] = useState(false);
    const [dueTime, setDueTime] = useState(`${due_time} days`);
    const [openNodeDetail, setOpenNodeDetail] = useState(false);
    const [isDueTimeFocused, setIsDueTimeFocused] = useState(false);

    useEffect(() => {
        setContent(node.content);
        setDueTime(node.due_time);
    }, [node.content, node.due_time]);

    const handleSaveContent = () => {
        setIsEditing(false);
        updateNodeContent(index, content);
    };

    const handleDueTimeBlur = () => {
        setIsDueTimeFocused(false);
        if (!isNaN(dueTime)) {
            const newDueTime = `${dueTime}`; // Add ' days' after blur
            setDueTime(newDueTime);
            updateNodeDue(index, newDueTime); // Gọi hàm cập nhật due-time
        }
    };

    const handleOutsideClick = (e) => {
        if (String(e.target.className).includes('modal-overlay')) {
            setOpenNodeDetail(false)
        }
    }

    return (
        <div
            className={cx('level-two')}
            key={node.id}>
            <div
                className={cx('show-section')}>
                <FontAwesomeIcon
                    onClick={
                        updateTickState && userType !== "Viewer"
                            ? () => updateTickState(index, node)
                            : undefined}
                    icon={ticked ? (type === 'Checkbox' ? faSquareCheck : faCircleCheck) : (type === 'Checkbox' ? faSquare : faCircle)}
                    className={cx(ticked ? 'ticked' : 'tick')}
                />

                {isEditing ? (
                    <input
                        className={cx('content-edited')}
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onBlur={handleSaveContent}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSaveContent(); }}
                        autoFocus
                    />
                ) : (
                    <h1 className={cx('content')} onClick={() => setOpenNodeDetail(true)}>{content}</h1>
                )}

                {openNodeDetail &&
                    <NodeDetail
                        userType={userType}
                        index={index}
                        nodeComment={node.nodeComment}
                        nodeDetail={node.nodeDetail}
                        updateNodeDetail={updateNodeDetail}
                        handleOutsideClick={handleOutsideClick}
                        updateNodeComment={updateNodeComment}
                    />}

                <div className={cx('update-node')}>
                    <input
                        className={cx('due-time')}
                        type="text"
                        value={
                            isDueTimeFocused
                                ? String(dueTime).replace(' days', '') // Chuyển `dueTime` thành chuỗi trước
                                : `${dueTime} days` // Sử dụng template literals
                        }
                        onFocus={() => setIsDueTimeFocused(true)}
                        onBlur={handleDueTimeBlur}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (!isNaN(value)) {
                                setDueTime(value);
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                e.target.blur();
                            }
                        }}
                    />

                    {(userType === 'Administrator' || userType === 'Editor') && (
                        <>
                            <FontAwesomeIcon
                                onClick={() => setIsEditing(true)}
                                icon={penRegular}
                                className={cx('rewrite-node')}
                            />

                            <FontAwesomeIcon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteNode(index);
                                }}
                                icon={faTrashCan}
                                className={cx('delete-node')}
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Kiểm tra nếu node là Checkbox thì không render hidden-section */}
            {userType === 'Administrator' && node.type !== 'RadioButton' && (
                <div
                    className={cx('hidden-section')}
                >
                    <FontAwesomeIcon
                        className={cx('same-level')}
                        icon={faSquarePlus}
                        onClick={() => {
                            handleSameLevelClick(index, node.x, node.y, node.level, node.type);
                        }}
                    />
                    {/* Ẩn child-level-check nếu node bên dưới có level cao hơn và là Checkbox */}
                    {nodeBelowTypes === 'Checkbox' || nodeBelowTypes === null ? (
                        <FontAwesomeIcon
                            className={cx('child-level-check')}
                            icon={faSquare}
                            onClick={() =>
                                handleAddChildLevelNode(index
                                    , Math.max(Math.min(node.content.length * 8, 350), 200) + (node.due_time.toString().length + 5) * 8
                                    , node.x, node.y, node.level, 'Checkbox')}
                        />
                    ) : null}
                    {nodeBelowTypes === 'RadioButton' || nodeBelowTypes === null ? (
                        <FontAwesomeIcon
                            className={cx('child-level-radio')}
                            icon={faCircle}
                            onClick={() =>
                                handleAddChildLevelNode(index,
                                    Math.max(Math.min(node.content.length * 8, 350), 200) + (node.due_time.toString().length + 5) * 8
                                    , node.x, node.y, node.level, 'RadioButton')}
                        />
                    ) : null}
                </div>
            )}
        </div>
    );
}

export default LevelTwo;