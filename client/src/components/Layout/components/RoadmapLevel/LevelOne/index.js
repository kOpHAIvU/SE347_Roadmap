import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './LevelOne.module.scss';
import classNames from 'classnames/bind';
import { faSquare, faSquarePlus, faTrashCan, faPenToSquare as penRegular, faCircle } from '@fortawesome/free-regular-svg-icons';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';


const cx = classNames.bind(styles);

function LevelOne({ children, index, handleSameLevelClick, updateNodeContent, handleDeleteNode, allNodes }) {
    const [ticked, setTicked] = useState(children.ticked);
    const [content, setContent] = useState(children.content);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setTicked(children.ticked);
        setContent(children.content);
    }, [children]);

    const handleUpdateNode = (updatedTicked = ticked, updatedContent = content) => {
        const updatedNode = { ...children, ticked: updatedTicked, content: updatedContent };
        updateNodeContent(index, updatedNode); // Call the parent's update function
    };

    const [showHiddenSection, setShowHiddenSection] = useState(false); // Control hidden section visibility
    const timeoutRef = useRef(null); // Store timeout ID for clearing

    // Handle mouse enter
    const handleMouseEnter = () => {
        setShowHiddenSection(true); // Show immediately on hover
        clearTimeout(timeoutRef.current); // Clear any existing timeout
    };

    // Handle mouse leave with a delay
    const handleMouseLeave = () => {
        // Start a timeout to hide the section after 3 seconds
        timeoutRef.current = setTimeout(() => {
            setShowHiddenSection(false); // Hide after delay
        }, 1500); // Delay of 3 seconds
    };

    // Clear timeout on component unmount
    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    // Kiểm tra loại node ngay dưới node hiện tại
    const getNodeBelowTypeAndLevel = () => {
        if (index + 1 < allNodes.length) {
            const belowNode = allNodes[index + 1];
            if (belowNode.level > children.level) {
                return belowNode.type; // Trả về loại node ngay dưới nếu nó có level cao hơn
            }
        }
        return null; // Nếu không có node nào dưới hoặc không có level cao hơn
    };

    const nodeBelowType = getNodeBelowTypeAndLevel();

    return (
        <div className={cx('level-one')} key={children.id}>
            <div className={cx('show-section')}
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
                    <div
                        onClick={() => {
                            const newTicked = true;  // Set ticked to true
                            setTicked(newTicked);  // Update local state
                            handleUpdateNode(newTicked);
                        }}
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
                        onClick={() => setIsEditing()}
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

            <div className={cx('hidden-section', { visible: showHiddenSection })}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <FontAwesomeIcon
                    className={cx('same-level')}
                    icon={faSquarePlus}
                    onClick={() => {
                        handleSameLevelClick(index, children.level)
                    }}
                />
                {/* Ẩn child-level-check nếu node bên dưới có level cao hơn và là Checkbox */}
                {nodeBelowType === 'Checkbox' ? null : (
                    <FontAwesomeIcon className={cx('child-level-check')} icon={faSquare} />
                )}
                {/* Ẩn child-level-radio nếu node bên dưới có level cao hơn và là RadioButton */}
                {nodeBelowType === 'RadioButton' ? null : (
                    <FontAwesomeIcon className={cx('child-level-radio')} icon={faCircle} />
                )}
            </div>
        </div>
    );
}

export default LevelOne;
