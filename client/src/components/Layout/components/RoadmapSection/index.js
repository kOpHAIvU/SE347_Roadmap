import classNames from 'classnames/bind';
import styles from './RoadmapSection.module.scss';
import { LevelOne, LevelThree, LevelTwo } from '../RoadmapLevel/index.js';

const cx = classNames.bind(styles);

function RoadmapSection({ userType, nodes, updateNodeContent
    , updateNodeDue, handleDeleteNode, updateNodeDetail, handleSameLevelClick
    , handleAddChildLevelNode, nodeBelowType, updateTickState, updateNodeComment
}) {
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
                                updateNodeDue={updateNodeDue}
                                updateNodeDetail={updateNodeDetail}
                                handleDeleteNode={handleDeleteNode}
                                handleSameLevelClick={handleSameLevelClick}
                                handleAddChildLevelNode={handleAddChildLevelNode}
                                nodeBelowTypes={nodeBelowType(index)}
                                updateTickState={updateTickState}
                                updateNodeComment={updateNodeComment}
                            />
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default RoadmapSection;