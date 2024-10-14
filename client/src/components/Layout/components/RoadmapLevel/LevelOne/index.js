import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './LevelOne.module.scss';
import classNames from 'classnames/bind';
import { faSquare, faSquarePlus, faTrashCan, faPenToSquare as penRegular, faCircle } from '@fortawesome/free-regular-svg-icons';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';


const cx = classNames.bind(styles);

function LevelOne({ children, index, handleSameLevelClick, handleAddChildLevelNode, updateNodeContent, handleDeleteNode, allNodes, hoveredIndex, setHoveredIndex }) {
    const [ticked, setTicked] = useState(children.ticked);
    const [content, setContent] = useState(children.content);
    const [isEditing, setIsEditing] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        setTicked(children.ticked);
        setContent(children.content);
    }, [children]);

    const handleUpdateNode = (updatedTicked = ticked, updatedContent = content) => {
        const updatedNode = { ...children, ticked: updatedTicked, content: updatedContent };
        updateNodeContent(index, updatedNode); // Call the parent's update function
    };

    const handleMouseEnter = () => {
        // Clear any existing timeout when mouse enters
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setHoveredIndex(index); // Update the hovered index
    };

    const handleMouseLeave = () => {
        // Set a timeout of 1.5 seconds to hide the section
        timeoutRef.current = setTimeout(() => {
            setHoveredIndex(null); // Reset hovered index after delay
        }, 1500);
    };

    // Kiểm tra loại node ngay dưới node hiện tại
    const getNodeBelowTypeAndLevel = () => {
        if (index + 1 < allNodes.length) {
            const belowNode = allNodes[index + 1];
            if (belowNode.level > children.level) {
                return belowNode.type; // Trả về loại node ngay dưới nếu có level cao hơn
            }
        }
        return null; // Nếu không có node dưới hoặc không có level cao hơn
    };

    const nodeBelowType = getNodeBelowTypeAndLevel();

    return (
        <div className={cx('level-one')} key={children.id}>
            <div className={cx('show-section', { 'with-hidden-section': hoveredIndex === index })}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                {ticked ? (
                    <FontAwesomeIcon
                        onClick={() => {
                            const newTicked = false;  // Set ticked to false
                            setTicked(newTicked);  // Update local state
                            handleUpdateNode(newTicked);
                        }}
                        icon={faSquareCheck}
                        className={cx('ticked')}
                    />
                ) : (
                    <FontAwesomeIcon
                        onClick={() => {
                            const newTicked = true;  // Set ticked to true
                            setTicked(newTicked);  // Update local state
                            handleUpdateNode(newTicked);
                        }}
                        icon={faSquare}
                        className={cx('tick')}
                    />
                )}

                {isEditing ? (
                    <input
                        className={cx('level-one-content-edit')}
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onBlur={() => {
                            setIsEditing(false);
                            handleUpdateNode();
                        }}
                        autoFocus
                    />

                ) : (
                    <h1 className={cx('level-one-content')}>{content}</h1>
                )}

                <div className={cx('update-node')}>
                    <FontAwesomeIcon
                        onClick={() => setIsEditing(true)}
                        icon={penRegular}
                        className={cx('rewrite-node')}
                    />

                    <FontAwesomeIcon
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNode(index)
                        }}
                        icon={faTrashCan}
                        className={cx('delete-node')} />
                </div>
            </div>

            <div
                className={cx('hidden-section', {
                    visible: hoveredIndex === index,
                })}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <FontAwesomeIcon
                    className={cx('same-level')}
                    icon={faSquarePlus}
                    onClick={() => {
                        handleSameLevelClick(index, children.level, children.type)
                    }}
                />
                {/* Ẩn child-level-check nếu node bên dưới có level cao hơn và là Checkbox */}
                {nodeBelowType === 'Checkbox' || nodeBelowType === null ? (
                    <FontAwesomeIcon
                        className={cx('child-level-check')}
                        icon={faSquare}
                        onClick={() => handleAddChildLevelNode(index, children.level, 'Checkbox')}
                    />
                ) : null}
                {nodeBelowType === 'RadioButton' || nodeBelowType === null ? (
                    <FontAwesomeIcon
                        className={cx('child-level-radio')}
                        icon={faCircle}
                        onClick={() => handleAddChildLevelNode(index, children.level, 'RadioButton')}
                    />
                ) : null}
            </div>
        </div>
    );
}

export default LevelOne;
