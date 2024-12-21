import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './CommentItem.module.scss';
import classNames from 'classnames/bind';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';
import { faChevronDown, faChevronUp, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function CommentItem({ children, replies, onAddReply, onDelete }) {
    const [show, setShow] = useState(false);
    const [makeResponse, setMakeResponse] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [currentReplies, setCurrentReplies] = useState(replies);

    useEffect(() => {
        setCurrentReplies(replies);
        //console.log('replies: ', replies)
    }, [replies]);

    const handleAddReply = () => {
        if (replyText.trim().length > 0) {
            onAddReply(children.id, replyText); // Gọi hàm từ component cha để thêm bình luận
            setReplyText(""); // Reset textarea
        }
    };

    const handleDeleteClick = () => {
        onDelete(children.id); // Gọi hàm onDelete từ component cha
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Ngăn chặn hành vi mặc định là xuống dòng
            handleAddReply(); // Gọi hàm thêm reply
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner', { 'child': currentReplies === null })}>
                <img
                    className={cx('avatar')}
                    alt='avatar'
                    src={children.avatar} />
                <div className={cx('cmt-infor')}>
                    <div className={cx('cmt-status')}>
                        <h1 className={cx('cmt-author')}>{children.poster.fullName}</h1>
                        <span className={cx('cmt-date')}>{children.day}</span>
                    </div>
                    <h2 className={cx('cmt-content')}>{children.content}</h2>
                    {children.parent == null ? (
                        <h2 className={cx('response')} onClick={() => {
                            setShow(!show)
                            setMakeResponse(true)
                        }} >Response</h2>
                    ) : null}
                </div>

                <FontAwesomeIcon
                    icon={faTrashCan}
                    className={cx('delete-cmt')}
                    onClick={handleDeleteClick} />
            </div>

            {currentReplies?.length > 0 && show && (
                currentReplies.map((reply) => (
                    <CommentItem key={reply.id} children={reply} replies={null} onAddReply={onAddReply} />
                ))
            )}

            {makeResponse && (
                <div className={cx('reply-section')}>
                    <img
                        className={cx('avatar')}
                        alt='avatar'
                        src={children.avatar} />
                    <textarea
                        className={cx('reply-textarea')}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Add a reply..."
                        onKeyDown={handleKeyDown}
                    />
                    <FontAwesomeIcon
                        className={cx('send-icon', { 'active': replyText.trim().length > 0 })}
                        icon={faPaperPlane}
                        onClick={handleAddReply}
                    />
                </div>
            )}

            {currentReplies?.length > 0 && (
                <div
                    onClick={() => {
                        setShow(!show)
                        setMakeResponse(!makeResponse)
                    }}
                    className={cx('see-more')}
                >
                    <FontAwesomeIcon className={cx('drop-down')} icon={show ? faChevronUp : faChevronDown} />
                    {show ? <span className={cx('count')}>Hide replies</span> : <span className={cx('count')}>See {currentReplies.length} more</span>}
                </div>
            )}

        </div >
    );
}

export default CommentItem;