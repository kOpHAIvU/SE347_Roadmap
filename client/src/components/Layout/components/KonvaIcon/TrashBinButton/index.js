import React from 'react';
import { Rect, Line, Text } from 'react-konva';

const TrashBinButton = ({ x, y, onClick }) => {
    const width = 40;  // Chiều rộng của thùng rác
    const height = 50; // Chiều cao của thùng rác

    // Tạo các điểm cho thùng rác
    const binPoints = [
        x, y + height,         // Điểm dưới bên trái
        x + 10, y,             // Điểm trên bên trái
        x + 30, y,             // Điểm trên bên phải
        x + width, y + height, // Điểm dưới bên phải
        x + 30, y + height - 10, // Điểm bên phải
        x + 10, y + height - 10 // Điểm bên trái
    ];

    return (
        <React.Fragment>
            {/* Hình thùng rác */}
            <Line
                points={binPoints}
                closed
                fill="#ccc" // Màu nền
                stroke="#000" // Màu viền
                strokeWidth={2}
                onClick={onClick} // Xử lý sự kiện nhấn
            />
            {/* Nắp thùng rác */}
            <Rect
                x={x + 10}
                y={y - 5}
                width={20}
                height={5}
                fill="#888" // Màu nắp thùng
                stroke="#000" // Màu viền
                strokeWidth={1}
            />
            {/* Chữ mô tả (nếu cần) */}
            <Text
                x={x - 10}
                y={y + height + 5}
                text="Thùng rác"
                fontSize={12}
                fill="black"
            />
        </React.Fragment>
    );
};

export default TrashBinButton;
