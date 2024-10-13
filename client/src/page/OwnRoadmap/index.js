import { useEffect, useRef, useState } from 'react';
import styles from './OwnRoadmap.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare as penSolid } from '@fortawesome/free-solid-svg-icons';
import LevelOne from '~/components/Layout/components/RoadmapLevel/LevelOne/index.js';
import LevelTwo from '~/components/Layout/components/RoadmapLevel/LevelTwo/index.js';
import LevelThree from '~/components/Layout/components/RoadmapLevel/LevelThree/index.js';

const cx = classNames.bind(styles);

function OwnRoadmap({ roadmapName = 'Name not given',
    title = 'GitHub là một hệ thống quản lý dự án và phiên bản code, hoạt động giống như một mạng xã hội cho lập trình viên. Các lập trình viên có thể clone lại mã nguồn từ một repository và Github chính là một dịch vụ máy chủ repository công cộng, mỗi người có thể tạo tài khoản trên đó để tạo ra các kho chứa của riêng mình để có thể làm việc. GitHub có 2 phiên bản: miễn phí và trả phí. Với phiên bản có phí thường được các doanh nghiệp sử dụng để tăng khả năng quản lý team cũng như phân quyền bảo mật dự án. Còn lại thì phần lớn chúng ta đều sử dụng Github với tài khoản miễn phí để lưu trữ source code.'
    , content = 'Install the environment' }) {
    console.log('Rendering OwnRoadmap');
    const [roadName, setRoadName] = useState(roadmapName);
    const [contentExpanded, setIsContentExpanded] = useState(false);
    const [titleText, setTitleText] = useState(title);
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
    }, [isEditing, titleText]);

    // State for the list of levels
    const [nodes, setNodes] = useState([{ id: 1, level: 1, type: 'Checkbox', ticked: false, content: content }
        , { id: 2, level: 2, type: 'Checkbox', ticked: false, content: content }]);
    const [activeContentIndex, setActiveContentIndex] = useState(null); // To track which node is active

    // Hàm để cập nhật toàn bộ nội dung của node
    const updateNodeContent = (index, updatedNode) => {
        setNodes((prevLevels) => {
            const updatedLevels = [...prevLevels];
            updatedLevels[index] = updatedNode; // Cập nhật toàn bộ node
            return updatedLevels;
        });
    };


    // Cập nhật lại addNodeSameLevel để không cần phải gọi hàm này thủ công.
    const handleSameLevelClick = (index, level) => {
        const newId = nodes.length + 1; // Tạo ID mới cho node
        const newLevel = { id: newId, level: level, type: 'Checkbox', ticked: false, content: 'Write something...' };

        // Kiểm tra node ngay dưới
        if (index + 1 < nodes.length && nodes[index + 1].level < level) {
            // Nếu node ngay dưới có level thấp hơn
            setNodes((prevLevels) => {
                const updatedLevels = [
                    ...prevLevels.slice(0, index + 1), // Các node trước node hiện tại
                    newLevel, // Chèn node mới ngay sau node hiện tại
                    ...prevLevels.slice(index + 1) // Các node sau đó
                ];
                return updatedLevels;
            });

            setActiveContentIndex(index + 1); // Cập nhật activeContentIndex để phản ánh vị trí mới
        } else {
            // Nếu không thì tìm node cùng cấp đầu tiên ở phía dưới
            const insertIndex = nodes.findIndex((node, idx) => {
                return idx > index && node.level === level; // Tìm node cùng cấp đầu tiên ở phía dưới
            });

            // Update nodes: insert the new level
            setNodes((prevLevels) => {
                const updatedLevels = insertIndex === -1 // Nếu không tìm thấy node cùng cấp phía dưới
                    ? [...prevLevels, newLevel] // Chèn vào cuối
                    : [
                        ...prevLevels.slice(0, insertIndex), // Các node trước node tìm thấy
                        newLevel, // Chèn node mới
                        ...prevLevels.slice(insertIndex) // Các node sau đó
                    ];
                return updatedLevels;
            });

            // Cập nhật activeContentIndex
            setActiveContentIndex(insertIndex === -1 ? nodes.length : insertIndex);
        }
    };

    const handleDeleteNode = (index) => {
        console.log("Deleting node at index: ", index);
        setNodes((prevNodes) => prevNodes.filter((_, i) => i !== index)); // Remove node by index
    };
    console.log(nodes)

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
                        value={titleText}
                        onChange={(e) => setTitleText(e.target.value)}
                        onBlur={() => setIsEditing(!isEditing)} // Khi mất focus, quay lại chế độ xem
                        className={cx('content-input')}
                        autoFocus // Tự động focus vào input khi chuyển sang chế độ chỉnh sửa
                    />
                ) : (
                    <span
                        className={cx('content', { expanded: contentExpanded })}
                        onClick={() => setIsContentExpanded(!contentExpanded)}
                    >
                        {titleText}
                    </span>
                )}
                <FontAwesomeIcon
                    className={cx('rewrite-content-btn')}
                    icon={penSolid}
                    onClick={() => setIsEditing(!isEditing)}
                />
            </div>

            <div className={cx('roadmap-section')}>
                {nodes.map((node, index) => {
                    switch (node.level) {
                        case 1:
                            return (
                                <LevelOne
                                    key={node.id}
                                    children={node}
                                    index={index}
                                    handleSameLevelClick={handleSameLevelClick}
                                    updateNodeContent={updateNodeContent}
                                    handleDeleteNode={handleDeleteNode}
                                    allNodes={nodes}
                                />
                            );
                        case 2:
                            return (
                                <LevelTwo
                                    key={node.id}
                                    children={node}
                                    index={index}
                                    handleSameLevelClick={handleSameLevelClick}
                                    updateNodeContent={updateNodeContent}
                                    handleDeleteNode={handleDeleteNode}
                                    allNodes={nodes}
                                />
                            );
                        case 3:
                            return (
                                <LevelThree
                                    key={node.id}
                                    children={node}
                                    index={index}
                                    handleSameLevelClick={handleSameLevelClick}
                                    updateNodeContent={updateNodeContent}
                                    handleDeleteNode={handleDeleteNode}
                                />
                            );
                        default:
                            console.log('Error! Node not define yet.');
                            return null;
                    }
                })}

            </div>
        </div>
    );
}

export default OwnRoadmap;