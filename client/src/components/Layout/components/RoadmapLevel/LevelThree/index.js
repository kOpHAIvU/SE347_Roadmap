import { useRef, useState } from 'react';
import styles from './LevelThree.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faSquarePlus, faTrashCan, faPenToSquare as penRegular, faCircle } from '@fortawesome/free-regular-svg-icons';
import { faSquareCheck, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function LevelThree({ children, index, updateNodeTickState, updateNodeContent, handleDeleteNode, allNodes, hoveredIndex, handleDueTimeChange }) {
    const ticked = children.ticked;
    const [content, setContent] = useState(children.content);
    const [isEditing, setIsEditing] = useState(false);

    // Kiểm tra loại node ngay dưới node hiện tại
    const getNodeBelowTypeAndLevel = () => {
        if (index + 1 < allNodes.length) {
            const belowNode = allNodes[index + 1];
            if (belowNode.level > children.level) {
                return belowNode.type; // Trả về loại node ngay dưới nếu có level cao hơn
            }
        }
        return null; // Nếu không có node dưới hoặc không có level cao hơn
    };

    const nodeBelowType = getNodeBelowTypeAndLevel();

    const handleSaveContent = () => {
        setIsEditing(false); // Thoát khỏi chế độ chỉnh sửa
        updateNodeContent(index, content); // Gọi hàm để cập nhật content mới
    };

    const [dueTime, setDueTime] = useState(children.due_time + ' days');
    const [isDueTimeFocused, setIsDueTimeFocused] = useState(false);

    // Handle due-time input focus and blur
    const handleDueTimeFocus = () => {
        setIsDueTimeFocused(true);
        setDueTime(dueTime.replace(' days', '')); // Remove ' days' on focus
    };

    const handleDueTimeBlur = () => {
        setIsDueTimeFocused(false);
        if (!isNaN(dueTime)) {
            const newDueTime = `${dueTime} days`; // Add ' days' after blur
            setDueTime(newDueTime);
            handleDueTimeChange(index, newDueTime); // Gọi hàm cập nhật due-time
        }
    };

    return (
        <div className={cx('level-three')} key={children.id}>
            <div className={cx('show-section', { 'with-hidden-section': hoveredIndex === index })}>
                {ticked ? (
                    <FontAwesomeIcon
                        onClick={() => {
                            updateNodeTickState(index, children);
                        }}
                        icon={children.type === 'Checkbox' ? faSquareCheck : faCircleCheck}
                        className={cx('ticked')}
                    />
                ) : (
                    <FontAwesomeIcon
                        onClick={() => {
                            updateNodeTickState(index, children);
                        }}
                        icon={children.type === 'Checkbox' ? faSquare : faCircle}
                        className={cx('tick')}
                    />
                )}

                {isEditing ? (
                    <input
                        className={cx('content-edited')}
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onBlur={handleSaveContent} // Gọi hàm cập nhật content khi mất focus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveContent(); // Cập nhật khi nhấn Enter
                        }}
                        autoFocus
                    />
                ) : (
                    <h1 className={cx('content')}>{content}</h1>
                )}

<div className={cx('update-node')}>
                    <input
                        className={cx('due-time')}
                        type="text"
                        value={dueTime}
                        onFocus={handleDueTimeFocus}
                        onBlur={handleDueTimeBlur}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (!isNaN(value)) {
                                setDueTime(value); // Only allow numeric values
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                const value = e.target.value;
                                if (!isNaN(value)) {
                                    setDueTime(value); // Only allow numeric values
                                }
                                e.target.blur()
                            }
                        }}
                    />

                    <FontAwesomeIcon
                        onClick={() => setIsEditing(true)}
                        icon={penRegular}
                        className={cx('rewrite-node')}
                    />

                    <FontAwesomeIcon
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNode(index)
                        }}
                        icon={faTrashCan}
                        className={cx('delete-node')} />
                </div>
            </div>
        </div>
    );
}

export default LevelThree;
