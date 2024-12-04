import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './LevelOne.module.scss';
import classNames from 'classnames/bind';
import { faSquare, faSquarePlus, faTrashCan, faPenToSquare as penRegular, faCircle } from '@fortawesome/free-regular-svg-icons';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import NodeDetail from '../../NodeDetail/index.js';

const cx = classNames.bind(styles);

function LevelOne({
    userType, node, index, updateNodeContent
    , updateNodeDue, handleDeleteNode, updateNodeDetail, handleSameLevelClick
    , handleAddChildLevelNode, nodeBelowTypes, updateTickState
}) {
    const { ticked, content: initialContent, due_time: initialDueTime, level, type } = node;
    const [content, setContent] = useState(initialContent);
    const [dueTime, setDueTime] = useState(`${initialDueTime} days`);
    const [isEditing, setIsEditing] = useState(false);
    const [isDueTimeFocused, setIsDueTimeFocused] = useState(false);
    const [openNodeDetail, setOpenNodeDetail] = useState(false);

    useEffect(() => {
        setContent(node.content);
        setDueTime(node.due_time);
    }, [node.content, node.due_time]);
    

    const handleSaveContent = () => {
        setIsEditing(false); // Thoát khỏi chế độ chỉnh sửa
        updateNodeContent(index, content); // Gọi hàm để cập nhật content mới
    };

    const handleDueTimeBlur = () => {
        setIsDueTimeFocused(false);
        if (!isNaN(dueTime)) {
            const newDueTime = `${dueTime} days`; // Add ' days' after blur
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
            className={cx('level-one')}
            key={node.id}>
            <div className={cx('show-section')}>
                <FontAwesomeIcon
                    onClick={
                        updateTickState && userType !== "Viewer"
                            ? () => updateTickState(index, node)
                            : undefined}
                    icon={ticked ? faSquareCheck : faSquare}
                    className={cx(ticked ? 'ticked' : 'tick')}
                />

                {isEditing ? (
                    <input
                        className={cx('level-one-content-edit')}
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onBlur={handleSaveContent} // Gọi hàm cập nhật content khi mất focus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // Ngăn việc tạo dòng mới khi nhấn Enter
                                handleSaveContent(); // Cập nhật khi nhấn Enter
                            }
                        }}
                        autoFocus
                    />

                ) : (
                    <h1 className={cx('level-one-content')} onClick={() => setOpenNodeDetail(true)}>{content}</h1>
                )}

                {openNodeDetail &&
                    <NodeDetail
                        userType={userType}
                        index={index}
                        nodeDetail={node.nodeDetail}
                        updateNodeDetail={updateNodeDetail}
                        handleOutsideClick={handleOutsideClick}
                    />}

                <div className={cx('update-node')}>
                    {userType === 'Reviewer' ? (
                        <h1 className={cx('due-time')}>{dueTime}</h1>
                    ) : (
                        <input
                            className={cx('due-time')}
                            type="text"
                            value={isDueTimeFocused ? dueTime.replace(' days', '') : dueTime}
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
                    )}

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

            {userType === 'Administrator' && (
                <div className={cx('hidden-section')}>
                    <FontAwesomeIcon
                        className={cx('same-level')}
                        icon={faSquarePlus}
                        onClick={() => handleSameLevelClick(index, node.x, node.y, level, type)}
                    />
                    {/* Ẩn child-level-check nếu node bên dưới có level cao hơn và là Checkbox */}
                    {(nodeBelowTypes === 'Checkbox' || nodeBelowTypes === null) && (
                        <FontAwesomeIcon
                            className={cx('child-level-check')}
                            icon={faSquare}
                            onClick={() =>
                                handleAddChildLevelNode(index
                                    , Math.max(Math.min(node.content.length * 8, 350), 200) + (node.due_time.toString().length + 5) * 8
                                    , node.x, node.y, node.level, 'Checkbox')}
                        />
                    )}

                    {(nodeBelowTypes === 'RadioButton' || nodeBelowTypes === null) && (
                        <FontAwesomeIcon
                            className={cx('child-level-radio')}
                            icon={faCircle}
                            onClick={() =>
                                handleAddChildLevelNode(index,
                                    Math.max(Math.min(node.content.length * 8, 350), 200) + (node.due_time.toString().length + 5) * 8
                                    , node.x, node.y, node.level, 'RadioButton')}
                        />
                    )}

                </div>
            )}
        </div>
    );
}

export default LevelOne;