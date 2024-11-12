import classNames from 'classnames/bind';
import styles from './RoadmapSection.module.scss';
import { LevelOne, LevelThree, LevelTwo } from '../RoadmapLevel/index.js';

const cx = classNames.bind(styles);

function RoadmapSection({ nodes, updateNodeContent, updateNodeDue, handleDeleteNode, handleSameLevelClick, handleAddChildLevelNode, nodeBelowType }) {
    return (
        <div className={cx('wrapper')}>
            {nodes && nodes.length > 0 && (
                nodes.map((node, index) => {
                    const LevelComponent = node.level === 1 ? LevelOne : node.level === 2 ? LevelTwo : LevelThree;
                    return (
                        <div key={node.id}>
                            <LevelComponent
                                userType="Administrator"
                                node={node}
                                index={index}
                                updateNodeContent={updateNodeContent}
                                handleDeleteNode={handleDeleteNode}
                                updateNodeDue={updateNodeDue}
                                handleSameLevelClick={handleSameLevelClick}
                                handleAddChildLevelNode={handleAddChildLevelNode}
                                nodeBelowTypes={nodeBelowType(index)}
                            />
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default RoadmapSection;