import { useState } from 'react';
import styles from './AdvanceLevelThree.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faTrashCan, faPenToSquare as penRegular, faCircle } from '@fortawesome/free-regular-svg-icons';
import { faSquareCheck, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function AdvanceLevelThree({
    children,
    index,
    updateNodeTickState,
    updateNodeContent,
    handleDeleteNode,
    handleDueTimeChange
}) {
    const { ticked, content: initialContent, due_time } = children;
    const [content, setContent] = useState(initialContent);
    const [isEditing, setIsEditing] = useState(false);
    const [dueTime, setDueTime] = useState(`${due_time} days`);

    const handleSaveContent = () => {
        setIsEditing(false); // Thoát khỏi chế độ chỉnh sửa
        updateNodeContent(index, content); // Gọi hàm để cập nhật content mới
    };

    return (
        <div
            className={cx('level-three')}
            key={children.id}>
            <div className={cx('show-section')}>
                <FontAwesomeIcon
                    onClick={updateNodeTickState ? () => updateNodeTickState(index, children) : undefined}
                    icon={ticked ? (children.type === 'Checkbox' ? faSquareCheck : faCircleCheck) : (children.type === 'Checkbox' ? faSquare : faCircle)}
                    className={cx(ticked ? 'ticked' : 'tick')}
                />

                {isEditing ? (
                    <input
                        className={cx('content-edited')}
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onBlur={handleSaveContent}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveContent()}
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
                        onFocus={() => setDueTime(dueTime.replace(' days', ''))}
                        onBlur={() => {
                            if (!isNaN(dueTime)) {
                                const newDueTime = `${dueTime} days`;
                                setDueTime(newDueTime);
                                handleDueTimeChange(index, newDueTime);
                            }
                        }}
                        onChange={(e) => !isNaN(e.target.value) && setDueTime(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (!isNaN(e.target.value)) setDueTime(e.target.value);
                                e.target.blur();
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

export default AdvanceLevelThree;
