import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import CommentItem from '../CommentItem/index.js';
import classNames from 'classnames/bind';
import styles from './Comment.module.scss';

const cx = classNames.bind(styles);

function Comment() {
    let sourceImg = 'https://us-tuna-sounds-images.voicemod.net/b962568b-a0e4-4ccc-b041-2f230293d740-1661361350797.jpg';
    const [titleText, setTitleText] = useState("");
    const [comments, setComments] = useState([
        {
            id: 0,
            poster: 'KoPhaiVu',
            day: '10/10/2024',
            avatar: sourceImg,
            content: 'GitHub là một hệ thống quản lý dự án và phiên bản code, hoạt động giống như một mạng xã hội cho lập trình viên. Các lập trình viên có thể clone lại mã nguồn từ một repository và Github chính là một dịch vụ máy chủ repository công cộng, mỗi người có thể tạo tài khoản trên đó để tạo ra các kho chứa của riêng mình để có thể làm việc. GitHub có 2 phiên bản: miễn phí và trả phí. Với phiên bản có phí thường được các doanh nghiệp sử dụng để tăng khả năng quản lý team cũng như phân quyền bảo mật dự án. Còn lại thì phần lớn chúng ta đều sử dụng Github với tài khoản miễn phí để lưu trữ source code.',
            parent: null
        },
        {
            id: 1,
            poster: 'KoPhaiVinh',
            day: '10/10/2024',
            avatar: sourceImg,
            content: 'GitHub là một hệ thống quản lý dự án và phiên bản code, hoạt động giống như một mạng xã hội cho lập trình viên. Các lập trình viên có thể clone lại mã nguồn từ một repository và Github chính là một dịch vụ máy chủ repository công cộng, mỗi người có thể tạo tài khoản trên đó để tạo ra các kho chứa của riêng mình để có thể làm việc. GitHub có 2 phiên bản: miễn phí và trả phí. Với phiên bản có phí thường được các doanh nghiệp sử dụng để tăng khả năng quản lý team cũng như phân quyền bảo mật dự án. Còn lại thì phần lớn chúng ta đều sử dụng Github với tài khoản miễn phí để lưu trữ source code.',
            parent: null
        },
        {
            id: 2,
            poster: 'KoPhaiLoan',
            day: '10/10/2024',
            avatar: sourceImg,
            content: 'GitHub là một hệ thống quản lý dự án và phiên bản code, hoạt động giống như một mạng xã hội cho lập trình viên. Các lập trình viên có thể clone lại mã nguồn từ một repository và Github chính là một dịch vụ máy chủ repository công cộng, mỗi người có thể tạo tài khoản trên đó để tạo ra các kho chứa của riêng mình để có thể làm việc. GitHub có 2 phiên bản: miễn phí và trả phí. Với phiên bản có phí thường được các doanh nghiệp sử dụng để tăng khả năng quản lý team cũng như phân quyền bảo mật dự án. Còn lại thì phần lớn chúng ta đều sử dụng Github với tài khoản miễn phí để lưu trữ source code.',
            parent: 0
        },
        {
            id: 3,
            poster: 'KoPhaiThu',
            day: '10/10/2024',
            avatar: sourceImg,
            content: 'GitHub là một hệ thống quản lý dự án và phiên bản code, hoạt động giống như một mạng xã hội cho lập trình viên. Các lập trình viên có thể clone lại mã nguồn từ một repository và Github chính là một dịch vụ máy chủ repository công cộng, mỗi người có thể tạo tài khoản trên đó để tạo ra các kho chứa của riêng mình để có thể làm việc. GitHub có 2 phiên bản: miễn phí và trả phí. Với phiên bản có phí thường được các doanh nghiệp sử dụng để tăng khả năng quản lý team cũng như phân quyền bảo mật dự án. Còn lại thì phần lớn chúng ta đều sử dụng Github với tài khoản miễn phí để lưu trữ source code.',
            parent: 0
        }
    ])

    const token = 'your-jwt-token'; // Thay bằng JWT token của bạn

    // Hàm fetch để lấy danh sách comments
    const fetchComments = async () => {
        try {
            const response = await fetch('http://localhost:3004/comment/all', 
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${token}`, // Cung cấp JWT token
                },
            });

            if (!response.statusCode === 200) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json(); 
            const comments = data.data[0]; // Lấy danh sách comments từ phần tử đầu tiên
            const modifiedComments = comments.map(comment => {
                const createdAt = new Date(comment.createdAt);
                const year = createdAt.getFullYear();
                const month = String(createdAt.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên cần +1
                const day = String(createdAt.getDate()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`;
                return {
                    id: comment.id,
                    poster: comment.poster.fullName,
                    day: formattedDate,
                    avatar: comment.poster.avatar,
                    content: comment.content,
                    parent: comment.parentComment.id,
                }
        });
            console.log(modifiedComments);
            setComments(modifiedComments); 
        } catch (error) {
            console.log(error.message); 
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    function getChildComments(parentId) {
        return comments.filter(comment => comment.parent === parentId);
    }

    const handleAddReply = (parentId, replyText) => {
        const newReply = {
            id: comments.length,
            poster: 'KoPhaiVu', // Thay thế bằng tên người dùng thực tế
            day: new Date().toLocaleDateString(),
            avatar: sourceImg,
            content: replyText,
            parent: parentId // Gán ID của comment cha
        };
        setComments([...comments, newReply]);
    };

    const handleDeleteComment = (commentId) => {
        // Xóa comment cha và các comment con
        const commentsToDelete = [commentId];
        let childComments = getChildComments(commentId);

        // Tìm tất cả các comment con
        while (childComments.length > 0) {
            childComments.forEach(child => commentsToDelete.push(child.id));
            childComments = childComments.flatMap(child => getChildComments(child.id));
        }

        // Lọc ra các comment không nằm trong danh sách xóa
        setComments(comments.filter(comment => !commentsToDelete.includes(comment.id)));
    };

    function renderComments() {
        return comments
            .filter(comment => comment.parent === null) // Lọc các comment cha
            .map(comment => {
                // Lấy các comment con của comment cha hiện tại
                const childComments = getChildComments(comment.id);

                return (
                    <CommentItem
                        key={comment.id}
                        children={comment}
                        replies={childComments} // Truyền comment con vào prop replies
                        onAddReply={handleAddReply}
                        onDelete={handleDeleteComment}
                    />
                );
            });
    }

    const handleAddComment = () => {
        if (titleText.trim().length > 0) { // Kiểm tra textarea không trống
            const newComment = {
                id: comments.length, // Hoặc sử dụng một ID duy nhất
                poster: 'KoPhaiVu', // Thay thế bằng tên người dùng thực tế
                day: new Date().toLocaleDateString(), // Thay thế bằng ngày hiện tại
                avatar: sourceImg,
                content: titleText,
                parent: null // Gán parent là null cho comment cha
            };
            setComments([...comments, newComment]); // Thêm comment mới vào danh sách
            setTitleText(""); // Reset textarea
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Kiểm tra nếu nhấn Enter mà không giữ Shift
            e.preventDefault(); // Ngăn chặn hành vi mặc định (xuống dòng)
            handleAddComment(); // Gọi hàm thêm comment
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('title')}>
                    <h1 className={cx('title-text')}>Comment</h1>
                    <h1 className={cx('title-count')}>123</h1>
                </div>
                <div className={cx('write-cmt-section')}>
                    <img
                        className={cx('avatar')}
                        alt='avatar'
                        src='https://us-tuna-sounds-images.voicemod.net/b962568b-a0e4-4ccc-b041-2f230293d740-1661361350797.jpg' />
                    <textarea
                        className={cx('write-cmt')}
                        type="text"
                        value={titleText}
                        onChange={(e) => setTitleText(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <FontAwesomeIcon
                        className={cx('send-icon', { 'active': titleText.trim().length > 0 })}
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