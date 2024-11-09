import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faSquarePlus, faTrashCan, faPenToSquare as penRegular, faCircle } from '@fortawesome/free-regular-svg-icons';
import { faCircleCheck, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './LevelTwo.module.scss';

const cx = classNames.bind(styles);

function LevelTwo({ userType,
    children,
    index,
    handleSameLevelClick,
    handleAddChildLevelNode,
    updateNodeTickState,
    updateNodeContent,
    handleDeleteNode,
    handleDueTimeChange,
    nodeBelowTypes
}) {
    const { ticked, content: initialContent, due_time, level, type, id } = children;
    const [content, setContent] = useState(initialContent);
    const [isEditing, setIsEditing] = useState(false);
    const [dueTime, setDueTime] = useState(`${due_time} days`);

    const handleSaveContent = () => {
        setIsEditing(false);
        updateNodeContent(index, content);
    };

    const handleDueTimeChangeBlur = (value) => {
        if (!isNaN(value)) {
            const newDueTime = `${value} days`;
            setDueTime(newDueTime);
            handleDueTimeChange(index, newDueTime);
        }
    };
    return (
        <div
            className={cx('level-two')}
            key={children.id}>
            <div
                className={cx('show-section')}>
                <FontAwesomeIcon
                    onClick={updateNodeTickState ? () => updateNodeTickState(index, children) : undefined}
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
                    <h1 className={cx('content')}>{content}</h1>
                )}

                <div className={cx('update-node')}>
                    <input
                        className={cx('due-time')}
                        type="text"
                        value={dueTime}
                        onFocus={() => setDueTime(dueTime.replace(' days', ''))}
                        onBlur={(e) => handleDueTimeChangeBlur(e.target.value)}
                        onChange={(e) => { if (!isNaN(e.target.value)) setDueTime(e.target.value); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleDueTimeChangeBlur(e.target.value); } }}
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

            {/* Kiểm tra nếu node là Checkbox thì không render hidden-section */}
            {userType === 'Administrator' && children.type !== 'RadioButton' && (
                <div
                    className={cx('hidden-section')}
                >
                    <FontAwesomeIcon
                        className={cx('same-level')}
                        icon={faSquarePlus}
                        onClick={() => {
                            handleSameLevelClick(index, children.level, children.type);
                        }}
                    />
                    {/* Ẩn child-level-check nếu node bên dưới có level cao hơn và là Checkbox */}
                    {nodeBelowTypes === 'Checkbox' || nodeBelowTypes === null ? (
                        <FontAwesomeIcon
                            className={cx('child-level-check')}
                            icon={faSquare}
                            onClick={() => handleAddChildLevelNode(index, children.level, 'Checkbox')}
                        />
                    ) : null}
                    {nodeBelowTypes === 'RadioButton' || nodeBelowTypes === null ? (
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

export default LevelTwo;