import { useEffect, useRef, useState } from 'react';
import styles from './OwnRoadmap.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function OwnRoadmap({ roadmapName = 'Name not given',
    content = 'GitHub là một hệ thống quản lý dự án và phiên bản code, hoạt động giống như một mạng xã hội cho lập trình viên. Các lập trình viên có thể clone lại mã nguồn từ một repository và Github chính là một dịch vụ máy chủ repository công cộng, mỗi người có thể tạo tài khoản trên đó để tạo ra các kho chứa của riêng mình để có thể làm việc. GitHub có 2 phiên bản: miễn phí và trả phí. Với phiên bản có phí thường được các doanh nghiệp sử dụng để tăng khả năng quản lý team cũng như phân quyền bảo mật dự án. Còn lại thì phần lớn chúng ta đều sử dụng Github với tài khoản miễn phí để lưu trữ source code.'
    , }) {
    console.log('Rendering OwnRoadmap');
    const [contentExpanded, setIsContentExpanded] = useState(false);
    const [contentText, setContentText] = useState(content);
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef(null);


    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Đặt chiều cao về 'auto' để loại bỏ chiều cao hiện tại
            const lineHeight = parseInt(getComputedStyle(textareaRef.current).lineHeight, 10);
            const extraLinesHeight = lineHeight * 1; // Thêm chiều cao cho 2 dòng nữa
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight + extraLinesHeight}px`; // Đặt chiều cao mới
        }
    };

    useEffect(() => {
        if (isEditing) {
            adjustTextareaHeight(); // Điều chỉnh chiều cao khi chuyển sang chế độ chỉnh sửa
        }
    }, [isEditing, contentText]);

    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('page-title')}>{roadmapName}</h1>
            <div className={cx('content-section')}>
                {isEditing ? (
                    <textarea
                        ref={textareaRef}
                        type="text"
                        value={contentText}
                        onChange={(e) => setContentText(e.target.value)}
                        onBlur={toggleEditMode} // Khi mất focus, quay lại chế độ xem
                        className={cx('content-input')}
                        autoFocus // Tự động focus vào input khi chuyển sang chế độ chỉnh sửa
                    />
                ) : (
                    <span
                        className={cx('content', { expanded: contentExpanded })}
                        onClick={() => setIsContentExpanded(!contentExpanded)}
                    >
                        {contentText}
                    </span>
                )}
                <FontAwesomeIcon
                    className={cx('rewrite-content-btn')}
                    icon={faPenToSquare}
                    onClick={toggleEditMode}
                />
            </div>
        </div>
    );
}

export default OwnRoadmap;