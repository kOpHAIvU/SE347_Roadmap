import { useEffect, useRef, useState } from 'react';
import styles from './OwnRoadmap.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare as penSolid, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { faSquare, faSquarePlus, faTrashCan, faPenToSquare as penRegular, faCircle } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);

function OwnRoadmap({ roadmapName = 'Name not given',
    content = 'GitHub là một hệ thống quản lý dự án và phiên bản code, hoạt động giống như một mạng xã hội cho lập trình viên. Các lập trình viên có thể clone lại mã nguồn từ một repository và Github chính là một dịch vụ máy chủ repository công cộng, mỗi người có thể tạo tài khoản trên đó để tạo ra các kho chứa của riêng mình để có thể làm việc. GitHub có 2 phiên bản: miễn phí và trả phí. Với phiên bản có phí thường được các doanh nghiệp sử dụng để tăng khả năng quản lý team cũng như phân quyền bảo mật dự án. Còn lại thì phần lớn chúng ta đều sử dụng Github với tài khoản miễn phí để lưu trữ source code.'
    , node = 'Install the environment' }) {
    console.log('Rendering OwnRoadmap');
    const [roadName, setRoadName] = useState(roadmapName);
    const [contentExpanded, setIsContentExpanded] = useState(false);
    const [contentText, setContentText] = useState(content);
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef(null);

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

    const [tickArray, setTickArray] = useState(Array(10).fill(false));

    const toggleTickArray = (index) => {
        setTickArray((prevArray) =>
            prevArray.map((value, i) => (i === index ? !value : value))
        );
    };

    const [rewriteNode, setRewriteNode] = useState(node);
    const [isRewriteNode, setIsRewriteNode] = useState(false);


    return (
        <div className={cx('wrapper')}>
            <input
                className={cx('page-title')}
                value={roadName}
                onChange={(e) => setRoadName(e.target.value)}
            />

            <div className={cx('content-section')}>
                {isEditing ? (
                    <textarea
                        ref={textareaRef}
                        type="text"
                        value={contentText}
                        onChange={(e) => setContentText(e.target.value)}
                        onBlur={() => setIsEditing(!isEditing)} // Khi mất focus, quay lại chế độ xem
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
                    icon={penSolid}
                    onClick={() => setIsEditing(!isEditing)}
                />
            </div>

            <div className={cx('roadmap-section')}>
                <div className={cx('level-one')}>
                    <div className={cx('show-section')}>
                        {tickArray[1] ? (
                            <FontAwesomeIcon
                                onClick={() => toggleTickArray(1)}
                                icon={faSquareCheck}
                                className={cx('ticked')} />
                        ) : (
                            <div
                                onClick={() => toggleTickArray(1)}
                                className={cx('tick')} />
                        )}
                        {isRewriteNode ? (
                            <input
                                className={cx('level-one-content-edit')}
                                type="text"
                                value={rewriteNode}
                                onChange={(e) => setRewriteNode(e.target.value)}
                                onBlur={() => setIsRewriteNode(!isRewriteNode)}
                                autoFocus />
                        ) : (
                            <h1 className={cx('level-one-content')}>{rewriteNode}</h1>
                        )}

                        {isRewriteNode ? (
                            <FontAwesomeIcon
                                icon={faTrashCan}
                                className={cx('remove-node')} />
                        ) : (
                            <FontAwesomeIcon
                                onClick={() => setIsRewriteNode(!isRewriteNode)}
                                icon={penRegular}
                                className={cx('rewrite-node')}
                            />
                        )}

                    </div>

                    <div className={cx('hidden-section')}>
                        <FontAwesomeIcon className={cx('add-node')} icon={faSquarePlus} />
                        <FontAwesomeIcon className={cx('add-node')} icon={faSquare} />
                        <FontAwesomeIcon className={cx('add-node')} icon={faCircle} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OwnRoadmap;