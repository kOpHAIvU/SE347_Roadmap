import { useEffect, useState } from 'react';
import ChatSection from '~/components/Layout/components/ChatSection/index.js';
import classNames from 'classnames/bind';
import styles from './Timeline.module.scss';
import AdvanceRoadmap from '~/components/Layout/components/AdvanceRoadmap/index.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faA, faChevronLeft, faChevronRight, faGear, faSitemap } from '@fortawesome/free-solid-svg-icons';
import RoadmapSection from '~/components/Layout/components/RoadmapSection/index.js';
import { DeleteCollab, NewCollab, Saved } from '~/components/Layout/components/MiniNotification/index.js';
import { SettingTimeline } from '~/components/Layout/components/Dialog/index.js';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const cx = classNames.bind(styles);

const secretKey = 'kophaivu'; // Khóa bí mật

const decryptId = (encryptedId) => {
    const normalizedEncryptedId = encryptedId.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = CryptoJS.AES.decrypt(normalizedEncryptedId, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const filterTimelineNode = (data) => {
    return data.map((item, index) => ({
        id: index,
        level: item.level,
        x: item.xAxis,
        y: item.yAxis,
        type: item.type,
        ticked: item.tick,
        due_time: item.dueTime,
        content: item.content,
        nodeDetail: item.detail,
    }));
}

function Timeline() {
    const navigate = useNavigate();
    const { id: encryptedId } = useParams();
    const id = decryptId(encryptedId);

    const [profile, setProfile] = useState(null);
    const [userType, setUserType] = useState("Viewer")
    const [roadName, setRoadName] = useState('Name not given');
    const [titleText, setTitleText] = useState('Make some description');
    const [nodes, setNodes] = useState([]);
    const [groupData, setGroupData] = useState([])


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
            const response = await fetch('http://localhost:3004/auth/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setProfile(data.data);
                console.log(data.data)
                return data.data;
            } else {
                console.error('Error:', data.message || 'Failed to fetch profile data.');
            }
        } catch (error) {
            console.error('Fetch Profile Error:', error);
        }
    };

    const fetchTimelineData = async () => {
        try {
            const response = await fetch(`http://localhost:3004/timeline/item/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setRoadName(data.data.title)
                setTitleText(data.data.content)
                setNodes(filterTimelineNode(data.data.node))
                console.log("Nodes after fetching: ", nodes);
                console.log("Timeline data: ", data.data)

                return data.data;
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Fetch Roadmap Error:', error);
        }
    };

    const fetchUpdateTimelineTitleContent = async () => {
        try {
            const response = await fetch(`http://localhost:3004/timeline/item/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: roadName,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data);
                return data.data
            } else {
                console.error(data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchGetGroupDivisionByTimeline = async () => {
        try {
            const response = await fetch(`http://localhost:3004/group-division/timelineId/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();

            if (response.ok) {
                setGroupData(data.data.groupDivisions)
                console.log(data);
                return data.data
            } else {
                console.error(data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchAllNodeInTimeline = async () => {
        try {
            const response = await fetch(`http://localhost:3004/node/all/timeline/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setNodes(filterTimelineNode(data.data))
                console.log("Nodes after fetching: ", nodes);
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
            const fetchedProfile = await fetchProfile();
            const fetchedTimelineData = await fetchTimelineData();
            const fetchedGroupDivisonData = await fetchGetGroupDivisionByTimeline();

            if (fetchedProfile && fetchedTimelineData && fetchedGroupDivisonData) {
                for (let i = 0; i < fetchedGroupDivisonData.totalRecords; i++) {
                    const groupDivision = fetchedGroupDivisonData.groupDivisions[i];

                    if (fetchedProfile.id === groupDivision.user.id) {
                        console.log("groupDivision role: ", groupDivision.role)
                        switch (groupDivision.role) {
                            case 1:
                                setUserType("Administrator");
                                break;
                            case 2:
                                setUserType("Editor");
                                break;
                            case 3:
                                setUserType("Viewer");
                                break;
                            case 4:
                                setUserType("onPending");
                                break;
                            default:
                                console.warn("Unknown role:", groupDivision.role);
                        }
                    }
                }
                console.log(userType)
            }
        }
        fetchData();
    }, [])

    const [contentExpanded, setIsContentExpanded] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [showSetting, setShowSetting] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [chatExtended, setChatExtended] = useState(true);

    // const nodeDetail = `
    // <h2>What is GitHub?</h2>
    // <p><span style="background-color: rgb(246, 249, 252); color: rgb(33, 51, 67);">GitHub is an online software development platform. It's used for storing, tracking, and collaborating on software projects. </span></p>
    // <p>It makes it easy for developers to share code files and collaborate with fellow developers on open-source projects. GitHub also serves as a social networking site where developers can openly network, collaborate, and pitch their work.</p>
    // <p>Since its founding in 2008, GitHub has acquired millions of users and established itself as a go-to platform for collaborative software projects. This free service comes with several helpful features for sharing code and working with others in real time.</p>
    // <p>On top of its code-Srelated functions, GitHub encourages users to build a personal profile and brand for themselves. You can visit anyone’s profile and see what projects they own and contribute to. This makes GitHub a type of social network for programmers and fosters a collaborative approach to software and <a href="https://blog.hubspot.com/website/website-development?hubs_content=blog.hubspot.com/website/what-is-github-used-for&amp;hubs_content-cta=website%20development" rel="noopener noreferrer" target="_blank" style="color: var(--cl-anchor-color,#0068b1);"><strong>website development</strong></a>.</p>
    // <h3>How does GitHub work?</h3>
    // <p>GitHub users create accounts, upload files, and create coding projects. But the real work of GitHub happens when users begin to collaborate.</p>
    // <p>While anyone can code independently, teams of people build most development projects. Sometimes these teams are all in one place at once time, but more often they work asynchronously. There are many challenges to creating collaborative projects with distributed teams. GitHub makes this process much simpler in a few different ways.</p>
    // `;

    // // State for the list of levels
    // const [nodes, setNodes] = useState([
    //     {
    //         id: 0,
    //         level: 1,
    //         x: 50,
    //         y: 50,
    //         type: 'Checkbox',
    //         due_time: 2,
    //         content: 'Write something... Chiều cao dựa trên chiều cao của văn bản hoặc giá trị mặc định',
    //         ticked: false,
    //         nodeDetail: nodeDetail,
    //         nodeComment: [
    //             {
    //                 userId: '1',
    //                 username: 'KoPhaiVu',
    //                 text: 'haha',
    //                 comment: 'whao',
    //             },
    //             {
    //                 userId: '2',
    //                 username: 'KoPhaiThien',
    //                 text: 'mcc',
    //                 comment: 'whao',
    //             },
    //         ],
    //     },
    //     {
    //         id: 1,
    //         level: 1,
    //         x: 50,
    //         y: 150,
    //         type: 'Checkbox',
    //         due_time: 2,
    //         content:
    //             'Nhạc Remix TikTok | Vạn Sự Tùy Duyên Remix - Phía Xa Vời Có Anh Đang Chờ - Nonstop Nhạc Remix 2024',
    //         ticked: true,
    //         nodeDetail: '',
    //         nodeComment: null,
    //     },
    // ]);

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
        const newId = nodes ? Math.max(...nodes.map((node) => node.id), 0) + 1 : 0;
        const newLevel = {
            id: newId,
            x: x,
            y: y + 100,
            level,
            type,
            ticked: false,
            due_time: 2,
            content: 'Write something...',
            nodeComment: null,
        };

        setNodes((prevLevels) => {
            if (prevLevels === null) return [newLevel];

            // Xác định vị trí chèn node mới
            const insertIndex = prevLevels.findIndex((node, i) => i > index && node.level <= level);
            const updatedNodes =
                insertIndex === -1
                    ? [...prevLevels, newLevel]
                    : [...prevLevels.slice(0, insertIndex), newLevel, ...prevLevels.slice(insertIndex)];

            // Cập nhật id cho các node phía dưới
            return updatedNodes.map((node, idx) => {
                return idx > index ? { ...node, id: node.id + 1 } : node;
            });
        });
    };

    const handleAddChildLevelNode = (index, width, x, y, level, type) => {
        const newId = nodes ? Math.max(...nodes.map((node) => node.id), 0) + 1 : 0;
        const newLevel = {
            id: newId,
            x: x + width + 200,
            y: y,
            level: level + 1,
            type,
            ticked: false,
            due_time: 2,
            content: 'Write something...',
            nodeComment: null,
        };

        setNodes((prevLevels) => {
            if (prevLevels === null) return [newLevel];

            // Xác định vị trí chèn node mới
            const insertIndex = prevLevels.findIndex((node, i) => i > index && node.level <= level);
            const updatedNodes =
                insertIndex === -1
                    ? [...prevLevels, newLevel]
                    : [...prevLevels.slice(0, insertIndex), newLevel, ...prevLevels.slice(insertIndex)];

            // Cập nhật id cho các node phía dưới
            return updatedNodes.map((node, idx) => {
                return idx > index ? { ...node, id: node.id + 1 } : node;
            });
        });
    };

    const nodeBelowType = (index) => {
        return index + 1 < nodes.length && nodes[index + 1].level > nodes[index].level ? nodes[index + 1].type : null;
    };

    // Cập nhật lại addNodeSameLevel để không cần phải gọi hàm này thủ công.
    const updateTickState = (index, updatedNode) => {
        setNodes((prevNodes) => {
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
        console.log(nodes);
        setTimeout(() => setHoveredIndex(null), 0);
    };

    const updateNodeComment = (nodeId, action, commentData = null, commentIndex = null) => {
        setNodes((prevNodes) => {
            return prevNodes.map((node) => {
                if (node.id === nodeId) {
                    let updatedComments = node.nodeComment ? [...node.nodeComment] : [];

                    switch (action) {
                        case 'add':
                            console.log('add');
                            if (commentData) {
                                updatedComments.push(commentData);
                            }
                            break;

                        case 'edit':
                            if (commentIndex !== null && commentData) {
                                updatedComments[commentIndex] = {
                                    ...updatedComments[commentIndex],
                                    ...commentData,
                                };
                            }
                            break;

                        case 'delete':
                            if (commentIndex !== null) {
                                updatedComments.splice(commentIndex, 1);
                            }
                            break;

                        default:
                            console.error('Invalid action:', action);
                            return node;
                    }
                    console.log(node);
                    return { ...node, nodeComment: updatedComments.length > 0 ? updatedComments : null };
                }
                return node;
            });
        });
    };

    const [dialogs, setDialogs] = useState([]); // Array to manage multiple CantClone dialogs

    const handleClose = (id) => {
        setDialogs((prevDialogs) => prevDialogs.filter((dialog) => dialog.id !== id));
    };

    const handleMakeDialog = (type, username) => {
        const newDialog = { id: Date.now(), type: type, username: username };
        setDialogs((prevDialogs) => [...prevDialogs, newDialog]);

        // Automatically remove the CantClone after 3 seconds
        setTimeout(() => {
            setDialogs((prevDialogs) => prevDialogs.filter((dialog) => dialog.id !== newDialog.id));
        }, 3000);

        return;
    };

    const handleOutsideClick = (e) => {
        if (String(e.target.className).includes('modal-overlay')) {
            setShowSetting(false);
        }
    };

    const handleDeleteTimeline = () => {
        const confirmDelete = window.confirm(`Do you really want to delete "${roadName}" roadmap?`);

        if (confirmDelete) {
            window.location.href = '/home';
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('timeline-section')}>
                <div className={cx('important-section')}>
                    <div className={cx('title-container')}>
                        {userType === 'Administrator' ? (
                            <input
                                className={cx('page-title')}
                                value={roadName}
                                onChange={(e) => setRoadName(e.target.value)}
                                onFocus={() => {
                                    if (roadName === 'Name not given') setRoadName('');
                                }}
                                onBlur={async () => {
                                    if (roadName.trim() === '')
                                        setRoadName('Name not given');
                                    if (roadName !== 'Name not given')
                                        await fetchUpdateTimelineTitleContent()
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

                    {userType !== 'Viewer' && (
                        <div className={cx('save-setting')}>
                            <button className={cx('save-btn')} onClick={() => handleMakeDialog('Save', null)}>
                                Save
                            </button>
                            <FontAwesomeIcon
                                icon={faGear}
                                className={cx('setting-btn')}
                                onClick={() => navigate(`/timeline/${id}/setting`)}
                            />
                            <FontAwesomeIcon
                                className={cx('extend-chat')}
                                icon={chatExtended ? faChevronRight : faChevronLeft}
                                onClick={() => setChatExtended(!chatExtended)}
                            />
                        </div>
                    )}

                    {showSetting && (
                        <SettingTimeline
                            setShowSetting={setShowSetting}
                            handleOutsideClick={handleOutsideClick}
                            handleDeleteTimeline={handleDeleteTimeline}
                            handleMakeDialog={handleMakeDialog}
                        />
                    )}
                </div>

                <div className={cx('mini-notify')}>
                    {dialogs.map((dialog) => {
                        switch (dialog.type) {
                            case 'Save':
                                return <Saved key={dialog.id} handleClose={() => handleClose(dialog.id)} />;
                            case 'Add':
                                return (
                                    <NewCollab
                                        key={dialog.id}
                                        handleClose={() => handleClose(dialog.id)}
                                        username={dialog.username}
                                    />
                                );
                            case 'Delete':
                                return (
                                    <DeleteCollab
                                        key={dialog.id}
                                        handleClose={() => handleClose(dialog.id)}
                                        username={dialog.username}
                                    />
                                );
                            default:
                                return null; // Trả về null nếu không khớp type nào
                        }
                    })}
                </div>

                <span
                    className={cx('content', { expanded: contentExpanded })}
                    onClick={() => setIsContentExpanded(!contentExpanded)}
                >
                    {titleText}
                </span>

                <div className={cx('timeline-section')}>
                    {toggle ? (
                        <AdvanceRoadmap
                            userType={userType}
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
                            updateNodeComment={updateNodeComment}
                        />
                    ) : (
                        <RoadmapSection
                            userType={userType}
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
                            updateNodeComment={updateNodeComment}
                        />
                    )}
                </div>
            </div>

            {chatExtended && !toggle && (
                <div className={cx('chat-section', { show: chatExtended })}>
                    <ChatSection profile={profile} groupData={groupData} />
                </div>
            )}
        </div>
    );
}

export default Timeline;
