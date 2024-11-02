import React, { useState } from 'react';
import { Stage, Layer, Rect, Circle, Arrow } from 'react-konva';
import styles from './TestLayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function TestLayout() {
  const [shapes, setShapes] = useState([]);
  const [selectedShapes, setSelectedShapes] = useState([]);

  const addShape = (type) => {
    const newShape = {
      id: `${type}-${shapes.length + 1}`,
      type,
      x: Math.random() * window.innerWidth * 0.8,
      y: Math.random() * window.innerHeight * 0.8,
    };
    setShapes([...shapes, newShape]);
  };

  const handleDragMove = (id, e) => {
    const { x, y } = e.target.position();
    setShapes(shapes.map(shape =>
      shape.id === id ? { ...shape, x, y } : shape
    ));

    // Update selectedShapes positions if they match the dragged shape
    setSelectedShapes(selectedShapes.map(shape =>
      shape.id === id ? { ...shape, x, y } : shape
    ));
  };

  const handleSelectShape = (shape) => {
    if (selectedShapes.some(s => s.id === shape.id)) return;

    if (shape.type === 'square' || shape.type === 'circle') {
      const updatedSelection = [...selectedShapes, shape].slice(-2);
      setSelectedShapes(updatedSelection);
    }
  };

  const calculateArrowPoints = (startShape, endShape) => {
    const start = { x: startShape.x, y: startShape.y };
    const end = { x: endShape.x, y: endShape.y };

    // Find the closest points for arrow start and end
    let startOffset, endOffset;

    if (startShape.type === 'square') {
      const halfSize = 25; // half the size of the square
      const points = [
        { x: start.x + halfSize, y: start.y }, // Top
        { x: start.x + halfSize, y: start.y + 50 }, // Bottom
        { x: start.x, y: start.y + halfSize }, // Left
        { x: start.x + 50, y: start.y + halfSize } // Right
      ];
      // Choose the closest point
      startOffset = points.reduce((prev, curr) =>
        (Math.abs(curr.x - end.x) + Math.abs(curr.y - end.y)) <
        (Math.abs(prev.x - end.x) + Math.abs(prev.y - end.y)) ? curr : prev
      );
    } else if (startShape.type === 'circle') {
      const radius = 25;
      const angle = Math.atan2(end.y - start.y, end.x - start.x);
      startOffset = {
        x: start.x + radius * Math.cos(angle),
        y: start.y + radius * Math.sin(angle),
      };
    }

    if (endShape.type === 'square') {
      const halfSize = 25; // half the size of the square
      const points = [
        { x: end.x + halfSize, y: end.y }, // Top
        { x: end.x + halfSize, y: end.y + 50 }, // Bottom
        { x: end.x, y: end.y + halfSize }, // Left
        { x: end.x + 50, y: end.y + halfSize } // Right
      ];
      // Choose the closest point
      endOffset = points.reduce((prev, curr) =>
        (Math.abs(curr.x - start.x) + Math.abs(curr.y - start.y)) <
        (Math.abs(prev.x - start.x) + Math.abs(prev.y - start.y)) ? curr : prev
      );
    } else if (endShape.type === 'circle') {
      const radius = 25;
      const angle = Math.atan2(start.y - end.y, start.x - end.x);
      endOffset = {
        x: end.x + radius * Math.cos(angle),
        y: end.y + radius * Math.sin(angle),
      };
    }

    return [startOffset.x, startOffset.y, endOffset.x, endOffset.y];
  };

  // Recalculate arrow points when shapes change
  const arrowPoints =
    selectedShapes.length === 2 && selectedShapes[0].type !== selectedShapes[1].type
      ? calculateArrowPoints(selectedShapes[0], selectedShapes[1])
      : null;

  return (
    <div className={cx('container')}>
      <div className={cx('controls')}>
        <button onClick={() => addShape('square')}>Add Square</button>
        <button onClick={() => addShape('circle')}>Add Circle</button>
      </div>
      
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {shapes.map(shape => {
            if (shape.type === 'square') {
              return (
                <Rect
                  key={shape.id}
                  x={shape.x}
                  y={shape.y}
                  width={50}
                  height={50}
                  fill="blue"
                  draggable
                  onDragMove={(e) => handleDragMove(shape.id, e)}
                  onClick={() => handleSelectShape(shape)}
                />
              );
            } else if (shape.type === 'circle') {
              return (
                <Circle
                  key={shape.id}
                  x={shape.x}
                  y={shape.y}
                  radius={25}
                  fill="green"
                  draggable
                  onDragMove={(e) => handleDragMove(shape.id, e)}
                  onClick={() => handleSelectShape(shape)}
                />
              );
            }
            return null;
          })}

          {arrowPoints && (
            <Arrow
              points={arrowPoints}
              pointerLength={10}
              pointerWidth={10}
              fill="black"
              stroke="black"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}

export default TestLayout;
