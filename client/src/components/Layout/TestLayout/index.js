import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import styles from './TestLayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function TestLayout() {
  const [text, setText] = useState("Click to edit");
  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef(null);

  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTextDblClick = (e) => {
    // Chuyển sang chế độ chỉnh sửa khi người dùng double-click
    setIsEditing(true);
    const textNode = textRef.current;
    const stageBox = textNode.getClientRect();
    const textarea = document.createElement('textarea');
    
    // Đặt vị trí và kích thước cho textarea
    textarea.value = text;
    textarea.style.position = 'absolute';
    textarea.style.top = `${stageBox.y}px`;
    textarea.style.left = `${stageBox.x}px`;
    textarea.style.width = `${stageBox.width}px`;
    textarea.style.height = `${stageBox.height}px`;
    textarea.style.fontSize = `${textNode.fontSize()}px`;
    textarea.style.fontFamily = `${textNode.fontFamily()}`;
    document.body.appendChild(textarea);
    textarea.focus();

    textarea.onblur = () => {
      setText(textarea.value);
      document.body.removeChild(textarea);
      setIsEditing(false);
    };

    textarea.oninput = (e) => {
      setText(e.target.value);
    };
  };

  return (
    <div className={cx('container')}>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Rect
            x={100}
            y={100}
            width={200}
            height={50}
            fill="lightblue"
            cornerRadius={10}
          />
          <Text
            ref={textRef}
            text={text}
            fontSize={16}
            width={200}
            height={50}
            x={100}
            y={100}
            align="center"
            verticalAlign="middle"
            onClick={handleTextClick}
            onDblClick={handleTextDblClick}  // Kích hoạt chế độ chỉnh sửa khi double-click
          />
        </Layer>
      </Stage>
    </div>
  );
}

export default TestLayout;
