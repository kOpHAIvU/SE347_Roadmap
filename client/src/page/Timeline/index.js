import { useRef, useState } from 'react';
import LevelOne from '~/components/Layout/components/RoadmapLevel/LevelOne/index.js';
import LevelTwo from '~/components/Layout/components/RoadmapLevel/LevelTwo/index.js';
import LevelThree from '~/components/Layout/components/RoadmapLevel/LevelThree/index.js';
import styles from './Timeline.module.scss';
import classNames from 'classnames/bind';
import ChatSection from '~/components/Layout/components/ChatSection/index.js';

const cx = classNames.bind(styles);

function Timeline() {
    const authority = 'Administrator'
    let roadmapName = 'Name not given';
    let title = 'GitHub là một hệ thống quản lý dự án và phiên bản code, hoạt động giống như một mạng xã hội cho lập trình viên. Các lập trình viên có thể clone lại mã nguồn từ một repository và Github chính là một dịch vụ máy chủ repository công cộng, mỗi người có thể tạo tài khoản trên đó để tạo ra các kho chứa của riêng mình để có thể làm việc. GitHub có 2 phiên bản: miễn phí và trả phí. Với phiên bản có phí thường được các doanh nghiệp sử dụng để tăng khả năng quản lý team cũng như phân quyền bảo mật dự án. Còn lại thì phần lớn chúng ta đều sử dụng Github với tài khoản miễn phí để lưu trữ source code.';
    const [roadName, setRoadName] = useState(roadmapName);
    const [contentExpanded, setIsContentExpanded] = useState(false);

    // New state to track the hovered index
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // State for the list of levels
    const [nodes, setNodes] = useState([
        { id: 0, level: 1, type: 'Checkbox', ticked: false, due_time: 2, content: 'Write something...' }
    ]);
    const [activeContentIndex, setActiveContentIndex] = useState(null); // To track which node is active

    // Hàm để cập nhật toàn bộ nội dung của node
    const handleNodeAddition = (index, level, type) => {
        const newLevel = { id: nodes.length + 1, level, type, ticked: false, due_time: 2, content: 'Write something...' };

        setNodes(prevNodes => {
            const updatedLevels = [...prevNodes];
            const insertIndex = updatedLevels.findIndex((node, i) => i > index && node.level <= level);
            updatedLevels.splice(insertIndex === -1 ? updatedLevels.length : insertIndex, 0, newLevel);
            return updatedLevels;
        });
    };

    const updateNodeContent = (index, newContent) => {
        console.log("nodes call 2");
        setNodes((prevNodes) => {
            const updatedNodes = [...prevNodes];
            updatedNodes[index] = {
                ...updatedNodes[index], // giữ nguyên các thông tin khác của node
                content: newContent,    // cập nhật content mới
            };
            return updatedNodes;
        });
    };

    // Cập nhật lại addNodeSameLevel để không cần phải gọi hàm này thủ công.
    const updateNodeState = (index, updatedNode) => {
        setNodes(prevNodes => {
            const newNodes = [...prevNodes];
            const isCheckbox = updatedNode.type === 'Checkbox';

            updatedNode.ticked = isCheckbox ? !updatedNode.ticked : true; // Đảo ngược nếu là Checkbox

            // Xóa tick cho RadioButton
            for (let i = index - 1; i >= 0; i--) {
                if (newNodes[i].type !== 'RadioButton') break;
                newNodes[i].ticked = false;
            }
            for (let i = index + 1; i < newNodes.length; i++) {
                if (newNodes[i].type !== 'RadioButton') break;
                newNodes[i].ticked = false;
            }

            newNodes[index] = updatedNode;
            return newNodes;
        });
        setTimeout(() => setHoveredIndex(null), 0);
    };

    const handleAddChildLevelNode = (index, level, type) => {
        const newId = nodes.length + 1; // Tạo ID mới cho node
        const newLevel = { id: newId, level: level + 1, type: type, ticked: false, due_time: 1, content: 'Write something...' };

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

        // Node cần xóa
        const nodeToDelete = nodes[index];

        // Xóa node tại vị trí chỉ định
        setNodes((prevNodes) => {
            const updatedNodes = [...prevNodes];
            updatedNodes.splice(index, 1); // Xóa node hiện tại

            // Tiếp tục kiểm tra và xóa các node phía dưới
            for (let i = index; i < updatedNodes.length;) {
                const currentNode = updatedNodes[i];
                if (currentNode.level > nodeToDelete.level) {
                    updatedNodes.splice(i, 1); // Xóa node nếu level cao hơn
                } else {
                    break; // Dừng lại nếu gặp node có level bằng hoặc thấp hơn
                }
            }

            return updatedNodes; // Trả về danh sách node đã được cập nhật
        });
    };

    const handleDueTimeChange = (index, newDueTime) => {
        setNodes((prevNodes) => {
            const updatedNodes = [...prevNodes];
            updatedNodes[index] = {
                ...updatedNodes[index], // Giữ nguyên các thông tin khác của node
                due_time: newDueTime,   // Cập nhật due_time mới
            };
            console.log("Nodes: ", nodes);
            return updatedNodes;
        });
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('timeline-section')}>
                {authority === 'Administrator' ? (
                    <input
                        className={cx('page-title')}
                        value={roadName}
                        onChange={(e) => setRoadName(e.target.value)}
                    />
                ) : (
                    <h1 className={cx('page-title')}>{roadName}</h1>
                )}


                <span
                    className={cx('content', { expanded: contentExpanded })}
                    onClick={() => setIsContentExpanded(!contentExpanded)}
                >
                    {title}
                </span>

                <div className={cx('timeline-section')}>
                    {nodes.map((node, index) => {
                        const LevelComponent = node.level === 1 ? LevelOne : node.level === 2 ? LevelTwo : LevelThree;
                        return (
                            <LevelComponent
                                key={node.id}
                                userType={authority}
                                children={node}
                                index={index}
                                handleSameLevelClick={handleNodeAddition}
                                handleAddChildLevelNode={handleAddChildLevelNode}
                                updateNodeTickState={updateNodeState}
                                updateNodeContent={updateNodeContent}
                                handleDeleteNode={handleDeleteNode}
                                allNodes={nodes}
                                hoveredIndex={hoveredIndex}
                                setHoveredIndex={setHoveredIndex}
                                handleDueTimeChange={handleDueTimeChange}
                            />
                        );
                    })}
                </div>
            </div>
            <div className={cx('chat-section')}>
                <ChatSection />
            </div>
        </div>
    );
}

export default Timeline;