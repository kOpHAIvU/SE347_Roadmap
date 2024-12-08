import classNames from 'classnames/bind';
import styles from './NodeDetailComment.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function NodeDetailComment({ idx, nodeIndex, item, userType, currentUserId, currentUsername, isCommentAdded, updateNodeComment }) {
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef(null);
    const [comments, setComments] = useState(item.comment);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isEditing]);

    return (
        <div className={cx('comment-item', { 'slide-in': isCommentAdded })}>
            <div className={cx('header')}>
                <h1 className={cx('username')}>{item.username}</h1>
                {userType !== "Viewer" && <FontAwesomeIcon className={cx('delete')} icon={faTrashCan}
                    onClick={() => updateNodeComment(idx, 'delete', null, idx)} />}
            </div>
            <div className={cx('text-commented')}><strong>{item.text}</strong></div>
            {isEditing ?
                (<textarea
                    ref={textareaRef}
                    className={cx('comment-content')}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}

                    placeholder="Add comment..."
                    onBlur={() => {
                        setIsEditing(false);
                        updateNodeComment(nodeIndex, 'edit',
                            {
                                userId: currentUserId,
                                username: currentUsername,
                                text: item.text,
                                comment: comments
                            },
                            idx);

                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            setIsEditing(false);
                            updateNodeComment(idx, 'edit', { comment: comments }, idx);
                        }
                    }} />
                ) : (
                    <div className={cx('comment-show')}>
                        <h1 className={cx('content')}>{comments}</h1>
                        {currentUserId === item.userId && <FontAwesomeIcon
                            className={cx('rewrite-icon')}
                            icon={faPenToSquare}
                            onClick={() => setIsEditing(true)} />}
                    </div>
                )}
        </div>
    );
}

export default NodeDetailComment;