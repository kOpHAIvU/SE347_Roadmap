import classNames from 'classnames/bind';
import styles from './RoadmapSection.module.scss';
import { LevelOne, LevelThree, LevelTwo } from '../RoadmapLevel/index.js';

const cx = classNames.bind(styles);

function RoadmapSection({ userType, nodes, updateNodeContent
    , updateNodeDue, handleDeleteNode, handleSameLevelClick
    , handleAddChildLevelNode, nodeBelowType, updateTickState }) {
    return (
        <div className={cx('wrapper')}>
            {nodes && nodes.length > 0 && (
                nodes.map((node, index) => {
                    const LevelComponent = node.level === 1 ? LevelOne : node.level === 2 ? LevelTwo : LevelThree;
                    return (
                        <div key={node.id}>
                            <LevelComponent
                                userType={userType}
                                node={node}
                                index={index}
                                updateNodeContent={updateNodeContent}
                                handleDeleteNode={handleDeleteNode}
                                updateNodeDue={updateNodeDue}
                                handleSameLevelClick={handleSameLevelClick}
                                handleAddChildLevelNode={handleAddChildLevelNode}
                                nodeBelowTypes={nodeBelowType(index)}
                                updateTickState={updateTickState}
                            />
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default RoadmapSection;