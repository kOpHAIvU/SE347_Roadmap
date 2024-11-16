import { useState } from 'react';
import ChatSection from '~/components/Layout/components/ChatSection/index.js';
import classNames from 'classnames/bind';
import styles from './Timeline.module.scss';
import AdvanceRoadmap from '~/components/Layout/components/AdvanceRoadmap/index.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faA, faGear, faSitemap } from '@fortawesome/free-solid-svg-icons';
import RoadmapSection from '~/components/Layout/components/RoadmapSection/index.js';

const cx = classNames.bind(styles);

function Timeline() {
    const authority = 'Administrator'
    let roadmapName = 'Name not given';
    let title = 'GitHub là một hệ thống quản lý dự án và phiên bản code, hoạt động giống như một mạng xã hội cho lập trình viên. Các lập trình viên có thể clone lại mã nguồn từ một repository và Github chính là một dịch vụ máy chủ repository công cộng, mỗi người có thể tạo tài khoản trên đó để tạo ra các kho chứa của riêng mình để có thể làm việc. GitHub có 2 phiên bản: miễn phí và trả phí. Với phiên bản có phí thường được các doanh nghiệp sử dụng để tăng khả năng quản lý team cũng như phân quyền bảo mật dự án. Còn lại thì phần lớn chúng ta đều sử dụng Github với tài khoản miễn phí để lưu trữ source code.';
    const [roadName, setRoadName] = useState(roadmapName);
    const [contentExpanded, setIsContentExpanded] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [showSetting, setShowSetting] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const nodeDetail = `
    <h2>What is GitHub?</h2>
    <p><span style="background-color: rgb(246, 249, 252); color: rgb(33, 51, 67);">GitHub is an online software development platform. It's used for storing, tracking, and collaborating on software projects. </span></p>
    <p>It makes it easy for developers to share code files and collaborate with fellow developers on open-source projects. GitHub also serves as a social networking site where developers can openly network, collaborate, and pitch their work.</p>
    <p>Since its founding in 2008, GitHub has acquired millions of users and established itself as a go-to platform for collaborative software projects. This free service comes with several helpful features for sharing code and working with others in real time.</p>
    <p>On top of its code-related functions, GitHub encourages users to build a personal profile and brand for themselves. You can visit anyone’s profile and see what projects they own and contribute to. This makes GitHub a type of social network for programmers and fosters a collaborative approach to software and <a href="https://blog.hubspot.com/website/website-development?hubs_content=blog.hubspot.com/website/what-is-github-used-for&amp;hubs_content-cta=website%20development" rel="noopener noreferrer" target="_blank" style="color: var(--cl-anchor-color,#0068b1);"><strong>website development</strong></a>.</p>
    <h3>How does GitHub work?</h3>
    <p>GitHub users create accounts, upload files, and create coding projects. But the real work of GitHub happens when users begin to collaborate.</p>
    <p>While anyone can code independently, teams of people build most development projects. Sometimes these teams are all in one place at once time, but more often they work asynchronously. There are many challenges to creating collaborative projects with distributed teams. GitHub makes this process much simpler in a few different ways.</p>
    `;

    // State for the list of levels
    const [nodes, setNodes] = useState([
        {
            id: 1, level: 1, x: 50, y: 50, type: 'Checkbox', ticked: false, due_time: 2,
            content: 'Write something... Chiều cao dựa trên chiều cao của văn bản hoặc giá trị mặc định',
            nodeDetail: nodeDetail
        },
        {
            id: 2, level: 1, x: 50, y: 150, type: 'Checkbox', ticked: false, due_time: 2,
            content: 'Nhạc Remix TikTok | Vạn Sự Tùy Duyên Remix - Phía Xa Vời Có Anh Đang Chờ - Nonstop Nhạc Remix 2024',
            nodeDetail: ''
        },
    ]);

    const updateNodeContent = (index, newContent) => {
        setNodes((prevNodes) => {
            const updatedNodes = [...prevNodes];
            updatedNodes[index] = { ...updatedNodes[index], content: newContent };
            return updatedNodes;
        });
    };

    const updateNodeDue = (index, newDue) => {
        setNodes((prevNodes) => {
            const updatedNodes = [...prevNodes];
            updatedNodes[index] = { ...updatedNodes[index], due_time: newDue };
            return updatedNodes;
        });
    };

    const updateNodeDetail = (index, newDetail) => {
        setNodes((prevNodes) => {
            const updatedNodes = [...prevNodes];
            updatedNodes[index] = { ...updatedNodes[index], nodeDetail: newDetail };
            return updatedNodes;
        });
    };

    const handleDeleteNode = (index) => {
        setNodes((prevNodes) => {
            const updatedNodes = [...prevNodes];
            const targetLevel = updatedNodes[index].level;

            // Xóa node tại vị trí index
            updatedNodes.splice(index, 1);

            // Tìm và xóa các node có level lớn hơn targetLevel
            while (index < updatedNodes.length) {
                if (updatedNodes[index].level > targetLevel) {
                    updatedNodes.splice(index, 1);
                } else {
                    break; // Dừng khi gặp node có level bằng hoặc thấp hơn targetLevel
                }
            }

            return updatedNodes;
        });
    };

    const handleSameLevelClick = (index, x, y, level, type) => {
        const newId = nodes ? Math.max(...nodes.map(node => node.id), 0) + 1 : 0;
        const newLevel = { id: newId, x: x, y: y + 100, level, type, ticked: false, due_time: 2, content: 'Write something...' };

        setNodes((prevLevels) => {
            if (prevLevels === null) return [newLevel];

            // Xác định vị trí chèn node mới
            const insertIndex = prevLevels.findIndex((node, i) => i > index && node.level <= level);
            const updatedNodes = insertIndex === -1
                ? [...prevLevels, newLevel]
                : [...prevLevels.slice(0, insertIndex), newLevel, ...prevLevels.slice(insertIndex)];

            // Cập nhật id cho các node phía dưới
            return updatedNodes.map((node, idx) => {
                return idx > index ? { ...node, id: node.id + 1 } : node;
            });
        });
    };

    const handleAddChildLevelNode = (index, width, x, y, level, type) => {
        const newId = nodes ? Math.max(...nodes.map(node => node.id), 0) + 1 : 0;
        const newLevel = { id: newId, x: x + width + 200, y: y, level: level + 1, type, ticked: false, due_time: 2, content: 'Write something...' };

        setNodes((prevLevels) => {
            if (prevLevels === null) return [newLevel];

            // Xác định vị trí chèn node mới
            const insertIndex = prevLevels.findIndex((node, i) => i > index && node.level <= level);
            const updatedNodes = insertIndex === -1
                ? [...prevLevels, newLevel]
                : [...prevLevels.slice(0, insertIndex), newLevel, ...prevLevels.slice(insertIndex)];

            // Cập nhật id cho các node phía dưới
            return updatedNodes.map((node, idx) => {
                return idx > index ? { ...node, id: node.id + 1 } : node;
            });
        });
    };

    const nodeBelowType = (index) => {
        return index + 1 < nodes.length && nodes[index + 1].level > nodes[index].level
            ? nodes[index + 1].type : null;
    }

    // Cập nhật lại addNodeSameLevel để không cần phải gọi hàm này thủ công.
    const updateTickState = (index, updatedNode) => {
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
        console.log(nodes)
        setTimeout(() => setHoveredIndex(null), 0);
    };

    const handleSave = () => {
        alert("Your changes have been saved!");
        console.log("Lưu ở đây nhóe thím Lon, lấy cái nodes mà post lên")
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('timeline-section')}>
                <div className={cx('important-section')}>
                    <div className={cx('title-container')}>
                        {authority === 'Administrator' ? (
                            <input
                                className={cx('page-title')}
                                value={roadName}
                                onChange={(e) => setRoadName(e.target.value)}
                                onFocus={() => {
                                    if (roadName === 'Name not given')
                                        setRoadName('');
                                }}
                                onBlur={() => {
                                    if (roadName.trim() === '') {
                                        setRoadName('Name not given');
                                    }
                                }}
                            />
                        ) : (
                            <h1 className={cx('page-title')}>{roadName}</h1>
                        )}

                        <FontAwesomeIcon
                            onClick={() => setToggle(!toggle)}
                            icon={toggle ? faSitemap : faA}
                            className={cx('toggle-icon')}
                            title={toggle ? 'Draw' : 'Collumn'}
                        />
                    </div>

                    {authority !== 'Viewer' && (
                        <div className={cx('save-setting')}>
                            <button className={cx('save-btn')} onClick={handleSave}>Save</button>
                            <FontAwesomeIcon
                                icon={faGear}
                                className={cx('setting-btn')}
                                onClick={() => setShowSetting(true)} />
                        </div>
                    )}
                </div>

                <span
                    className={cx('content', { expanded: contentExpanded })}
                    onClick={() => setIsContentExpanded(!contentExpanded)}
                >
                    {title}
                </span>

                <div className={cx('timeline-section')}>
                    {toggle ?
                        <AdvanceRoadmap
                            userType={authority}
                            nodes={nodes}
                            setNodes={setNodes}
                            updateNodeContent={updateNodeContent}
                            updateNodeDue={updateNodeDue}
                            updateNodeDetail={updateNodeDetail}
                            handleDeleteNode={handleDeleteNode}
                            handleSameLevelClick={handleSameLevelClick}
                            handleAddChildLevelNode={handleAddChildLevelNode}
                            nodeBelowType={nodeBelowType}
                            updateTickState={updateTickState}
                        />
                        :
                        <RoadmapSection
                            userType={authority}
                            nodes={nodes}
                            setNodes={setNodes}
                            updateNodeContent={updateNodeContent}
                            updateNodeDue={updateNodeDue}
                            updateNodeDetail={updateNodeDetail}
                            handleDeleteNode={handleDeleteNode}
                            handleSameLevelClick={handleSameLevelClick}
                            handleAddChildLevelNode={handleAddChildLevelNode}
                            nodeBelowType={nodeBelowType}
                            updateTickState={updateTickState}
                        />}
                </div>
            </div>
            <div className={cx('chat-section')}>
                <ChatSection />
            </div>
        </div>
    );
}

export default Timeline;