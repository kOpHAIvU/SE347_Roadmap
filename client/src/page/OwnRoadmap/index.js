import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDown, faSquarePlus, faPenToSquare as penSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import LevelOne from '~/components/Layout/components/RoadmapLevel/LevelOne/index.js';
import LevelTwo from '~/components/Layout/components/RoadmapLevel/LevelTwo/index.js';
import LevelThree from '~/components/Layout/components/RoadmapLevel/LevelThree/index.js';
import Comment from '~/components/Layout/components/Comment/index.js';
import styles from './OwnRoadmap.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function OwnRoadmap() {
    const [roadName, setRoadName] = useState('Name not given');
    const [titleText, setTitleText] = useState('GitHub là một hệ thống quản lý dự án ...');
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef(null);
    const [contentExpanded, setIsContentExpanded] = useState(false);
    const [loved, setLoved] = useState(false);
    const [nodes, setNodes] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    
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

    const updateNodeContent = (index, newContent) => {
        setNodes((prevNodes) => {
            const updatedNodes = [...prevNodes];
            updatedNodes[index] = { ...updatedNodes[index], content: newContent };
            return updatedNodes;
        });
    };

    const handleSameLevelClick = (index, level, type) => {
        const newId = nodes ? nodes.length + 1 : 1;
        const newLevel = { id: newId, level, type, ticked: false, due_time: 2, content: 'Write something...' };

        setNodes((prevLevels) => {
            if (prevLevels === null) return [newLevel];
            const insertIndex = prevLevels.findIndex((node, i) => i > index && node.level <= level);
            return insertIndex === -1 
                ? [...prevLevels, newLevel] 
                : [...prevLevels.slice(0, insertIndex), newLevel, ...prevLevels.slice(insertIndex)];
        });
    };

    const handleAddChildLevelNode = (index, level, type) => {
        const newId = (nodes.length + 1);
        const newLevel = { id: newId, level: level + 1, type, ticked: false, due_time: 1, content: 'Write something...' };

        const insertIndex = nodes.findIndex((node, i) => i > index && node.level <= level) || nodes.length;
        setNodes((prevLevels) => [
            ...prevLevels.slice(0, insertIndex),
            newLevel,
            ...prevLevels.slice(insertIndex),
        ]);
    };

    const handleDeleteNode = (index) => {
        setNodes((prevNodes) => {
            const updatedNodes = [...prevNodes];
            updatedNodes.splice(index, 1);
            for (let i = index; i < updatedNodes.length;) {
                if (updatedNodes[i].level > updatedNodes[index].level) updatedNodes.splice(i, 1);
                else break;
            }
            return updatedNodes;
        });
    };

    const handleDueTimeChange = (index, newDueTime) => {
        setNodes((prevNodes) => {
            const updatedNodes = [...prevNodes];
            updatedNodes[index] = { ...updatedNodes[index], due_time: newDueTime };
            return updatedNodes;
        });
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
                        value={titleText}
                        onChange={(e) => setTitleText(e.target.value)}
                        onBlur={() => setIsEditing(false)}
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
                    <div className={cx('add-first-node')} onClick={() => handleSameLevelClick(0, 1, 'Checkbox')}>
                        <FontAwesomeIcon className={cx('add-button')} icon={faSquarePlus} />
                        <h1 className={cx('add-text')}>Create your first node now!!!</h1>
                    </div>
                ) : (
                    nodes.map((node, index) => {
                        const LevelComponent = node.level === 1 ? LevelOne : node.level === 2 ? LevelTwo : LevelThree;
                        return (
                            <LevelComponent
                                key={node.id}
                                userType='Administrator'
                                children={node}
                                index={index}
                                handleSameLevelClick={handleSameLevelClick}
                                handleAddChildLevelNode={handleAddChildLevelNode}
                                updateNodeContent={updateNodeContent}
                                handleDeleteNode={handleDeleteNode}
                                allNodes={nodes}
                                hoveredIndex={hoveredIndex}
                                setHoveredIndex={setHoveredIndex}
                                handleDueTimeChange={handleDueTimeChange}
                            />
                        );
                    })
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