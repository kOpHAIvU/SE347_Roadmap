import classNames from 'classnames/bind';
import styles from './RoadmapSection.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LevelOne, LevelThree, LevelTwo } from '../RoadmapLevel/index.js';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const cx = classNames.bind(styles);

function RoadmapSection() {
    const [nodes, setNodes] = useState(null);

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
        const newId = nodes ? nodes.length + 1 : 1;
        const newLevel = { id: newId, level: level + 1, type, ticked: false, due_time: 2, content: 'Write something...' };

        setNodes((prevLevels) => {
            if (prevLevels === null) return [newLevel];
            const insertIndex = prevLevels.findIndex((node, i) => i > index && node.level <= level);
            return insertIndex === -1
                ? [...prevLevels, newLevel]
                : [...prevLevels.slice(0, insertIndex), newLevel, ...prevLevels.slice(insertIndex)];
        });
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
            { nodes === null ? (
                <div className={cx('add-first-node')} onClick={() => handleSameLevelClick(0, 1, 'Checkbox')}>
                    <FontAwesomeIcon className={cx('add-button')} icon={faSquarePlus} />
                    <h1 className={cx('add-text')}>Create your first node now!!!</h1>
                </div>
            ) : (
                nodes.map((node, index) => {
                    const LevelComponent = node.level === 1 ? LevelOne : node.level === 2 ? LevelTwo : LevelThree;
                    return (
                        <div key={node.id}>
                            <LevelComponent
                                userType='Administrator'
                                children={node}
                                index={index}
                                handleSameLevelClick={handleSameLevelClick}
                                handleAddChildLevelNode={handleAddChildLevelNode}
                                updateNodeContent={updateNodeContent}
                                handleDeleteNode={handleDeleteNode}
                                allNodes={nodes}
                                handleDueTimeChange={handleDueTimeChange}
                            />
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default RoadmapSection;