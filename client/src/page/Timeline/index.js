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
            const response = await fetch('http://44.245.39.225:3004/auth/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setProfile(data.data);
                console.log("Profile", data.data)
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
            const response = await fetch(`http://44.245.39.225:3004/timeline/item/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                if (data.statusCode !== 404) {
                    setRoadName(data.data.title)
                    setTitleText(data.data.content)
                    const nodesArray = [];
                    for (const [i, node] of data.data.node.entries()) {
                        const filteredNode = await filterTimelineNode(i, node);
                        nodesArray.push(filteredNode);
                    }

                    setNodes(nodesArray);

                    return data.data;
                }
                navigate('/home')
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
                navigate('/home')
            }
        } catch (error) {
            console.error('Fetch Roadmap Error:', error);
        }
    };
    console.log(userType)

    const fetchUpdateTimelineTitleContent = async () => {
        try {
            const response = await fetch(`http://44.245.39.225:3004/timeline/item/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: roadName,
                    content: titleText
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("PATCH: ", data);
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
            const response = await fetch(`http://44.245.39.225:3004/group-division/timelineId/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log("gr: ", data.data.groupDivisions)
                setGroupData(data.data.groupDivisions)
                return data.data;
            } else {
                console.error(data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchNewNode = async (nodeData) => {
        try {
            const formData = new URLSearchParams();
            formData.append('level', nodeData.level);
            formData.append('xAxis', nodeData.x);
            formData.append('yAxis', nodeData.y);
            formData.append('type', nodeData.type);
            formData.append('tick', nodeData.ticked ? '1' : '0');
            formData.append('dueTime', nodeData.due_time);
            formData.append('content', nodeData.content);
            formData.append('detail', nodeData.nodeDetail);
            formData.append('timeline', id);

            const response = await fetch('http://44.245.39.225:3004/node/new', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Node added:', data);
                return data.data
            } else {
                console.error('Failed to add node. Status:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const filterTimelineNode = async (id, data) => {
        //console.log("Nodes: ", data)
        const commentData = await fetchNodeComment(data.id);
        //console.log("commentData: ", commentData)
        if (commentData) {
            const filteredComments = commentData.map(comment => ({
                userId: comment.poster?.id,
                username: comment.poster?.fullName,
                title: comment.title,
                content: comment.content,
                id: id,
            }));
            return {
                id: id + 1,
                level: data.level,
                x: data.xAxis,
                y: data.yAxis,
                type: data.type,
                ticked: data.tick,
                due_time: data.dueTime,
                content: data.content,
                nodeDetail: data.detail,
                nodeComment: filteredComments,
            }
        }
    }

    const fetchDelAllNodeInTimeline = async () => {
        try {
            const response = await fetch(`http://44.245.39.225:3004/node/timeline/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                //console.log(data);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Fetch Roadmap Error:', error);
        }
    };

    const fetchNewNodeComment = async (nodeId, comment) => {
        try {
            //console.log("Title hehe: ", comment)
            const body = new URLSearchParams({
                content: comment.content,
                poster: comment.userId,
                title: comment.title,
                node: nodeId
            }).toString();
            //console.log("Body: ", body)

            const response = await fetch('http://44.245.39.225:3004/comment/new', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body,
            });

            const data = await response.json();
            if (response.ok) {
                //console.log("Comment added: ", data)
                return data.data;
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Fetch Node Comment Error:', error);
        }
    };

    const fetchDelNodeComment = async (commentId) => {
        try {
            const response = await fetch(`http://44.245.39.225:3004/comment/item/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                //console.log("Node comment deleted: ", data)
                return data.data;
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Fetch Node Comment Error:', error);
        }
    };

    const fetchNodeComment = async (nodeId) => {
        try {
            const response = await fetch(`http://44.245.39.225:3004/comment/node/${nodeId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                return data.data;
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Fetch Node Comment Error:', error);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            //console.log("Id: ", id)
            const fetchedProfile = await fetchProfile();
            const fetchedTimelineData = await fetchTimelineData();
            const fetchedGroupDivisonData = await fetchGetGroupDivisionByTimeline();
            if (fetchedProfile && fetchedTimelineData && fetchedGroupDivisonData) {
                console.log("fetc: ", fetchedGroupDivisonData)
                for (let i = 0; i < fetchedGroupDivisonData.totalRecords; i++) {
                    const groupDivision = fetchedGroupDivisonData.groupDivisions[i];
                    if (fetchedProfile.id === groupDivision.user.id) {
                        switch (groupDivision.role) {
                            case 1:
                                setUserType("Administrator");
                                return;
                            case 2:
                                setUserType("Editor");
                                return;
                            case 3:
                                setUserType("Viewer");
                                return;
                            default:
                                navigate('/home')
                        }
                    }
                }
                navigate('/home')
            }
        }
        fetchData();
    }, [id])

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
        //console.log('newId: ', newId)
        const newLevel = {
            id: newId,
            x: x,
            y: y + 100,
            level,
            type,
            ticked: false,
            due_time: 2,
            content: 'Write something...',
            nodeComment: [],
        };

        setNodes((prevLevels) => {
            if (prevLevels === null) return [newLevel];

            // Xác định vị trí chèn node mới
            const insertIndex = prevLevels.findIndex((node, i) => i > index && node.level <= level);
            const updatedNodes =
                insertIndex === -1
                    ? [...prevLevels, newLevel]
                    : [...prevLevels.slice(0, insertIndex), newLevel, ...prevLevels.slice(insertIndex)];

            return updatedNodes;

            // // Cập nhật id cho các node phía dưới
            // return updatedNodes.map((node, idx) => {
            //     return idx > index ? { ...node, id: node.id + 1 } : node;
            // });
        });
    };

    const handleAddChildLevelNode = (index, width, x, y, level, type) => {
        const newId = nodes ? Math.max(...nodes.map((node) => node.id), 0) + 1 : 0;
        //console.log('newId: ', newId)
        const newLevel = {
            id: newId,
            x: x + width + 200,
            y: y,
            level: level + 1,
            type,
            ticked: false,
            due_time: 2,
            content: 'Write something...',
            nodeComment: [],
        };

        setNodes((prevLevels) => {
            if (prevLevels === null) return [newLevel];

            // Xác định vị trí chèn node mới
            const insertIndex = prevLevels.findIndex((node, i) => i > index && node.level <= level);
            const updatedNodes =
                insertIndex === -1
                    ? [...prevLevels, newLevel]
                    : [...prevLevels.slice(0, insertIndex), newLevel, ...prevLevels.slice(insertIndex)];

            return updatedNodes;

            // // Cập nhật id cho các node phía dưới
            // return updatedNodes.map((node, idx) => {
            //     return idx > index ? { ...node, id: node.id + 1 } : node;
            // });
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
        //console.log(nodes);
        setTimeout(() => setHoveredIndex(null), 0);
    };

    console.log(nodes)

    const updateNodeComment = (nodeId, action, commentData = null, commentIndex = null) => {
        setNodes((prevNodes) => {
            return prevNodes.map((node) => {
                //console.log(node.id, "  ", nodeId)
                if (node.id === nodeId + 1) {
                    let updatedComments = node.nodeComment ? [...node.nodeComment] : [];
                    console.log("Up: ", updatedComments)

                    switch (action) {
                        case 'add':
                            console.log("Add", commentData)
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

    const handleSave = async () => {
        await fetchDelAllNodeInTimeline()
        for (let i = 0; i < nodes.length; i++) {
            const nodeId = await fetchNewNode(nodes[i])
            console.log("Nodes new: ", nodeId)

            // Fetch comment
            if (nodeId) {
                if (Array.isArray(nodes[i].nodeComment)) {
                    for (let j = 0; j < nodes[i].nodeComment.length; j++) {
                        // Del old comment if id is not null
                        if (nodes[i].nodeComment[j].id !== null) {
                            //console.log("Node comment del id: ", nodes[i].nodeComment[j].id);
                            await fetchDelNodeComment(nodes[i].nodeComment[j].id);
                        }
                        // Post new comment
                        await fetchNewNodeComment(nodeId.id, nodes[i].nodeComment[j]);
                    }
                }
            }
        }

        handleMakeDialog('Save', null)
    }

    useEffect(() => {
        const intervalId = setInterval(async () => {
            await handleSave();
        }, 5 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('timeline-section', { chatextend: chatExtended })}>
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
                            <button className={cx('save-btn')} onClick={handleSave}>
                                Save
                            </button>
                            <FontAwesomeIcon
                                icon={faGear}
                                className={cx('setting-btn')}
                                onClick={() => navigate(`/timeline/${encryptedId}/setting`)} />
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

            {
                chatExtended && !toggle && (
                    <div className={cx('chat-section', { show: chatExtended })}>
                        <ChatSection profile={profile} groupData={groupData} />
                    </div>
                )
            }
        </div >
    );
}

export default Timeline;
