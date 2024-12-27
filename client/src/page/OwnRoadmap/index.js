import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faA, faCircleDown, faSitemap, faSquarePlus, faPenToSquare as penSolid, faHeart as faHeartSolid, faGear, faXmark, faHeart, faBug } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import Comment from '~/components/Layout/components/Comment/index.js';
import styles from './OwnRoadmap.module.scss';
import classNames from 'classnames/bind';
import RoadmapSection from '~/components/Layout/components/RoadmapSection/index.js';
import AdvanceRoadmap from '~/components/Layout/components/AdvanceRoadmap/index.js';
import SettingRoadmap from '~/components/Layout/components/Dialog/SettingRoadmap/index.js';
import CreateTimeline from '~/components/Layout/components/CreateTimeline/index.js';
import { CantClone, ReportSended } from '~/components/Layout/components/MiniNotification/index.js';
import Saved from '~/components/Layout/components/MiniNotification/Saved/index.js';
import { useNavigate, useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { ReportTimelineRoadmap } from '~/components/Layout/components/Dialog/index.js';

const cx = classNames.bind(styles);

const secretKey = 'kophaivu'; // Khóa bí mật

// Hàm giải mã
const decryptId = (encryptedId) => {
    const normalizedEncryptedId = encryptedId.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = CryptoJS.AES.decrypt(normalizedEncryptedId, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const filterRoadmapNode = (data) => {
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

function OwnRoadmap() {
    const navigate = useNavigate();
    const { id: encryptedId } = useParams();
    const id = decryptId(encryptedId);

    const [profile, setProfile] = useState(null);
    const [roadmapData, setRoadmapData] = useState(null);
    const [nodes, setNodes] = useState([]);

    const [userType, setUserType] = useState("Viewer")
    const [roadName, setRoadName] = useState('Name not given');
    const [titleText, setTitleText] = useState('Make some description');
    const [loved, setLoved] = useState(false);
    const [visibility, setVisibility] = useState("Private");

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
                //console.log("Profile: ", data.data);
                return data.data;
            } else {
                console.error('Error:', data.message || 'Failed to fetch profile data.');
            }
        } catch (error) {
            console.error('Fetch Profile Error:', error);
        }
    };

    const fetchRoadmapData = async () => {
        try {
            const response = await fetch(`http://localhost:3004/roadmap/id/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setRoadmapData(data.data);
                setVisibility(data.data.isPublic ? "Release" : "Private");
                console.log("Roadmap data: ", data.data);

                setNodes(filterRoadmapNode(data.data.node))
                console.log("Nodes after fetching: ", nodes);

                return data.data;
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Fetch Roadmap Error:', error);
        }
    };

    const fetchPatchRoadmap = async (data) => {
        try {
            const response = await fetch(`http://localhost:3004/roadmap/item/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Updated roadmap after react toggle: ', data);
            } else {
                console.error('Failed to update react value');
            }
        } catch (error) {
            console.error('Error while patching react value:', error);
        }
    }

    const fetchDelRoadmap = async () => {
        try {
            const response = await fetch(`http://localhost:3004/roadmap/item/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Roadmap deleted: ", data);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Fetch Roadmap Error:', error);
        }
    };

    const fetchFavoriteData = async () => {
        try {
            const response = await fetch(`http://localhost:3004/favorite/all/owner?page=1&limit=10`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                if (data && Array.isArray(data.data)) {
                    for (let i = 0; i < data.data.length; i++) {
                        if (String(data.data[i].roadmap.id) === id) {
                            setLoved(true)
                            setLoveId(data.data[i].id)
                        }
                    }
                }
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Fetch Favorite Error:', error);
        }
    };

    const fetchNewFavourite = async (userId) => {
        try {
            const response = await fetch('http://localhost:3004/favorite/new', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: userId, roadmapId: id }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Favorite added:', data); // Xử lý dữ liệu nếu cần
            } else {
                console.error('Failed to add favorite. Status:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchDelFavourite = async (id) => {
        try {
            const response = await fetch(`http://localhost:3004/favorite/item/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message || 'Failed to delete favorite.');
                return;
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
            formData.append('tick', nodeData.ticked);
            formData.append('dueTime', nodeData.due_time);
            formData.append('content', nodeData.content);
            formData.append('detail', nodeData.nodeDetail);
            formData.append('roadmap', id);

            const response = await fetch('http://localhost:3004/node/new', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Node added:', data); // Xử lý dữ liệu nếu cần
            } else {
                console.error('Failed to add node. Status:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchAllNodeInRoadmap = async () => {
        try {
            const response = await fetch(`http://localhost:3004/node/all/roadmap/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setNodes(filterRoadmapNode(data.data))
                console.log("Nodes after fetching: ", nodes);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchDelAllNodeInRoadmap = async () => {
        try {
            const response = await fetch(`http://localhost:3004/node/roadmap/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Fetch Roadmap Error:', error);
        }
    };

    const [loveId, setLoveId] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            const fetchedProfile = await fetchProfile();
            const fetchedRoadmapData = await fetchRoadmapData();
            await fetchFavoriteData()

            if (fetchedProfile && fetchedRoadmapData) {
                setUserType(
                    fetchedProfile.id === fetchedRoadmapData.owner.id
                        ? "Administrator"
                        : "Viewer"
                );
                setRoadName(fetchedRoadmapData.title)
                setTitleText(fetchedRoadmapData.content)
            }
            console.log("Id: ", id)
        };
        fetchData();
    }, []);

    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef(null);
    const [contentExpanded, setIsContentExpanded] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [showSetting, setShowSetting] = useState(false);
    const [createTimelineDialog, setCreateTimelineDialog] = useState(false);
    const [createReportDialog, setCreateReportDialog] = useState(false);

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const lineHeight = parseInt(getComputedStyle(textareaRef.current).lineHeight, 10);
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight + lineHeight}px`;
        }
    };

    useEffect(() => {
        if (isEditing) adjustTextareaHeight();
    }, [isEditing, titleText]);

    // Handle focus on title text textarea
    const handleTitleFocus = () => {
        setIsEditing(true)
        if (titleText === 'Make some description') {
            setTitleText(''); // Clear the textarea if it shows "Make some description"
        }
    };

    // Handle blur on title text textarea
    const handleTitleBlur = () => {
        setIsEditing(false)
        if (titleText.trim() === '') {
            setTitleText('Make some description'); // Reset to "Make some description" if textarea is empty
        }
    };

    const handleDeleteRoadmap = async () => {
        const confirmDelete = window.confirm(`Do you really want to delete "${roadName}" roadmap?`);

        if (confirmDelete) {
            await fetchDelRoadmap()
            window.location.href = "/home";
        }
    }

    // const nodeDetail = `
    // <h2>What is GitHub?</h2>
    // <p><span style="background-color: rgb(246, 249, 252); color: rgb(33, 51, 67);">GitHub is an online software development platform. It's used for storing, tracking, and collaborating on software projects. </span></p>
    // <p>It makes it easy for developers to share code files and collaborate with fellow developers on open-source projects. GitHub also serves as a social networking site where developers can openly network, collaborate, and pitch their work.</p>
    // <p>Since its founding in 2008, GitHub has acquired millions of users and established itself as a go-to platform for collaborative software projects. This free service comes with several helpful features for sharing code and working with others in real time.</p>
    // <p>On top of its code-related functions, GitHub encourages users to build a personal profile and brand for themselves. You can visit anyone’s profile and see what projects they own and contribute to. This makes GitHub a type of social network for programmers and fosters a collaborative approach to software and <a href="https://blog.hubspot.com/website/website-development?hubs_content=blog.hubspot.com/website/what-is-github-used-for&amp;hubs_content-cta=website%20development" rel="noopener noreferrer" target="_blank" style="color: var(--cl-anchor-color,#0068b1);"><strong>website development</strong></a>.</p>
    // <h3>How does GitHub work?</h3>
    // <p>GitHub users create accounts, upload files, and create coding projects. But the real work of GitHub happens when users begin to collaborate.</p>
    // <p>While anyone can code independently, teams of people build most development projects. Sometimes these teams are all in one place at once time, but more often they work asynchronously. There are many challenges to creating collaborative projects with distributed teams. GitHub makes this process much simpler in a few different ways.</p>
    // `;

    // const [nodes, setNodes] = useState([
    //     {
    //         id: 1, level: 1, x: 50, y: 50, type: 'Checkbox', ticked: false, due_time: 2,
    //         content: 'Write something... Chiều cao dựa trên chiều cao của văn bản hoặc giá trị mặc định',
    //         nodeDetail: nodeDetail
    //     },
    //     {
    //         id: 2, level: 1, x: 50, y: 150, type: 'Checkbox', ticked: false, due_time: 2,
    //         content: 'Nhạc Remix TikTok | Vạn Sự Tùy Duyên Remix - Phía Xa Vời Có Anh Đang Chờ - Nonstop Nhạc Remix 2024',
    //         nodeDetail: ''
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
        const newId = nodes ? Math.max(...nodes.map(node => node.id), 0) + 1 : 0;
        const newLevel = { id: newId, x: x, y: y + 100, level, type, ticked: false, due_time: 2, content: 'Write something...', nodeDetail: '' };

        setNodes((prevLevels) => {
            if (prevLevels === null) return [newLevel];

            // Xác định vị trí chèn node mới
            const insertIndex = prevLevels.findIndex((node, i) => i > index && node.level <= level);
            const updatedNodes = insertIndex === -1
                ? [...prevLevels, newLevel]
                : [...prevLevels.slice(0, insertIndex), newLevel, ...prevLevels.slice(insertIndex)];

            return updatedNodes;
        });
    };

    const handleAddChildLevelNode = (index, width, x, y, level, type) => {
        const newId = nodes ? Math.max(...nodes.map(node => node.id), 0) + 1 : 0;
        const newLevel = { id: newId, x: x + width + 200, y: y, level: level + 1, type, ticked: false, due_time: 2, content: 'Write something...', nodeDetail: '' };

        setNodes((prevLevels) => {
            if (prevLevels === null) return [newLevel];

            // Xác định vị trí chèn node mới
            const insertIndex = prevLevels.findIndex((node, i) => i > index && node.level <= level);
            const updatedNodes = insertIndex === -1
                ? [...prevLevels, newLevel]
                : [...prevLevels.slice(0, insertIndex), newLevel, ...prevLevels.slice(insertIndex)];

            return updatedNodes;
        });
    };

    const nodeBelowType = (index) => {
        return index + 1 < nodes.length && nodes[index + 1].level > nodes[index].level
            ? nodes[index + 1].type : null;
    }

    const handleSave = async () => {
        await fetchDelAllNodeInRoadmap()
        for (let i = 0; i < nodes.length; i++) {
            await fetchNewNode(nodes[i])
            console.log("Nodes new: ", nodes[i])
        }
        await fetchAllNodeInRoadmap()

        handleMakeDialog('Saved')
    }

    const handleOutsideClick = (e) => {
        if (String(e.target.className).includes('modal-overlay')) {
            setShowSetting(false);
            setCreateTimelineDialog(false);
            setCreateReportDialog(false);
        }
    }

    const [dialogs, setDialogs] = useState([]); // Array to manage multiple CantClone dialogs

    const handleClose = (id) => {
        setDialogs((prevDialogs) => prevDialogs.filter((dialog) => dialog.id !== id));
    };

    const handleMakeDialog = (type) => {
        const newDialog = { id: Date.now(), type: type };
        setDialogs((prevDialogs) => [...prevDialogs, newDialog]);

        // Automatically remove the CantClone after 3 seconds
        setTimeout(() => {
            setDialogs((prevDialogs) => prevDialogs.filter((dialog) => dialog.id !== newDialog.id));
        }, 3000);

        return;
    };

    const handleLove = async () => {
        setLoved(!loved)

        let newReactValue;
        if (loved) {
            newReactValue = roadmapData.react - 1;
            fetchDelFavourite(loveId)
        }
        else {
            newReactValue = roadmapData.react + 1;
            fetchNewFavourite(profile.id)
        }

        await fetchPatchRoadmap({ react: newReactValue })
    }

    const handleClone = () => {
        if (nodes.length < 5)
            handleMakeDialog('Clone')
        else {
            setCreateTimelineDialog(true)
        }
    }

    const handleSetVisibility = async (data) => {
        setVisibility(data)
        const isPublic = data === "Private" ? 0 : 1;
        console.log("isPublic: ", isPublic)
        await fetchPatchRoadmap({ isPublic: isPublic })
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('important-section')}>
                <div className={cx('title-container')}>
                    {userType === 'Administrator' ? (
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
                <div className={cx('report-ss')}>
                    <FontAwesomeIcon
                        className={cx('report')}
                        icon={faBug}
                        onClick={() => setCreateReportDialog(true)} />
                    {userType !== 'Viewer' && (
                        <div className={cx('save-setting')}>
                            <button className={cx('save-btn')} onClick={handleSave}>Save</button>
                            <FontAwesomeIcon
                                icon={faGear}
                                className={cx('setting-btn')}
                                onClick={() => setShowSetting(true)} />
                        </div>
                    )}
                </div>

            </div>

            {showSetting &&
                <SettingRoadmap
                    visibility={visibility}
                    setVisibility={handleSetVisibility}
                    setShowSetting={setShowSetting}
                    handleOutsideClick={handleOutsideClick}
                    handleDeleteRoadmap={handleDeleteRoadmap} />}

            <div className={cx('content-section')}>
                {isEditing ? (
                    <textarea
                        ref={textareaRef}
                        value={titleText}
                        onChange={(e) => setTitleText(e.target.value)}
                        onFocus={handleTitleFocus}
                        onBlur={handleTitleBlur}
                        className={cx('content-input')}
                        autoFocus
                    />
                ) : (
                    <span className={cx('content', { expanded: contentExpanded })} onClick={() => setIsContentExpanded(!contentExpanded)}>
                        {titleText}
                    </span>
                )}
                {userType !== 'Viewer' && (
                    <FontAwesomeIcon
                        className={cx('rewrite-content-btn')}
                        icon={penSolid}
                        onClick={() => setIsEditing(!isEditing)} />
                )}

            </div>
            <div className={cx('roadmap-section')}>
                {!nodes || nodes.length === 0 ? (
                    <div className={cx('add-first-node')} onClick={() => handleSameLevelClick(-1, 50, 0, 1, 'Checkbox')}>
                        <FontAwesomeIcon className={cx('add-button')} icon={faSquarePlus} />
                        <h1 className={cx('add-text')}>Create your first node now!!!</h1>
                    </div>
                ) : (
                    toggle ?
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
                        />
                        :
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
                            nodeBelowType={nodeBelowType} />
                )}


            </div>
            <div className={cx('drop-react')}>
                <button onClick={() => handleLove()} className={cx('react-love', { loved })}>
                    <FontAwesomeIcon className={cx('love-roadmap')} icon={loved ? faHeart : faHeartRegular} />
                    <h1 className={cx('love-text')}>Love</h1>
                </button>
                <button className={cx('clone-roadmap')} onClick={() => handleClone()} >
                    <FontAwesomeIcon className={cx('clone-icon')} icon={faCircleDown} />
                    <h1 className={cx('clone-text')}>Clone</h1>
                </button>
            </div>

            <div className={cx('mini-notify')}>
                {dialogs.map((dialog) => (
                    dialog.type === 'Clone' ? (
                        <CantClone key={dialog.id} handleClose={() => handleClose(dialog.id)} />
                    ) : dialog.type === 'Saved' ? (
                        <Saved key={dialog.id} handleClose={() => handleClose(dialog.id)} />
                    ) : dialog.type === 'Report' ? (
                        <ReportSended />

                    ) : null
                ))}
            </div>

            {createTimelineDialog &&
                <CreateTimeline
                    children={roadmapData}
                    title={roadName}
                    setTitle={setRoadName}
                    content={titleText}
                    setContent={setTitleText}
                    handleOutsideClick={handleOutsideClick}
                    setShowDialog={setCreateTimelineDialog}
                />}
            {createReportDialog &&
                <ReportTimelineRoadmap
                    type='roadmap'
                    profile={profile}
                    roadmapData={roadmapData}
                    handleOutsideClick={handleOutsideClick}
                    setShowSetting={setCreateReportDialog}
                    handleMakeDialog={handleMakeDialog} />}
            <Comment />
        </div>
    );
}

export default OwnRoadmap;