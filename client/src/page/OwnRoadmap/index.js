import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faA, faCircleDown, faSitemap, faSquarePlus, faPenToSquare as penSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import Comment from '~/components/Layout/components/Comment/index.js';
import styles from './OwnRoadmap.module.scss';
import classNames from 'classnames/bind';
import RoadmapSection from '~/components/Layout/components/RoadmapSection/index.js';
import AdvanceRoadmap from '~/components/Layout/components/AdvanceRoadmap/index.js';

const cx = classNames.bind(styles);

function OwnRoadmap() {
    const [roadName, setRoadName] = useState('Name not given');
    const [titleText, setTitleText] = useState('Make some description');
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef(null);
    const [contentExpanded, setIsContentExpanded] = useState(false);
    const [loved, setLoved] = useState(false);
    const [toggle, setToggle] = useState(false);

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

    // Handle focus on road name input
    const handleFocus = () => {
        if (roadName === 'Name not given') {
            setRoadName(''); // Clear the input if it shows "Name not given"
        }
    };

    // Handle blur on road name input
    const handleBlur = () => {
        if (roadName.trim() === '') {
            setRoadName('Name not given'); // Reset to "Name not given" if input is empty
        }
    };

    // Handle change for road name input
    const handleRoadNameChange = (e) => {
        const value = e.target.value;
        setRoadName(value);
    };

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

    const [nodes, setNodes] = useState([
        { id: 1, level: 1, x: 50, y: 50, type: 'Checkbox', ticked: false, due_time: 2, content: 'Write something... Chiều cao dựa trên chiều cao của văn bản hoặc giá trị mặc định' },
        { id: 2, level: 1, x: 50, y: 150, type: 'Checkbox', ticked: false, due_time: 2, content: 'Nhạc Remix TikTok | Vạn Sự Tùy Duyên Remix - Phía Xa Vời Có Anh Đang Chờ - Nonstop Nhạc Remix 2024' },
    ]);
    //const [nodes, setNodes] = useState(null);

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
        const newId = index + 1;
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
        const newId = index + 1; // Đặt id mới là index + 1
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

    return (
        <div className={cx('wrapper')}>
            <div className={cx('important-section')}>
                <input
                    className={cx('page-title')}
                    value={roadName}
                    onChange={handleRoadNameChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />

                <FontAwesomeIcon
                    onClick={() => setToggle(!toggle)}
                    icon={toggle ? faSitemap : faA}
                    className={cx('toggle-icon')} />
            </div>

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
                <FontAwesomeIcon className={cx('rewrite-content-btn')} icon={penSolid} onClick={() => setIsEditing(!isEditing)} />
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
                            nodes={nodes}
                            setNodes={setNodes}
                            updateNodeContent={updateNodeContent}
                            updateNodeDue={updateNodeDue}
                            handleDeleteNode={handleDeleteNode}
                            handleSameLevelClick={handleSameLevelClick}
                            handleAddChildLevelNode={handleAddChildLevelNode}
                            nodeBelowType={nodeBelowType}
                        />
                        :
                        <RoadmapSection
                            nodes={nodes}
                            setNodes={setNodes}
                            updateNodeContent={updateNodeContent}
                            updateNodeDue={updateNodeDue}
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
                <button className={cx('clone-roadmap')}>
                    <FontAwesomeIcon className={cx('clone-icon')} icon={faCircleDown} />
                    <h1 className={cx('clone-text')}>Clone</h1>
                </button>
            </div>
            <Comment />
        </div>
    );
}

export default OwnRoadmap;