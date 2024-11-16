import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faA, faCircleDown, faSitemap, faSquarePlus, faPenToSquare as penSolid, faHeart as faHeartSolid, faGear, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import Comment from '~/components/Layout/components/Comment/index.js';
import styles from './OwnRoadmap.module.scss';
import classNames from 'classnames/bind';
import RoadmapSection from '~/components/Layout/components/RoadmapSection/index.js';
import AdvanceRoadmap from '~/components/Layout/components/AdvanceRoadmap/index.js';
import SettingRoadmap from '~/components/Layout/components/SettingRoadmap/index.js';
import CreateTimeline from '~/components/Layout/components/CreateTimeline/index.js';
import { CantClone } from '~/components/Layout/components/MiniNotification/index.js';

const cx = classNames.bind(styles);

function OwnRoadmap() {
    const userType = 'Administrator'
    const [roadName, setRoadName] = useState('Name not given');
    const [titleText, setTitleText] = useState('Make some description');
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef(null);
    const [contentExpanded, setIsContentExpanded] = useState(false);
    const [loved, setLoved] = useState(false);
    const [toggle, setToggle] = useState(true);
    const [showSetting, setShowSetting] = useState(false);
    const [visibility, setVisibility] = useState("Private");
    const [createTimelineDialog, setCreateTimelineDialog] = useState(false);

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

    const handleDeleteRoadmap = () => {
        const confirmDelete = window.confirm(`Do you really want to delete "${roadName}" roadmap?`);

        if (confirmDelete) {
            window.location.href = "/home";
        }
    }

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
    //const [nodes, setNodes] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3004/roadmap/all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setNodes(result);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchData();
    }, []);

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
        console.log(newId)
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

    const handleSave = () => {
        alert("Your changes have been saved!");
        console.log("Lưu ở đây nhóe thím Lon, lấy cái nodes mà post lên")
    }

    const handleOutsideClick = (e) => {
        if (String(e.target.className).includes('modal-overlay')) {
            setShowSetting(false);
            setCreateTimelineDialog(false);
        }
    }

    const [errorDialogs, setErrorDialogs] = useState([]); // Array to manage multiple CantClone dialogs

    const handleClose = (id) => {
        setErrorDialogs((prevDialogs) => prevDialogs.filter((dialog) => dialog.id !== id));
    };

    const handleCloneClick = () => {
        if (nodes.length < 5) {
            const newDialog = { id: Date.now() }; // Unique ID for each CantClone
            setErrorDialogs((prevDialogs) => [...prevDialogs, newDialog]);

            // Automatically remove the CantClone after 3 seconds
            setTimeout(() => {
                setErrorDialogs((prevDialogs) => prevDialogs.filter((dialog) => dialog.id !== newDialog.id));
            }, 3000);

            return;
        }
        setCreateTimelineDialog(true);
    };

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

            {showSetting &&
                <SettingRoadmap
                    visibility={visibility}
                    setVisibility={setVisibility}
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
                {nodes === null ? (
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
                <button onClick={() => setLoved(!loved)} className={cx('react-love', { loved })}>
                    <FontAwesomeIcon className={cx('love-roadmap')} icon={faHeartRegular} />
                    <h1 className={cx('love-text')}>Love</h1>
                </button>
                <button className={cx('clone-roadmap')} onClick={handleCloneClick} >
                    <FontAwesomeIcon className={cx('clone-icon')} icon={faCircleDown} />
                    <h1 className={cx('clone-text')}>Clone</h1>
                </button>
            </div>

            <div className={cx('mini-notify')}>
                {errorDialogs.map((dialog) => (
                    <CantClone key={dialog.id} handleClose={() => handleClose(dialog.id)} />
                ))}
            </div>
            {createTimelineDialog &&
                <CreateTimeline
                    newId="hehe"
                    title={roadName}
                    setTitle={setRoadName}
                    content={titleText}
                    setContent={setTitleText}
                    handleOutsideClick={handleOutsideClick}
                    setShowDialog={setCreateTimelineDialog}
                />}
            <Comment />
        </div>
    );
}

export default OwnRoadmap;