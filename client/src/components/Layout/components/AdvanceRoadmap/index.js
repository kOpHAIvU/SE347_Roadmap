import { Stage, Layer, Arrow } from 'react-konva';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AdvanceRoadmap.module.scss';
import { AdvanceLevelOne } from '../AdvanceRoadmapLevel/index.js';

const cx = classNames.bind(styles);

function AdvanceRoadmap() {
    const [nodes, setNodes] = useState([
        { id: 1, level: 1, x: 50, y: 50, type: 'Checkbox', ticked: false, due_time: 2, content: 'Write something... Chiều cao dựa trên chiều cao của văn bản hoặc giá trị mặc định' },
        { id: 2, level: 1, x: 150, y: 150, type: 'Checkbox', ticked: false, due_time: 2, content: 'Continue here...' },
    ]);

    const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: 600 });

    useEffect(() => {
        const updateStageSize = () => {
            const xValues = nodes.map(node => node.x);
            const yValues = nodes.map(node => node.y);
            const widths = nodes.map(node => {
                const nodeWidth = Math.max(Math.min(node.content.length * 8, 300), 200) + 85;
                return node.x + nodeWidth;
            });

            const maxWidth = Math.max(...widths) + 400;
            const maxHeight = Math.max(...yValues) + 100; // 200 là khoảng trống cho viền

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
        const width = Math.max(Math.min(node.content.length * 8, 400), 200) + 62 + 85;
        const lineCount = Math.ceil(node.content.length / (width / 8));
        const height = (16 * 1.5 * lineCount) + 1.5 * (lineCount - 1) + 20;

        switch (side) {
            case 'top':
                return { x: x + width / 2, y };
            case 'bottom':
                return { x: x + width / 2, y: y + height };
            case 'left':
                return { x: x - 10, y: y + height / 2 };
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

    const findTargetNode = (currentNode) => {
        const currentIndex = nodes.findIndex(node => node.id === currentNode.id);

        if (currentNode.level === 1) {
            // Tìm node level 1 tiếp theo có id lớn hơn currentNode.id và gần nó nhất
            const nextLevel1Node = nodes.filter(node => node.level === 1 && node.id > currentNode.id)
                .sort((a, b) => a.id - b.id)[0];  // Lấy node level 1 có id lớn nhất nhưng gần nhất

            // Tìm tất cả các node level 2 có id lớn hơn currentNode.id và ở dưới nó
            const level2Nodes = [];
            for (let i = currentIndex + 1; i < nodes.length; i++) {
                const node = nodes[i];
                if (node.level === 1) break;  // Dừng khi gặp node level 1
                if (node.level === 2 && node.id > currentNode.id) {
                    level2Nodes.push(node);
                }
            }

            // Kết quả trả về bao gồm node level 1 tiếp theo và tất cả các node level 2
            return nextLevel1Node ? [nextLevel1Node, ...level2Nodes] : level2Nodes;
        }

        if (currentNode.level === 2) {
            const level3Nodes = [];
            for (let i = currentIndex + 1; i < nodes.length; i++) {
                const node = nodes[i];
                if (node.level === 1 || node.level === 2) break;  // Dừng khi gặp node level 1, 2
                if (node.level === 3 && node.id > currentNode.id) {
                    level3Nodes.push(node);
                }
            }
            return level3Nodes;
            // // Tìm tất cả các node level 3 có id lớn hơn currentNode.id và ở dưới nó
            // const level3Nodes = nodes.filter(node => node.level === 3 && node.id > currentNode.id);
            // return level3Nodes;
        }

        // Node level 3 không trỏ tới đâu cả
        return [];
    };

    const renderArrows = () => {
        const arrows = [];
        nodes.forEach((node) => {
            const targetNode = findTargetNode(node);
            if (Array.isArray(targetNode)) {
                // Nếu có nhiều target nodes (level 1), nối lần lượt
                targetNode.forEach((tn) => {
                    const points = determineArrowPosition(node, tn);
                    // Kiểm tra xem node và targetNode có cùng level 1 không
                    const isLevelOneArrow = (node.level === 1 && tn.level === 1);
                    const arrowColor = isLevelOneArrow ? '#6580eb' : 'black';
                    const arrowWidth = isLevelOneArrow ? 3 : 1;  // Độ dày khác nhau tùy theo màu

                    arrows.push(
                        <Arrow
                            key={`${node.id}-${tn.id}`}
                            points={points}
                            pointerLength={10}
                            pointerWidth={10}
                            stroke={arrowColor}
                            fill={arrowColor}
                            strokeWidth={arrowWidth}
                        />
                    );
                });
            } else if (targetNode) {
                // Nếu chỉ có một target node (level 2 hoặc 3), nối với node đó
                const points = determineArrowPosition(node, targetNode);
                const isLevelOneArrow = (node.level === 1 && targetNode.level === 1);
                const arrowColor = isLevelOneArrow ? '#6580eb' : 'black';
                const arrowWidth = isLevelOneArrow ? 3 : 1;  // Độ dày khác nhau tùy theo màu

                arrows.push(
                    <Arrow
                        key={`${node.id}-${targetNode.id}`}
                        points={points}
                        pointerLength={10}
                        pointerWidth={10}
                        stroke={arrowColor}
                        fill={arrowColor}
                        strokeWidth={arrowWidth}
                    />
                );
            }
        });
        return arrows;
    };


    const updateNodeContent = (index, newContent) => {
        setNodes((prevNodes) => {
            const updatedNodes = [...prevNodes];
            updatedNodes[index] = { ...updatedNodes[index], content: newContent };
            return updatedNodes;
        });
    };

    const updateNodeDue = (index, newDue) => {
        setNodes((prevNodes) => {
            const updatedNodes = [...prevNodes];
            updatedNodes[index] = { ...updatedNodes[index], due_time: newDue };
            return updatedNodes;
        });
    };

    const handleDeleteNode = (index) => {
        setNodes((prevNodes) => {
            const updatedNodes = [...prevNodes];
            const targetLevel = updatedNodes[index].level;

            // Xóa node tại vị trí index
            updatedNodes.splice(index, 1);

            // Tìm và xóa các node có level lớn hơn targetLevel
            while (index < updatedNodes.length) {
                if (updatedNodes[index].level > targetLevel) {
                    updatedNodes.splice(index, 1);
                } else {
                    break; // Dừng khi gặp node có level bằng hoặc thấp hơn targetLevel
                }
            }

            return updatedNodes;
        });
    };


    const handleSameLevelClick = (index, x, y, level, type) => {
        const newId = index + 1;
        const newLevel = { id: newId, x: x, y: y + 100, level, type, ticked: false, due_time: 2, content: 'Write something...' };

        setNodes((prevLevels) => {
            if (prevLevels === null) return [newLevel];

            // Xác định vị trí chèn node mới
            const insertIndex = prevLevels.findIndex((node, i) => i > index && node.level <= level);
            const updatedNodes = insertIndex === -1
                ? [...prevLevels, newLevel]
                : [...prevLevels.slice(0, insertIndex), newLevel, ...prevLevels.slice(insertIndex)];

            // Cập nhật id cho các node phía dưới
            return updatedNodes.map((node, idx) => {
                return idx > index ? { ...node, id: node.id + 1 } : node;
            });
        });
    };

    const handleAddChildLevelNode = (index, x, y, level, type) => {
        const newId = index + 1; // Đặt id mới là index + 1
        const newLevel = { id: newId, x: x + 600, y: y, level: level + 1, type, ticked: false, due_time: 2, content: 'Write something...' };

        setNodes((prevLevels) => {
            if (prevLevels === null) return [newLevel];

            // Xác định vị trí chèn node mới
            const insertIndex = prevLevels.findIndex((node, i) => i > index && node.level <= level);
            const updatedNodes = insertIndex === -1
                ? [...prevLevels, newLevel]
                : [...prevLevels.slice(0, insertIndex), newLevel, ...prevLevels.slice(insertIndex)];

            // Cập nhật id cho các node phía dưới
            return updatedNodes.map((node, idx) => {
                return idx > index ? { ...node, id: node.id + 1 } : node;
            });
        });
    };

    const nodeBelowType = (index) => {
        console.log("Nodes ",index , " ",index + 1 < nodes.length && nodes[index + 1].level > nodes[index].level
            ? nodes[index + 1].type : null)
        return index + 1 < nodes.length && nodes[index + 1].level > nodes[index].level
            ? nodes[index + 1].type : null;
    }

    return (
        <div style={{
            border: '2px solid black',
            width: '100%',
            height: '600px',
            overflow: 'auto' // Cho phép cuộn nếu các node nằm ngoài vùng hiển thị
        }}>
            <Stage id="canvas-id" width={stageSize.width} height={stageSize.height}>
                <Layer>
                    {nodes.map((node, index) => {
                        return <AdvanceLevelOne
                            userType='Administrator'
                            key={node.id}
                            node={node}
                            index={index}
                            onDragMove={(e) => handleDragMove(e, node.id)}
                            updateNodeContent={updateNodeContent}
                            updateNodeDue={updateNodeDue}
                            handleDeleteNode={handleDeleteNode}
                            handleSameLevelClick={handleSameLevelClick}
                            handleAddChildLevelNode={handleAddChildLevelNode}
                            nodeBelowTypes={nodeBelowType(index)}
                        />
                    })}

                    {renderArrows()}
                </Layer>
            </Stage>
        </div>
    );
}

export default AdvanceRoadmap;
