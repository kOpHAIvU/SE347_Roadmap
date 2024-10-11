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

    // State for the list of levels
    const [levels, setLevels] = useState([{ id: 1, ticked: false, node: node, isEditing: false }]);
    const [activeNodeIndex, setActiveNodeIndex] = useState(null); // To track which node is active

    const toggleTickArray = (index) => {
        setLevels((prevLevels) =>
            prevLevels.map((level, i) => (i === index ? { ...level, ticked: !level.ticked } : level))
        );
    };

    const addNodeSameLevel = () => {
        if (activeNodeIndex !== null) {
            setLevels((prevLevels) => {
                // Create a new level to insert
                const newLevel = { id: prevLevels.length + 1, ticked: false, node: 'Write something...' };
                // Insert the new level right after the active node
                return [
                    ...prevLevels.slice(0, activeNodeIndex + 1), // Get all levels up to the active one
                    newLevel, // Add the new level
                    ...prevLevels.slice(activeNodeIndex + 1), // Get the rest of the levels
                ];
            });
        }
    };

    const toggleEditNode = (index) => {
        setLevels((prevLevels) =>
            prevLevels.map((level, i) => (i === index ? { ...level, isEditing: !level.isEditing } : level))
        );
    };

    const updateNodeContent = (index, newContent) => {
        setLevels((prevLevels) =>
            prevLevels.map((level, i) => (i === index ? { ...level, node: newContent } : level))
        );
    };


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
                {levels.map((level, index) => (
                    <div className={cx('level-one')} key={level.id}>
                        <div className={cx('show-section')}>
                            {level.ticked ? (
                                <FontAwesomeIcon
                                    onClick={() => toggleTickArray(index)}
                                    icon={faSquareCheck}
                                    className={cx('ticked')}
                                />
                            ) : (
                                <div
                                    onClick={() => toggleTickArray(index)}
                                    className={cx('tick')}
                                />
                            )}
                            {level.isEditing ? (
                                <input
                                    className={cx('level-one-content-edit')}
                                    type="text"
                                    value={level.node}
                                    onChange={(e) => updateNodeContent(index, e.target.value)}
                                    onBlur={() => toggleEditNode(index)}
                                    autoFocus
                                />
                            ) : (
                                <h1 className={cx('level-one-content')}>{level.node}</h1>
                            )}

                            <FontAwesomeIcon
                                onClick={() => toggleEditNode(index)}
                                icon={level.isEditing ? faTrashCan : penRegular}
                                className={cx('rewrite-node')}
                            />
                        </div>

                        <div className={cx('hidden-section')}>
                            <FontAwesomeIcon className={cx('same-level')}
                                icon={faSquarePlus}
                                onClick={() => { setActiveNodeIndex(index); addNodeSameLevel(); }} />
                            <FontAwesomeIcon className={cx('achild-level-check')} icon={faSquare} />
                            <FontAwesomeIcon className={cx('child-level-radio')} icon={faCircle} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OwnRoadmap;