import React, { useEffect, useRef, useState } from 'react';
import { Circle, Image, Rect, Text } from 'react-konva';
import TrashCanIcon from '~/assets/images/trash-can-regular.svg'
import PenRegular from '~/assets/images/pen-to-square-regular.svg'

function AdvanceLevelOne({ node, index, onDragMove, updateNodeContent, updateNodeDue }) {
    const textRef = useRef(null);
    const dueTimeRef = useRef(null)
    const textareaRef = useRef(null); // Thêm ref cho textarea
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(node.content);
    const [due, setDue] = useState(node.due_time);
    const [textLines, setTextLines] = useState(1);
    const [textWidth, setTextWidth] = useState(Math.max(Math.min(content.length * 8, 500), 200));
    const [finalWidth, setFinalWidth] = useState(textWidth + 70); // Thêm state cho finalWidth

    useEffect(() => {
        // Cập nhật textWidth
        const newTextWidth = Math.max(Math.min(node.content.length * 8, 500), 200);
        setTextWidth(newTextWidth);

        setFinalWidth(newTextWidth + 70);

        // Tính toán số dòng
        const lineCount = Math.ceil(content.length / (newTextWidth / 8));
        setTextLines(lineCount);
    }, [content]);

    // Tính toán finalHeight
    const finalHeight = (16 * 1.5 * textLines) + 1.5 * (textLines - 1) + 20;

    // Sử dụng useEffect để theo dõi sự thay đổi của textWidth và finalWidth nếu cần
    useEffect(() => {
        // Cập nhật finalWidth mỗi khi textWidth thay đổi
        setFinalWidth(textWidth + 85);
    }, [textWidth]);


    useEffect(() => {
        const dueTimeWidth = textRef.current.getTextWidth();
        textRef.current.width(dueTimeWidth + 10); // Thêm một ít padding nếu cần
    }, [node.due_time]);

    // State để theo dõi trạng thái hover và active
    const [isCheckboxHovered, setIsCheckboxHovered] = useState(false);
    const [isCheckboxActive, setIsCheckboxActive] = useState(false);
    const [isChecked, setIsChecked] = useState(false); // State cho checkbox

    // State để theo dõi trạng thái hover và active cho square with plus
    const [isPlusHovered, setIsPlusHovered] = useState(false);
    const [isPlusActive, setIsPlusActive] = useState(false);

    // State để theo dõi trạng thái hover và active cho checkbox con
    const [isChildCheckboxHovered, setIsChildCheckboxHovered] = useState(false);
    const [isChildCheckboxActive, setIsChildCheckboxActive] = useState(false);

    // State để theo dõi trạng thái hover và active cho radio button
    const [isRadioHovered, setIsRadioHovered] = useState(false);
    const [isRadioActive, setIsRadioActive] = useState(false);

    // Tính toán vị trí cho Checkbox
    const checkboxScale = isCheckboxActive ? 0.95 : isCheckboxHovered ? 1.1 : 1;
    const checkboxX = node.x - 10 - (20 * (checkboxScale) - 20) / 2; // Điều chỉnh x để giữ tâm cho Checkbox
    const checkboxY = node.y + (finalHeight - 20) / 2 - (20 * (checkboxScale) - 20) / 2; // Điều chỉnh y để giữ tâm cho Checkbox

    // Hàm xử lý nhấn vào checkbox hoặc tick
    const handleToggle = () => {
        setIsChecked(prev => !prev); // Đổi trạng thái đã đánh dấu
    };

    const tickScale = isCheckboxActive ? 0.95 : isCheckboxHovered ? 1.1 : 1;
    const squarePlusScale = isPlusActive ? 0.95 : isPlusHovered ? 1.1 : 1;
    const childCheckboxScale = isChildCheckboxActive ? 0.95 : isChildCheckboxHovered ? 1.1 : 1;
    const radioScale = isRadioActive ? 0.95 : isRadioHovered ? 1.1 : 1;

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

    const [isPenHovered, setIsPenHovered] = useState(false);
    const [isPenActive, setIsPenActive] = useState(false);
    const [isTrashHovered, setIsTrashHovered] = useState(false);
    const [isTrashActive, setIsTrashActive] = useState(false);

    const penScale = isPenActive ? 0.95 : isPenHovered ? 1.1 : 1;
    const trashScale = isTrashActive ? 0.95 : isTrashHovered ? 1.1 : 1;

    const handlePenClick = () => {
        setIsEditing(true);
        const newContent = textRef.current;
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
        textarea.value = node.content;

        document.body.appendChild(textarea);
        textarea.focus();

        textarea.onblur = () => {
            updateNodeContent(index, textarea.value)
            document.body.removeChild(textarea);
            setIsEditing(false);
        };

        textarea.oninput = (e) => {
            setContent(e.target.value);
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
        <React.Fragment>
            {/* Add node background */}
            <Rect
                x={node.x}
                y={node.y + finalHeight - 2}
                width={70}
                height={25}
                stroke="rgba(22, 24, 35, 0.12)"
                strokeWidth={1}
                draggable
                onDragMove={onDragMove}
            />
            {/* Node background */}
            <Rect
                x={node.x}
                y={node.y}
                width={finalWidth}
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
                width={finalWidth - 70}
                wrap="word"
                lineHeight={1.5}
            />

            {/* Due time */}
            <Text
                ref={dueTimeRef}
                x={node.x + textWidth + 29}
                y={node.y + (finalHeight - 24) / 2}
                text={node.due_time + ' days'}
                fontSize={16}
                fill="#666666"
                align="left"
                verticalAlign="middle"
                width={finalWidth - 35}
            />

            {/*Pen icon */}
            {penImage && (
                <Image
                    image={penImage}
                    x={node.x + textWidth + 55}
                    y={node.y + (finalHeight - 24) / 2}
                    width={19}
                    height={19}
                    scaleX={penScale}
                    scaleY={penScale}
                    onMouseEnter={() => setIsPenHovered(true)}
                    onMouseLeave={() => setIsPenHovered(false)}
                    onMouseDown={() => setIsPenActive(true)}
                    onMouseUp={() => { setIsPenActive(false); }}
                    onClick={handlePenClick}

                />
            )}

            {/* TrashCan icon */}
            {trashImage && (
                <Image
                    image={trashImage}
                    x={node.x + textWidth + 81}
                    y={node.y + (finalHeight - 24) / 2}
                    width={19}
                    height={19}
                    scaleX={trashScale}
                    scaleY={trashScale}
                    onMouseEnter={() => setIsTrashHovered(true)}
                    onMouseLeave={() => setIsTrashHovered(false)}
                    onMouseDown={() => setIsTrashActive(true)}
                    onMouseUp={() => setIsTrashActive(false)}
                />
            )}

            {/* Checkbox */}
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
                onMouseUp={() => {
                    setIsCheckboxActive(false);
                    handleToggle();
                }}
                scaleX={checkboxScale}
                scaleY={checkboxScale}
            />
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
                onMouseEnter={() => setIsPlusHovered(true)}
                onMouseLeave={() => setIsPlusHovered(false)}
                onMouseDown={() => setIsPlusActive(true)}
                onMouseUp={() => {
                    setIsPlusActive(false);
                }}
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
                onMouseUp={() => {
                    setIsPlusActive(false);
                }}
            />

            {/* Add checkbox child level */}
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
                onMouseUp={() => {
                    setIsChildCheckboxActive(false);
                }}
            />

            {/* Add radiobutton child level */}
            <Circle
                x={node.x + 45 + 7.5}
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
                onMouseUp={() => {
                    setIsRadioActive(false);
                }}
            />

        </React.Fragment>
    );
}

export default AdvanceLevelOne;