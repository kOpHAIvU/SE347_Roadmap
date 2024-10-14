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

    // New state to track the hovered index
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // State for the list of levels
    const [nodes, setNodes] = useState([{ id: 1, level: 1, type: 'Checkbox', ticked: false, content: content }
        , { id: 2, level: 2, type: 'RadioButton', ticked: false, content: content }]);
    const [activeContentIndex, setActiveContentIndex] = useState(null); // To track which node is active

    // Hàm để cập nhật toàn bộ nội dung của node
    const updateNodeContent = (index, updatedNode) => {
        setNodes((prevLevels) => {
            const updatedLevels = [...prevLevels];
            const isRadioButton = updatedNode.type === 'RadioButton';
    
            // Nếu node được cập nhật là RadioButton, bỏ tick cho tất cả RadioButton khác
            if (isRadioButton) {
                updatedLevels.forEach((node, i) => {
                    if (i !== index && node.type === 'RadioButton') {
                        node.ticked = false; // Bỏ tick cho RadioButton khác
                    }
                });
            }
    
            updatedLevels[index] = updatedNode; // Cập nhật node cụ thể
            return updatedLevels;
        });
    };    



    // Cập nhật lại addNodeSameLevel để không cần phải gọi hàm này thủ công.
    const handleSameLevelClick = (index, level, type) => {
        const newId = nodes.length + 1; // Create a new ID for the node
        const newLevel = { id: newId, level: level, type: type, ticked: false, content: 'Write something...' };

        // Check the node immediately below
        if (index + 1 < nodes.length) {
            const belowNode = nodes[index + 1];
            if (belowNode.level <= level) {
                // If the node below has a level equal to or lower than the current node
                setNodes((prevLevels) => {
                    const updatedLevels = [
                        ...prevLevels.slice(0, index + 1), // Nodes before the current node
                        newLevel, // Insert the new node
                        ...prevLevels.slice(index + 1) // Nodes after
                    ];
                    return updatedLevels;
                });
                return; // Exit early since we already inserted the new node
            }
        }

        // If the node below has a higher level, find the first node below that has a level <= current node
        for (let i = index + 1; i < nodes.length; i++) {
            if (nodes[i].level <= level) {
                // Insert the new node before this found node
                setNodes((prevLevels) => {
                    const updatedLevels = [
                        ...prevLevels.slice(0, i), // Nodes before the found node
                        newLevel, // Insert the new node
                        ...prevLevels.slice(i) // Nodes after
                    ];
                    return updatedLevels;
                });
                return; // Exit after inserting
            }
        }

        // If no node was found with a level <= current node, append it to the end
        setNodes((prevLevels) => [...prevLevels, newLevel]);
    };

    const handleAddChildLevelNode = (index, level, type) => {
        const newId = nodes.length + 1; // Tạo ID mới cho node
        const newLevel = { id: newId, level: level + 1, type: type, ticked: false, content: 'Write something...' };

        let insertIndex = -1; // Vị trí để chèn node mới

        // Tìm vị trí chèn: node đầu tiên có level <= level hiện tại
        for (let i = index + 1; i < nodes.length; i++) {
            if (nodes[i].level <= level) {
                insertIndex = i;
                break;
            }
        }

        if (insertIndex === -1) {
            // Nếu không tìm thấy, chèn vào cuối
            insertIndex = nodes.length;
        }

        // Cập nhật danh sách node
        setNodes((prevLevels) => {
            const updatedLevels = [
                ...prevLevels.slice(0, insertIndex), // Các node trước vị trí chèn
                newLevel, // Node mới
                ...prevLevels.slice(insertIndex) // Các node sau đó
            ];
            return updatedLevels;
        });

        setActiveContentIndex(insertIndex); // Cập nhật vị trí active content
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
                                    handleAddChildLevelNode={handleAddChildLevelNode}
                                    updateNodeContent={updateNodeContent}
                                    handleDeleteNode={handleDeleteNode}
                                    allNodes={nodes}
                                    hoveredIndex={hoveredIndex}
                                    setHoveredIndex={setHoveredIndex}
                                />
                            );
                        case 2:
                            return (
                                <LevelTwo
                                    key={node.id}
                                    children={node}
                                    index={index}
                                    handleSameLevelClick={handleSameLevelClick}
                                    handleAddChildLevelNode={handleAddChildLevelNode}
                                    updateNodeContent={updateNodeContent}
                                    handleDeleteNode={handleDeleteNode}
                                    allNodes={nodes}
                                    hoveredIndex={hoveredIndex}
                                    setHoveredIndex={setHoveredIndex}
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
                                    hoveredIndex={hoveredIndex}
                                    setHoveredIndex={setHoveredIndex}
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