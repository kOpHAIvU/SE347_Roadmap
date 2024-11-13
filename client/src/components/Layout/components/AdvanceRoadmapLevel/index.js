import React, { useEffect, useRef, useState } from 'react';
import { Circle, Image, Rect, Text } from 'react-konva';
import TrashCanIcon from '~/assets/images/trash-can-regular.svg'
import PenRegular from '~/assets/images/pen-to-square-regular.svg'
import NodeDetail from '../NodeDetail/index.js';


function AdvanceRoadmapLevel({ userType, node, index, onDragMove, updateNodeContent
    , updateNodeDue, updateNodeDetail, handleDeleteNode, handleSameLevelClick
    , handleAddChildLevelNode, nodeBelowTypes }) {
    const textRef = useRef(null);
    const dueTimeRef = useRef(null)
    const textareaRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(node.content);
    const [due, setDue] = useState(node.due_time);
    const [dueWidth, setDueWidth] = useState((due.toString().length + 5) * 8)
    const [textLines, setTextLines] = useState(1);
    const [textWidth, setTextWidth] = useState(Math.max(Math.min(content.length * 8, 350), 200));
    const [finalWidth, setFinalWidth] = useState(textWidth + dueWidth + 55); // Thêm state cho finalWidth

    const getScale = (isActive, isHovered) => isActive ? 0.95 : isHovered ? 1.1 : 1;
    console.log("Due: ", dueWidth)

    const [isCheckboxHovered, setIsCheckboxHovered] = useState(false);
    const [isCheckboxActive, setIsCheckboxActive] = useState(false);
    const [isPenHovered, setIsPenHovered] = useState(false);
    const [isPenActive, setIsPenActive] = useState(false);
    const [isTrashHovered, setIsTrashHovered] = useState(false);
    const [isTrashActive, setIsTrashActive] = useState(false);
    const [isPlusHovered, setIsPlusHovered] = useState(false);
    const [isPlusActive, setIsPlusActive] = useState(false);
    const [isChildCheckboxHovered, setIsChildCheckboxHovered] = useState(false);
    const [isChildCheckboxActive, setIsChildCheckboxActive] = useState(false);
    const [isRadioHovered, setIsRadioHovered] = useState(false);
    const [isRadioActive, setIsRadioActive] = useState(false);

    const checkboxScale = getScale(isCheckboxActive, isCheckboxHovered);
    const tickScale = getScale(isCheckboxActive, isCheckboxHovered);
    const penScale = getScale(isPenActive, isPenHovered);
    const trashScale = getScale(isTrashActive, isTrashHovered);
    const squarePlusScale = getScale(isPlusActive, isPlusHovered);
    const childCheckboxScale = getScale(isChildCheckboxActive, isChildCheckboxHovered);
    const radioScale = getScale(isRadioActive, isRadioHovered);

    useEffect(() => {
        // Cập nhật textWidth
        const newTextWidth = Math.max(Math.min(node.content.length * 8, 350), 200);
        const newDueWidth = (due.toString().length + 5) * 8;
        setTextWidth(newTextWidth);
        setDueWidth(newDueWidth)

        setFinalWidth(newTextWidth + newDueWidth + 55);

        // Tính toán số dòng
        const lineCount = Math.ceil(content.length / (newTextWidth / 8));
        setTextLines(lineCount);
    }, [content, due]);

    // Tính toán finalHeight
    const finalHeight = (16 * 1.5 * textLines) + 1.5 * (textLines - 1) + 20;

    // Sử dụng useEffect để theo dõi sự thay đổi của textWidth và finalWidth nếu cần
    useEffect(() => {
        // Cập nhật finalWidth mỗi khi textWidth thay đổi
        setFinalWidth(textWidth + dueWidth + 55);
    }, [textWidth, dueWidth]);

    // State để theo dõi trạng thái hover và active
    const [isChecked, setIsChecked] = useState(false); // State cho checkbox

    // Tính toán vị trí cho Checkbox
    const checkboxX = node.x - 10 - (20 * (checkboxScale) - 20) / 2; // Điều chỉnh x để giữ tâm cho Checkbox
    const checkboxY = node.y + (finalHeight - 20) / 2 - (20 * (checkboxScale) - 20) / 2; // Điều chỉnh y để giữ tâm cho Checkbox

    // Hàm xử lý nhấn vào checkbox hoặc tick
    const handleToggle = () => {
        setIsChecked(prev => !prev); // Đổi trạng thái đã đánh dấu
    };

    // Khai báo state để lưu hình ảnh
    const [trashImage, setTrashImage] = useState(null);
    const [penImage, setPenImage] = useState(null);

    // Sử dụng useEffect để tải hình ảnh
    useEffect(() => {
        const trashImg = new window.Image();
        trashImg.src = TrashCanIcon;
        trashImg.onload = () => setTrashImage(trashImg); // Khi hình ảnh thùng rác được tải, cập nhật state

        const penImg = new window.Image();
        penImg.src = PenRegular; // Thay đổi đường dẫn đến biểu tượng bút
        penImg.onload = () => setPenImage(penImg); // Khi hình ảnh bút được tải, cập nhật state
    }, []);


    const handleEditClick = (ref, type) => {
        setIsEditing(true);
        const newContent = ref.current;
        const stageBox = newContent.getClientRect();
        const textarea = document.createElement('textarea');

        // Tính toán vị trí và kích thước textarea
        const windowWidth = window.innerWidth;
        const textareaWidth = 400;

        const leftPosition = (windowWidth - textareaWidth) / 2;

        textarea.style.position = 'absolute';
        textarea.style.top = `160px`;
        textarea.style.left = `${leftPosition}px`;
        textarea.style.width = `textareaWidth`;

        // Tính toán chiều cao của textarea để đảm bảo hiển thị 2 dòng
        const lineHeight = 1.5;
        const fontSize = newContent.fontSize();
        const height = lineHeight * fontSize * 2; // 2 dòng, điều chỉnh theo font size và line height
        textarea.style.height = `${height}px`;

        textarea.style.fontSize = `${fontSize}px`;
        textarea.style.lineHeight = `${lineHeight}`;
        textarea.style.fontFamily = `${newContent.fontFamily()}`;

        // Sửa viền của textarea và bỏ viền mặc định
        textarea.style.border = '2px solid #6580eb'; // Độ dày viền và màu sắc
        textarea.style.borderRadius = '8px'; // Bo góc mềm mại
        textarea.style.padding = '5px'; // Thêm padding nếu muốn
        textarea.style.outline = 'none'; // Loại bỏ viền mặc định của textarea

        textarea.rows = 2;
        textarea.cols = Math.floor(stageBox.width / 8);
        if (type === 'content')
            textarea.value = node.content;
        else
            textarea.value = node.due_time;

        document.body.appendChild(textarea);
        textarea.focus();

        textarea.onblur = () => {
            if (type === 'content') {
                updateNodeContent(index, textarea.value)

            } else {
                updateNodeDue(index, textarea.value);
            }
            document.body.removeChild(textarea);
            setIsEditing(false);
        };

        textarea.oninput = (e) => {
            if (type === 'content') {
                setContent(e.target.value);
            } else {
                setDue(e.target.value);
            }
        };
    };


    const handleOutsideClick = (e) => {
        if (textareaRef.current && typeof textareaRef.current.contains === "function" && !textareaRef.current.contains(e.target)) {
            setIsEditing(false);
        }
    };

    useEffect(() => {
        if (isEditing) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isEditing]);



    return (
        <div>
            <React.Fragment>
                {(userType === 'Administrator' || userType === 'Editor') && (node.level === 1 || node.level === 2) && (
                    //Add node background
                    <Rect
                        x={node.x}
                        y={node.y + finalHeight - 2}
                        width={45 + (nodeBelowTypes != null ? 0 : 20)}
                        height={25}
                        stroke="rgba(22, 24, 35, 0.12)"
                        strokeWidth={1}
                        draggable
                        onDragMove={onDragMove}
                    />
                )}

                {/* Node background */}
                <Rect
                    x={node.x}
                    y={node.y}
                    width={finalWidth + 10}
                    height={finalHeight}
                    fill="white"
                    stroke="#6580eb"
                    strokeWidth={2}
                    cornerRadius={5}
                    draggable
                    onDragMove={onDragMove}
                />

                {/* Content */}
                <Text
                    ref={textRef}
                    x={node.x + 20}
                    y={node.y + 11}
                    text={content}
                    fontSize={16}
                    fill="black"
                    align="left"
                    verticalAlign="middle"
                    width={finalWidth - dueWidth - 70}
                    wrap="word"
                    lineHeight={1.5}
                />

                {/* Due time */}
                <Text
                    ref={dueTimeRef}
                    x={node.x + textWidth + 3}
                    y={node.y + (finalHeight - 24) / 2}
                    text={due + ' days'}
                    fontSize={16}
                    fill="#666666"
                    align="right"
                    verticalAlign="middle"
                    lineHeight={1.5}
                    onClick={() => handleEditClick(dueTimeRef, 'due')}
                />

                {/*Pen icon */}
                {penImage && (
                    <Image
                        image={penImage}
                        x={node.x + textWidth + dueWidth + 10}
                        y={node.y + (finalHeight - 24) / 2}
                        width={19}
                        height={19}
                        scaleX={penScale}
                        scaleY={penScale}
                        onMouseEnter={() => setIsPenHovered(true)}
                        onMouseLeave={() => setIsPenHovered(false)}
                        onMouseDown={() => setIsPenActive(true)}
                        onMouseUp={() => { setIsPenActive(false); }}
                        onClick={() => handleEditClick(textRef, 'content')}

                    />
                )}

                {/* TrashCan icon */}
                {trashImage && (
                    <Image
                        image={trashImage}
                        x={node.x + textWidth + dueWidth + 35}
                        y={node.y + (finalHeight - 24) / 2}
                        width={19}
                        height={19}
                        scaleX={trashScale}
                        scaleY={trashScale}
                        onMouseEnter={() => setIsTrashHovered(true)}
                        onMouseLeave={() => setIsTrashHovered(false)}
                        onMouseDown={() => setIsTrashActive(true)}
                        onMouseUp={() => setIsTrashActive(false)}
                        onClick={() => handleDeleteNode(index)}
                    />
                )}

                {/* Checkbox */}
                {node.type === 'RadioButton' ? (
                    <Circle
                        x={checkboxX + 10}
                        y={checkboxY + 10}
                        radius={10}
                        fill={isChecked ? '#6580eb' : 'white'}
                        stroke="#6580eb"
                        strokeWidth={2}
                        cornerRadius={3}
                        onMouseEnter={() => setIsCheckboxHovered(true)}
                        onMouseLeave={() => setIsCheckboxHovered(false)}
                        onMouseDown={() => setIsCheckboxActive(true)}
                        onMouseUp={() => {
                            setIsCheckboxActive(false);
                            handleToggle();
                        }}
                        scaleX={checkboxScale}
                        scaleY={checkboxScale}
                    />
                ) : (
                    <Rect
                        x={checkboxX}
                        y={checkboxY}
                        width={20}
                        height={20}
                        fill={isChecked ? '#6580eb' : 'white'}
                        stroke="#6580eb"
                        strokeWidth={2}
                        cornerRadius={3}
                        onMouseEnter={() => setIsCheckboxHovered(true)}
                        onMouseLeave={() => setIsCheckboxHovered(false)}
                        onMouseDown={() => setIsCheckboxActive(true)}
                        onMouseUp={
                            () => {
                                setIsCheckboxActive(false);
                                handleToggle();
                            }
                        }
                        scaleX={checkboxScale}
                        scaleY={checkboxScale}
                    />
                )}


                {/* Tick */}
                {isChecked && (
                    <Text
                        x={checkboxX + 4}
                        y={checkboxY + 3}
                        text="✔"
                        fontStyle="bold"
                        fontSize={15}
                        fill="white"
                        scaleX={tickScale}
                        scaleY={tickScale}
                        onMouseEnter={() => {
                            setIsCheckboxHovered(true);
                        }}
                        onMouseLeave={() => {
                            setIsCheckboxHovered(false);
                        }}
                        onMouseDown={() => setIsCheckboxActive(true)}
                        onMouseUp={() => {
                            setIsCheckboxActive(false);
                            handleToggle();
                        }}
                    />
                )}
                {(userType === 'Administrator' || userType === 'Editor') && (node.level === 1 || node.level === 2) && (
                    <>
                        {/* Add same level node */}
                        <Rect
                            x={node.x + 5}
                            y={node.y + finalHeight + 4}
                            width={15}
                            height={15}
                            cornerRadius={3}
                            fill="rgba(22, 24, 35, 0.22)"
                            scaleX={squarePlusScale}
                            scaleY={squarePlusScale}
                            hitStrokeWidth={10}
                            onMouseEnter={() => setIsPlusHovered(true)}
                            onMouseLeave={() => setIsPlusHovered(false)}
                            onMouseDown={() => setIsPlusActive(true)}
                            onMouseUp={() => setIsPlusActive(false)}
                            onClick={() => handleSameLevelClick(index, node.x, node.y, node.level, node.type)}
                        />
                        <Text
                            x={node.x + 8}
                            y={node.y + finalHeight + 5}
                            width={10}
                            height={10}
                            text="+"
                            fill="#ffffff"
                            fontSize={15}
                            scaleX={squarePlusScale}
                            scaleY={squarePlusScale}
                            onMouseEnter={() => setIsPlusHovered(true)}
                            onMouseLeave={() => setIsPlusHovered(false)}
                            onMouseDown={() => setIsPlusActive(true)}
                            onMouseUp={() => setIsPlusActive(false)}
                            onClick={() => handleSameLevelClick(index, node.x, node.y, node.level, node.type)}
                        />

                        {(nodeBelowTypes === 'Checkbox' || nodeBelowTypes === null) && (
                            // Add checkbox child level
                            <Rect
                                x={node.x + 25}
                                y={node.y + finalHeight + 4}
                                width={15}
                                height={15}
                                cornerRadius={3}
                                stroke="rgba(22, 24, 35, 0.22)"
                                strokeWidth={1}
                                scaleX={childCheckboxScale}
                                scaleY={childCheckboxScale}
                                onMouseEnter={() => setIsChildCheckboxHovered(true)}
                                onMouseLeave={() => setIsChildCheckboxHovered(false)}
                                onMouseDown={() => setIsChildCheckboxActive(true)}
                                onMouseUp={() => setIsChildCheckboxActive(false)}
                                onClick={() => handleAddChildLevelNode(index, dueWidth + textWidth, node.x, node.y, node.level, 'Checkbox')}
                            />
                        )}

                        {(nodeBelowTypes === 'RadioButton' || nodeBelowTypes === null) && (
                            // Add radiobutton child level
                            <Circle
                                x={node.x + (nodeBelowTypes === 'RadioButton' ? 32.5 : 52.5)}
                                y={node.y + finalHeight + 4 + 7.5}
                                radius={8}
                                stroke="rgba(22, 24, 35, 0.22)"
                                strokeWidth={1}
                                fill="white"
                                scaleX={radioScale}
                                scaleY={radioScale}
                                onMouseEnter={() => setIsRadioHovered(true)}
                                onMouseLeave={() => setIsRadioHovered(false)}
                                onMouseDown={() => setIsRadioActive(true)}
                                onMouseUp={() => setIsRadioActive(false)}
                                onClick={() => handleAddChildLevelNode(index, dueWidth + textWidth, node.x, node.y, node.level, 'RadioButton')}
                            />
                        )}
                    </>
                )}
            </React.Fragment>

            
        </div>
    );
}

export default AdvanceRoadmapLevel;