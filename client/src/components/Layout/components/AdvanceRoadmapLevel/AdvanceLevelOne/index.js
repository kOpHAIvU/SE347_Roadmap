import React, { useEffect, useRef, useState } from 'react';
import { Circle, Image, Rect, Text } from 'react-konva';
import TrashCanIcon from '~/assets/images/trash-can-regular.svg'
import PenRegular from '~/assets/images/pen-to-square-regular.svg'

function AdvanceLevelOne({ x, y, text, onDragMove }) {
    const textRef = useRef(null);
    const [textLines, setTextLines] = useState(1);
    const textWidth = Math.max(Math.min(text.length * 8, 500), 200); // Chiều rộng của text: tối đa 200px, tối thiểu 100px
    const finalWidth = textWidth + 70;

    useEffect(() => {
        if (textRef.current) {
            const lineCount = Math.ceil(textRef.current.text().length / (finalWidth / 8));
            setTextLines(lineCount);
        }
    }, [text, finalWidth]);
    const finalHeight = (16 * 1.5 * textLines) + 1.5 * (textLines - 1) + 20;

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
    const checkboxX = x - 10 - (20 * (checkboxScale) - 20) / 2; // Điều chỉnh x để giữ tâm cho Checkbox
    const checkboxY = y + (finalHeight - 20) / 2 - (20 * (checkboxScale) - 20) / 2; // Điều chỉnh y để giữ tâm cho Checkbox

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

    const [isEditing, setIsEditing] = useState(false); // State để kiểm soát chế độ chỉnh sửa
    const [editedText, setEditedText] = useState(text); // State cho nội dung chỉnh sửa
    const textareaRef = useRef(null); // Thêm ref cho textarea

    const handlePenClick = () => {
        setIsEditing(true);
        const canvasRect = document.getElementById('canvas-id').getBoundingClientRect(); // ID của canvas chứa Konva
        textareaRef.current.style.position = 'absolute';
        textareaRef.current.style.left = `${x + 20 + canvasRect.left}px`;
        textareaRef.current.style.top = `${y + 19 + canvasRect.top}px`;
        textareaRef.current.style.width = `${finalWidth - 35}px`;
        textareaRef.current.style.height = `${finalHeight}px`;
        textareaRef.current.style.display = 'block'; // Hiển thị textarea
    };

    const handleOutsideClick = (e) => {
        if (textareaRef.current && !textareaRef.current.contains(e.target)) {
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
                x={x}
                y={y + finalHeight - 2}
                width={70}
                height={25}
                stroke="rgba(22, 24, 35, 0.12)"
                strokeWidth={1}
                draggable
                onDragMove={onDragMove}
            />
            {/* Node background */}
            <Rect
                x={x}
                y={y}
                width={finalWidth}
                height={finalHeight}
                fill="white"
                stroke="#6580eb"
                strokeWidth={2}
                cornerRadius={5}
                draggable
                onDragMove={onDragMove}
            />

            {!isEditing ? (
                <Text
                    ref={textRef}
                    x={x + 20}
                    y={y + 19}
                    text={editedText}
                    fontSize={16}
                    fill="black"
                    align="left"
                    verticalAlign="middle"
                    width={finalWidth - 35}
                    wrap="word"
                    lineHeight={1.5}
                />
            ) : (
                <textarea
                    ref={textareaRef} // Đặt ref cho textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    style={{
                        position: 'absolute',
                        top: `${y + 19}px`,
                        left: `${x + 20}px`,
                        width: `${finalWidth - 35}px`,
                        height: `${finalHeight}px`,
                        fontSize: '16px',
                        lineHeight: '1.5',
                        padding: '4px',
                        resize: 'none',
                        zIndex: 10,
                    }}
                    autoFocus
                />
            )}

            {/*Pen icon */}
            {penImage && (
                <Image
                    image={penImage}
                    x={x + textWidth + 14}
                    y={y + (finalHeight - 24) / 2}
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
                    x={x + textWidth + 40}
                    y={y + (finalHeight - 24) / 2}
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
                x={x + 5}
                y={y + finalHeight + 4}
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
                x={x + 8}
                y={y + finalHeight + 5}
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
                x={x + 25}
                y={y + finalHeight + 4}
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
                x={x + 45 + 7.5}
                y={y + finalHeight + 4 + 7.5}
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