import classNames from 'classnames/bind';
import styles from './NodeDetail.module.scss';
import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import NodeDetailComment from '../NodeDetailComment/index.js';
import { useLocation, useNavigate } from 'react-router-dom';

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
    const location = useLocation();
    const navigate = useNavigate();
    const [text, setText] = useState(nodeDetail);
    const [selectedText, setSelectedText] = useState('');
    const [isCommentAdded, setIsCommentAdded] = useState(false);
    const [profile, setProfile] = useState(null);


    const getToken = () => {
        const token = localStorage.getItem('vertexToken');

        if (!token) {
            navigate(`/login`);
            return;
        }
        return token;
    }

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:3004/auth/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setProfile(data.data);
                //console.log(data.data)
                return data.data;
            } else {
                console.error('Error:', data.message || 'Failed to fetch profile data.');
            }
        } catch (error) {
            console.error('Fetch Profile Error:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchProfile();
        }
        fetchData();
    }, [])

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
                                    currentUserId={profile?.id}
                                    currentUsername={profile?.fullName}
                                    isCommentAdded={isCommentAdded}
                                    updateNodeComment={updateNodeComment} />
                            ))}
                        </div>
                        <button
                            onClick={() => {
                                if (selectedText.trim() !== '') {
                                    console.log("Hehe")
                                    updateNodeComment(index, 'add', {
                                        userId: profile.id,
                                        username: profile.fullName,
                                        title: selectedText,
                                        content: null,
                                        id: null
                                    }, nodeComment?.length || 0);
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
