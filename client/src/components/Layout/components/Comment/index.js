import { useState, useEffect, useCallback } from 'react';
import styles from './Comment.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import CommentItem from '../CommentItem/index.js';
import CryptoJS from 'crypto-js';
import { useNavigate, useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

const secretKey = 'kophaivu'; // Khóa bí mật

// Hàm giải mã
const decryptId = (encryptedId) => {
    const normalizedEncryptedId = encryptedId.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = CryptoJS.AES.decrypt(normalizedEncryptedId, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const formatComment = (data) => {
    return data.map((item) => ({
        id: item.id,
        poster: {
            id: item.poster.id,
            fullName: item.poster.fullName,
        },
        day: item.createdAt ? item.createdAt.substring(0, 10) : '',
        avatar: item.poster.avatar ? item.poster.avatar.substring(0, item.poster.avatar.indexOf('.jpg') + 4) : '',
        content: item.content,
        parent: item.parentComment,
    }))
}

function Comment() {
    const navigate = useNavigate();
    const { id: encryptedId } = useParams();
    const id = decryptId(encryptedId);

    const [profile, setProfile] = useState(null);

    const [titleText, setTitleText] = useState('');
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);

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
            const response = await fetch('http://50.112.48.169:3004/auth/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setProfile(data.data);
                //console.log("Profile: ", data.data);
            } else {
                console.error('Error:', data.message || 'Failed to fetch profile data.');
            }
        } catch (error) {
            console.error('Fetch Profile Error:', error);
        }
    };

    const fetchGetAllCommentInRoadmap = async () => {
        try {
            const response = await fetch(`http://50.112.48.169:3004/comment/all/roadmap/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();
            if (response.ok) {
                //console.log(data);
                setComments(formatComment(data.data))
                console.log("Comments after fetching: ", comments);
                setCommentCount(data.data.length)
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchNewComment = async (content, parentId) => {
        try {
            const body = {
                content: content,
                poster: profile.id,
                roadmap: id,
            };

            if (parentId !== null) {
                body.parentComment = parentId;
            }

            const response = await fetch('http://50.112.48.169:3004/comment/new', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data);
                return data.data.id;
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchPatchComment = async (commentId, content) => {
        try {
            const response = await fetch(`http://50.112.48.169:3004/comment/item/${commentId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: content }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchDelComment = async (commentId) => {
        try {
            const response = await fetch(`http://50.112.48.169:3004/comment/item/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchProfile();
            await fetchGetAllCommentInRoadmap();
        };
        fetchData();
    }, [id]);

    function getChildComments(parentId) {
        return comments.filter((comment) => comment.parent && (comment.parent.id === parentId || comment.parent === parentId));
    }

    const handleAddReply = async (parentId, replyText) => {
        const newId = await fetchNewComment(replyText, parentId)
        const newReply = {
            id: newId,
            poster: {
                id: profile.id,
                fullName: profile.fullName,
            },
            day: new Date().toLocaleDateString(),
            avatar: profile.avatar ? profile.avatar.substring(0, profile.avatar.indexOf('.jpg') + 4) : '',
            content: replyText,
            parent: parentId,
        };
        setComments((prevComments) => {
            const updatedComments = [...prevComments, newReply];
            return updatedComments;
        });
    };

    const handleDeleteComment = async (commentId) => {
        // Xóa comment cha và các comment con
        const commentsToDelete = [commentId];
        let childComments = getChildComments(commentId);

        // Tìm tất cả các comment con
        while (childComments.length > 0) {
            childComments.forEach((child) => commentsToDelete.push(child.id));
            childComments = childComments.flatMap((child) => getChildComments(child.id));
        }

        for (let i = 0; i < commentsToDelete.length; i++) {
            await fetchDelComment(commentsToDelete[i])
        }

        setComments(comments.filter((comment) => !commentsToDelete.includes(comment.id)));
    };

    function renderComments() {
        return comments
            .filter((comment) => comment.parent === null)
            .map((comment) => {
                return (
                    <CommentItem
                        key={comment.id}
                        children={comment}
                        replies={getChildComments(comment.id)}
                        onAddReply={handleAddReply}
                        onDelete={handleDeleteComment}
                    />
                );
            });
    }

    const handleAddComment = async () => {
        // Kiểm tra textarea không trống
        if (titleText.trim().length > 0) {
            const newId = await fetchNewComment(titleText, null)
            const newComment = {
                id: newId,
                poster: {
                    id: profile.id,
                    fullName: profile.fullName,
                },
                day: new Date().toLocaleDateString(),
                avatar: profile.avatar ? profile.avatar.substring(0, profile.avatar.indexOf('.jpg') + 4) : '',
                content: titleText,
                parent: null,
            };
            setComments([...comments, newComment]);
            setTitleText('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('title')}>
                    <h1 className={cx('title-text')}>Comment</h1>
                    <h1 className={cx('title-count')}>{commentCount}</h1>
                </div>
                <div className={cx('write-cmt-section')}>
                    <img
                        className={cx('avatar')}
                        alt="avatar"
                        src={profile?.avatar?.substring(0, profile.avatar.indexOf('.jpg') + 4) ?? 'https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg'}
                    />
                    <textarea
                        className={cx('write-cmt')}
                        type="text"
                        value={titleText}
                        onChange={(e) => setTitleText(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <FontAwesomeIcon
                        className={cx('send-icon', { active: titleText.trim().length > 0 })}
                        icon={faPaperPlane}
                        onClick={handleAddComment}
                    />
                </div>
            </div>
            <div className={cx('comment-section')}>{renderComments()}</div>
        </div>
    );
}

export default Comment;

// {
//     id: 0,
//     poster: 'KoPhaiVu',
//     day: '10/10/2024',
//     avatar: sourceImg,
//     content: 'GitHub là một hệ thống quản lý dự án và phiên bản code, hoạt động giống như một mạng xã hội cho lập trình viên. Các lập trình viên có thể clone lại mã nguồn từ một repository và Github chính là một dịch vụ máy chủ repository công cộng, mỗi người có thể tạo tài khoản trên đó để tạo ra các kho chứa của riêng mình để có thể làm việc. GitHub có 2 phiên bản: miễn phí và trả phí. Với phiên bản có phí thường được các doanh nghiệp sử dụng để tăng khả năng quản lý team cũng như phân quyền bảo mật dự án. Còn lại thì phần lớn chúng ta đều sử dụng Github với tài khoản miễn phí để lưu trữ source code.',
//     parent: null
// },
// {
//     id: 1,
//     poster: 'KoPhaiVinh',
//     day: '10/10/2024',
//     avatar: sourceImg,
//     content: 'GitHub là một hệ thống quản lý dự án và phiên bản code, hoạt động giống như một mạng xã hội cho lập trình viên. Các lập trình viên có thể clone lại mã nguồn từ một repository và Github chính là một dịch vụ máy chủ repository công cộng, mỗi người có thể tạo tài khoản trên đó để tạo ra các kho chứa của riêng mình để có thể làm việc. GitHub có 2 phiên bản: miễn phí và trả phí. Với phiên bản có phí thường được các doanh nghiệp sử dụng để tăng khả năng quản lý team cũng như phân quyền bảo mật dự án. Còn lại thì phần lớn chúng ta đều sử dụng Github với tài khoản miễn phí để lưu trữ source code.',
//     parent: null
// },
// {
//     id: 2,
//     poster: 'KoPhaiLoan',
//     day: '10/10/2024',
//     avatar: sourceImg,
//     content: 'GitHub là một hệ thống quản lý dự án và phiên bản code, hoạt động giống như một mạng xã hội cho lập trình viên. Các lập trình viên có thể clone lại mã nguồn từ một repository và Github chính là một dịch vụ máy chủ repository công cộng, mỗi người có thể tạo tài khoản trên đó để tạo ra các kho chứa của riêng mình để có thể làm việc. GitHub có 2 phiên bản: miễn phí và trả phí. Với phiên bản có phí thường được các doanh nghiệp sử dụng để tăng khả năng quản lý team cũng như phân quyền bảo mật dự án. Còn lại thì phần lớn chúng ta đều sử dụng Github với tài khoản miễn phí để lưu trữ source code.',
//     parent: 0
// },
// {
//     id: 3,
//     poster: 'KoPhaiThu',
//     day: '10/10/2024',
//     avatar: sourceImg,
//     content: 'GitHub là một hệ thống quản lý dự án và phiên bản code, hoạt động giống như một mạng xã hội cho lập trình viên. Các lập trình viên có thể clone lại mã nguồn từ một repository và Github chính là một dịch vụ máy chủ repository công cộng, mỗi người có thể tạo tài khoản trên đó để tạo ra các kho chứa của riêng mình để có thể làm việc. GitHub có 2 phiên bản: miễn phí và trả phí. Với phiên bản có phí thường được các doanh nghiệp sử dụng để tăng khả năng quản lý team cũng như phân quyền bảo mật dự án. Còn lại thì phần lớn chúng ta đều sử dụng Github với tài khoản miễn phí để lưu trữ source code.',
//     parent: 0
// }