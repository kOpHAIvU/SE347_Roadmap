import classNames from 'classnames/bind';
import styles from './NodeDetail.module.scss';
import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import NodeDetailComment from '../NodeDetailComment/index.js';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, false] }],
        [{ font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" }
        ],
        ["link"]
    ]
}

function NodeDetail({ userType, nodeComment, index, nodeDetail, updateNodeDetail, handleOutsideClick, updateNodeComment }) {
    const currentUsername = 'KoPhaiVu';
    const currentUserId = '1';
    const location = useLocation();
    const [text, setText] = useState(nodeDetail);
    const [selectedText, setSelectedText] = useState('');
    const [isCommentAdded, setIsCommentAdded] = useState(false);

    const handleSelectionChange = (range, source, editor) => {
        if (range && range.length > 0) {
            const selectedText = editor.getText(range.index, range.length);
            setSelectedText(selectedText);
        } else {
            setSelectedText('');
        }
    };

    useEffect(() => {
        if (isCommentAdded) {
            // Reset lại trạng thái khi animation kết thúc
            const timer = setTimeout(() => {
                setIsCommentAdded(false);
            }, 300); // Thời gian animation slide-in (300ms)
            return () => clearTimeout(timer);
        }
    }, [isCommentAdded]);

    return (
        <div
            className={cx('modal-overlay')}
            onClick={(e) => {
                e.stopPropagation()
                if (userType !== 'Viewer')
                    updateNodeDetail(index, text)
                handleOutsideClick(e)
            }}
        >
            <div className={cx('modal')}>
                <div className={cx('editor-container')}>
                    <ReactQuill
                        className={cx('editor')}
                        theme="snow"
                        value={text}
                        onChange={setText}
                        onChangeSelection={handleSelectionChange}
                        modules={modules}
                    />
                </div>
                {location.pathname.startsWith('/timeline/') && (
                    <div className={cx('comment-section')}>
                        <h3 className={cx('comment-title')}>Comments</h3>
                        <div className={cx('comments-list')}>
                            {nodeComment && nodeComment.length > 0 && nodeComment.map((item, idx) => (
                                <NodeDetailComment
                                    key={idx}
                                    idx={idx}
                                    nodeIndex={index}
                                    item={item}
                                    userType={userType}
                                    currentUserId={currentUserId}
                                    currentUsername={currentUsername}
                                    isCommentAdded={isCommentAdded}
                                    updateNodeComment={updateNodeComment} />
                            ))}
                        </div>
                        <button
                            onClick={() => {
                                if (selectedText.trim() !== '') {
                                    updateNodeComment(index, 'add', {
                                        userId: currentUserId,
                                        username: currentUsername,
                                        text: selectedText,
                                        comment: null
                                    }, nodeComment.length);
                                }
                            }}
                            className={cx('add-comment-btn')}>
                            Add Comment
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NodeDetail;
