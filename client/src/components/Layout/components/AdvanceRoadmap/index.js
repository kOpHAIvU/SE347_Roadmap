import { Stage, Layer, Arrow } from 'react-konva';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AdvanceRoadmap.module.scss';
import { AdvanceLevelOne } from '../AdvanceRoadmapLevel/index.js';

const cx = classNames.bind(styles);

function AdvanceRoadmap() {
    const [nodes, setNodes] = useState([
        { id: 1, level: 1, x: 50, y: 50, type: 'square', ticked: false, due_time: 2, content: 'Write something...' },
        { id: 2, level: 1, x: 150, y: 150, type: 'square', ticked: false, due_time: 2, content: 'Continue here...' },
    ]);

    const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: 600 });

    useEffect(() => {
        const updateStageSize = () => {
            const xValues = nodes.map(node => node.x);
            const yValues = nodes.map(node => node.y);
            const widths = nodes.map(node => {
                const nodeWidth = Math.max(Math.min(node.content.length * 8, 500), 200) + 70;
                return node.x + nodeWidth;
            });

            const maxWidth = Math.max(...widths);
            const maxHeight = Math.max(...yValues) + 200; // 200 là khoảng trống cho viền

            setStageSize({ width: maxWidth, height: maxHeight });
        };

        updateStageSize();
    }, [nodes]);

    const handleDragMove = (e, nodeId) => {
        const newNodes = nodes.map(node =>
            node.id === nodeId ? { ...node, x: e.target.x(), y: e.target.y() } : node
        );
        setNodes(newNodes);
    };


    const getCenterOfSide = (node, side) => {
        const { x, y } = node;
        const width = Math.max(Math.min(node.content.length * 8, 500), 200) + 70;
        const lineCount = Math.ceil(node.content.length / (width / 8));
        const height = (16 * 1.5 * lineCount) + 1.5 * (lineCount - 1) + 20;

        switch (side) {
            case 'top':
                return { x: x + width / 2, y };
            case 'bottom':
                return { x: x + width / 2, y: y + height };
            case 'left':
                return { x, y: y + height / 2 };
            case 'right':
                return { x: x + width, y: y + height / 2 };
            default:
                return { x, y };
        }
    };

    const determineArrowPosition = (startNode, endNode) => {
        const startTop = getCenterOfSide(startNode, 'top');
        const startBottom = getCenterOfSide(startNode, 'bottom');
        const startRight = getCenterOfSide(startNode, 'right');
        const startLeft = getCenterOfSide(startNode, 'left');

        const endTop = getCenterOfSide(endNode, 'top');
        const endBottom = getCenterOfSide(endNode, 'bottom');
        const endRight = getCenterOfSide(endNode, 'right');
        const endLeft = getCenterOfSide(endNode, 'left');

        const verticalDistances = {
            topToBottom: Math.abs(startBottom.y - endTop.y),
            bottomToTop: Math.abs(startTop.y - endBottom.y),
        };

        const horizontalDistances = {
            leftToRight: Math.abs(startRight.x - endLeft.x),
            rightToLeft: Math.abs(startLeft.x - endRight.x),
        };

        // Xác định mũi tên nối giữa các cạnh gần nhất
        if (verticalDistances.topToBottom < horizontalDistances.leftToRight && verticalDistances.topToBottom < verticalDistances.bottomToTop) {
            return [startBottom.x, startBottom.y, endTop.x, endTop.y];
        }

        if (horizontalDistances.leftToRight < verticalDistances.topToBottom && horizontalDistances.leftToRight < horizontalDistances.rightToLeft) {
            return [startRight.x, startRight.y, endLeft.x, endLeft.y];
        }

        // Mặc định nối giữa cạnh bên trái hoặc phải
        if (startRight.x < endLeft.x) {
            return [startRight.x, startRight.y, endLeft.x, endLeft.y];
        } else {
            return [startLeft.x, startLeft.y, endRight.x, endRight.y];
        }
    };

    const renderArrow = (startNode, endNode) => {
        const points = determineArrowPosition(startNode, endNode);

        return <Arrow
            points={points}
            pointerLength={10}
            pointerWidth={10}
            stroke="#6580eb"
            fill="#6580eb" />;
    };

    return (
        <div style={{
            border: '2px solid black',
            width: '100%',
            height: '600px',
            overflow: 'auto' // Cho phép cuộn nếu các node nằm ngoài vùng hiển thị
        }}>
            <Stage id="canvas-id" width={stageSize.width} height={stageSize.height}>
                <Layer>
                    {nodes.map(node => (
                        <AdvanceLevelOne
                            key={node.id}
                            x={node.x}
                            y={node.y}
                            text={node.content}
                            onDragMove={(e) => handleDragMove(e, node.id)} // Cập nhật vị trí khi kéo
                        />
                    ))}

                    {nodes.slice(0, -1).map((node, index) =>
                        renderArrow(node, nodes[index + 1]) // Vẽ mũi tên giữa các node liên tiếp
                    )}
                </Layer>
            </Stage>
        </div>
    );
}

export default AdvanceRoadmap;
