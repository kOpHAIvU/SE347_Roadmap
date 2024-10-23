import { useRef, useState } from 'react';
import styles from './Comment.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import CommentItem from '../CommentItem/index.js';

const cx = classNames.bind(styles);

function Comment() {
    let sourceImg = 'https://us-tuna-sounds-images.voicemod.net/b962568b-a0e4-4ccc-b041-2f230293d740-1661361350797.jpg';
    const [titleText, setTitleText] = useState("");
    const [comments, setComments] = useState([
        {
            poster: 'KoPhaiVu',
            day: '10/10/2024',
            avatar: sourceImg ,
            content: 'GitHub là một hệ thống quản lý dự án và phiên bản code, hoạt động giống như một mạng xã hội cho lập trình viên. Các lập trình viên có thể clone lại mã nguồn từ một repository và Github chính là một dịch vụ máy chủ repository công cộng, mỗi người có thể tạo tài khoản trên đó để tạo ra các kho chứa của riêng mình để có thể làm việc. GitHub có 2 phiên bản: miễn phí và trả phí. Với phiên bản có phí thường được các doanh nghiệp sử dụng để tăng khả năng quản lý team cũng như phân quyền bảo mật dự án. Còn lại thì phần lớn chúng ta đều sử dụng Github với tài khoản miễn phí để lưu trữ source code.',
            parent: null
        },
        {
            poster: 'KoPhaiVinh',
            day: '10/10/2024',
            avatar: sourceImg ,
            content: 'GitHub là một hệ thống quản lý dự án và phiên bản code, hoạt động giống như một mạng xã hội cho lập trình viên. Các lập trình viên có thể clone lại mã nguồn từ một repository và Github chính là một dịch vụ máy chủ repository công cộng, mỗi người có thể tạo tài khoản trên đó để tạo ra các kho chứa của riêng mình để có thể làm việc. GitHub có 2 phiên bản: miễn phí và trả phí. Với phiên bản có phí thường được các doanh nghiệp sử dụng để tăng khả năng quản lý team cũng như phân quyền bảo mật dự án. Còn lại thì phần lớn chúng ta đều sử dụng Github với tài khoản miễn phí để lưu trữ source code.',
            parent: null
        },
        {
            poster: 'KoPhaiLoan',
            day: '10/10/2024',
            avatar: sourceImg ,
            content: 'GitHub là một hệ thống quản lý dự án và phiên bản code, hoạt động giống như một mạng xã hội cho lập trình viên. Các lập trình viên có thể clone lại mã nguồn từ một repository và Github chính là một dịch vụ máy chủ repository công cộng, mỗi người có thể tạo tài khoản trên đó để tạo ra các kho chứa của riêng mình để có thể làm việc. GitHub có 2 phiên bản: miễn phí và trả phí. Với phiên bản có phí thường được các doanh nghiệp sử dụng để tăng khả năng quản lý team cũng như phân quyền bảo mật dự án. Còn lại thì phần lớn chúng ta đều sử dụng Github với tài khoản miễn phí để lưu trữ source code.',
            parent: null
        },
        {
            poster: 'KoPhaiThu',
            day: '10/10/2024',
            avatar: sourceImg ,
            content: 'GitHub là một hệ thống quản lý dự án và phiên bản code, hoạt động giống như một mạng xã hội cho lập trình viên. Các lập trình viên có thể clone lại mã nguồn từ một repository và Github chính là một dịch vụ máy chủ repository công cộng, mỗi người có thể tạo tài khoản trên đó để tạo ra các kho chứa của riêng mình để có thể làm việc. GitHub có 2 phiên bản: miễn phí và trả phí. Với phiên bản có phí thường được các doanh nghiệp sử dụng để tăng khả năng quản lý team cũng như phân quyền bảo mật dự án. Còn lại thì phần lớn chúng ta đều sử dụng Github với tài khoản miễn phí để lưu trữ source code.',
            parent: null
        }
    ])

    return (
        <div className={cx('wrapper')}>
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
                    onChange={(e) => setTitleText(e.target.value)}
                />
                <FontAwesomeIcon
                    className={cx('send-icon', { 'active': titleText.trim().length > 0 })}
                    icon={faPaperPlane}
                />
            </div>
            {comments.map((comment, index) => {
                return <CommentItem key={index} children={comment} />
            })}


        </div>
    );
}

export default Comment;