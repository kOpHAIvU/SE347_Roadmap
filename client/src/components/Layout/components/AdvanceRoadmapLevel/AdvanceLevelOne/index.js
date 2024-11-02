import styles from './AdvanceLevelOne.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { Circle, Image, Rect, Text } from 'react-konva';
import TrashCanIcon from '~/assets/images/trash-can-regular.svg'
import PenIcon from '~/assets/images/pen-to-square-solid.svg'

const cx = classNames.bind(styles);

function AdvanceLevelOne({ x, y, text, onClick, onDragMove }) {
    const textWidth = Math.max(Math.min(text.length * 8, 500), 200); // Chiều rộng của text: tối đa 200px, tối thiểu 100px
    const finalWidth = textWidth + 55;
    const finalHeight = 50;

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
        penImg.src = PenIcon; // Thay đổi đường dẫn đến biểu tượng bút
        penImg.onload = () => setPenImage(penImg); // Khi hình ảnh bút được tải, cập nhật state
    }, []);

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
                onClick={onClick}
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
                onClick={onClick}
                draggable
                onDragMove={onDragMove}
            />

            {/* Text */}
            <Text
                x={x + 25}
                y={y + finalHeight / 2 - 3}
                text={text}
                fontSize={16}
                fill="black"
                align="left"
                verticalAlign="middle"
                width={finalWidth - 20} // Giới hạn chiều rộng để text có thể xuống dòng
                wrap="word" // Tự động xuống dòng
                offsetX={0} // Không cần điều chỉnh offset khi dùng wrap
                offsetY={8}
                lineHeight={1.5}
            />

            {/*Pen icon */}
            {penImage && (
                <Image
                    image={penImage}
                    x={x + textWidth + 14}
                    y={y + 15}
                    width={17}
                    height={17}
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log('Pen icon clicked');
                    }}
                />
            )}

            {/* TrashCan icon */}
            {trashImage && (
                <Image
                    image={trashImage}
                    x={x + textWidth + 35} // Vị trí thùng rác
                    y={y + 15} // Điều chỉnh cho phù hợp
                    width={17} // Kích thước thùng rác
                    height={17}
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log('Trash bin clicked');
                    }}
                />
            )}

            {/* Checkbox */}
            <Rect
                className={cx('checkbox')}
                x={checkboxX}
                y={checkboxY}
                width={20}
                height={20}
                fill={isChecked ? '#6580eb' : 'white'}
                stroke="#6580eb"
                strokeWidth={2}
                cornerRadius={3}
                draggable
                onDragMove={onDragMove}
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
                x={x + 3}
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
                x={x + 6}
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
                x={x + 22}
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
                x={x + 42 + 7.5}
                y={y + finalHeight + 4 + 7.5}
                radius={7.5}
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
