import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './LevelOne.module.scss';
import classNames from 'classnames/bind';
import { faSquare, faSquarePlus, faTrashCan, faPenToSquare as penRegular, faCircle } from '@fortawesome/free-regular-svg-icons';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const cx = classNames.bind(styles);

function LevelOne({
    userType,
    children,
    index,
    handleSameLevelClick,
    handleAddChildLevelNode,
    updateNodeTickState,
    updateNodeContent,
    handleDeleteNode,
    allNodes,
    handleDueTimeChange 
}) {
    const { ticked, content: initialContent, due_time: initialDueTime, level, type, id } = children;
    const [content, setContent] = useState(initialContent);
    const [dueTime, setDueTime] = useState(`${initialDueTime} days`);
    const [isEditing, setIsEditing] = useState(false);
    const [isDueTimeFocused, setIsDueTimeFocused] = useState(false);

    const handleSaveContent = () => {
        setIsEditing(false); // Thoát khỏi chế độ chỉnh sửa
        updateNodeContent(index, content); // Gọi hàm để cập nhật content mới
    };

    const handleDueTimeBlur = () => {
        setIsDueTimeFocused(false);
        if (!isNaN(dueTime)) {
            const newDueTime = `${dueTime} days`; // Add ' days' after blur
            setDueTime(newDueTime);
            handleDueTimeChange(index, newDueTime); // Gọi hàm cập nhật due-time
        }
    };

    const nodeBelowType = index + 1 < allNodes.length && allNodes[index + 1].level > level
        ? allNodes[index + 1].type
        : null;

    return (
        <div
            className={cx('level-one')}
            key={children.id}>
            <div className={cx('show-section')}
            >
                <FontAwesomeIcon
                    onClick={updateNodeTickState ? () => updateNodeTickState(index, children) : undefined}
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
                    <h1 className={cx('level-one-content')}>{content}</h1>
                )}

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
                        onClick={() => handleSameLevelClick(index, level, type)}
                    />
                    {/* Ẩn child-level-check nếu node bên dưới có level cao hơn và là Checkbox */}
                    {nodeBelowType === 'Checkbox' || nodeBelowType === null ? (
                        <FontAwesomeIcon
                            className={cx('child-level-check')}
                            icon={faSquare}
                            onClick={() => handleAddChildLevelNode(index, children.level, 'Checkbox')}
                        />
                    ) : null}
                    {nodeBelowType === 'RadioButton' || nodeBelowType === null ? (
                        <FontAwesomeIcon
                            className={cx('child-level-radio')}
                            icon={faCircle}
                            onClick={() => handleAddChildLevelNode(index, children.level, 'RadioButton')}
                        />
                    ) : null}
                </div>
            )}
        </div>
    );
}

export default LevelOne;