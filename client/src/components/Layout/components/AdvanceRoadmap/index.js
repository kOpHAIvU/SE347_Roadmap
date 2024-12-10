import { Stage, Layer, Arrow } from 'react-konva';
import React, { useEffect, useRef, useState } from 'react';
import AdvanceRoadmapLevel from '../AdvanceRoadmapLevel/index.js';
import NodeDetail from '../NodeDetail/index.js';

const calculateTextWidth = (text, fontWeight) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = `${fontWeight} 16px 'Montserrat', sans-serif`;
    return context.measureText(text).width;
}

function AdvanceRoadmap({ userType, nodes, setNodes
    , updateNodeContent, updateNodeDue, updateNodeDetail
    , handleDeleteNode, handleSameLevelClick, handleAddChildLevelNode
    , nodeBelowType, updateTickState, updateNodeComment }) {
    const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: 600 });

    useEffect(() => {
        const updateStageSize = () => {
            const yValues = nodes.map(node => node.y);
            const widths = nodes.map(node => {
                const fontWeight = node.level === 1 ? 600 : node.level === 2 ? 500 : 400;

                const contentWidth = Math.max(200, Math.min(calculateTextWidth(node.content, fontWeight), 350));
                const dueWidth = calculateTextWidth(node.due_time.toString() + ' days', 500);
                return node.x + contentWidth + dueWidth + 25 + 2 * (19 + 5) + 7;
            });

            const maxWidth = Math.max(...widths) + 200;
            const maxHeight = Math.max(...yValues) + 300; // 200 là khoảng trống cho viền

            const stageWidth = Math.max(maxWidth, window.innerWidth);
            const stageHeight = Math.max(maxHeight, 600);

            setStageSize({ width: stageWidth, height: stageHeight });
        };

        updateStageSize();
    }, [nodes]);

    const handleDragMove = (e, nodeId) => {
        const newNodes = nodes.map(node =>
            node.id === nodeId ? { ...node, x: e.target.x(), y: e.target.y() } : node
        );
        setNodes(newNodes);
    };

    const [isPanning, setIsPanning] = useState(false);
    const panStartPos = useRef({ x: 0, y: 0 });
    const stageRef = useRef(null);

    const handleMouseDown = (e) => {
        if (e.evt.button === 2) { // Kiểm tra nếu là chuột phải
            e.evt.preventDefault(); // Ngăn menu ngữ cảnh xuất hiện
            setIsPanning(true);
            const stage = stageRef.current;
            panStartPos.current = { x: stage.x(), y: stage.y(), mouseX: e.evt.clientX, mouseY: e.evt.clientY };
            stage.container().style.cursor = 'pointer'; // Đổi con trỏ thành pointer khi vào chế độ kéo
        }
    };

    const handleMouseMove = (e) => {
        if (isPanning) {
            const stage = stageRef.current;
            const dx = e.evt.clientX - panStartPos.current.mouseX;
            const dy = e.evt.clientY - panStartPos.current.mouseY;
            stage.position({ x: panStartPos.current.x + dx, y: panStartPos.current.y + dy });
            stage.batchDraw();
        }
    };

    const handleMouseUp = (e) => {
        if (isPanning && e.evt.button === 2) { // Kiểm tra nếu nhả chuột phải
            setIsPanning(false);
            stageRef.current.container().style.cursor = 'default'; // Đổi con trỏ về default khi thoát chế độ kéo
        }
    };

    const getCenterOfSide = (node, side) => {
        const { x, y } = node;
        const fontWeight = node.level === 1 ? 600 : node.level === 2 ? 500 : 400;

        const contentWidth = Math.max(200, Math.min(calculateTextWidth(node.content, fontWeight), 350));
        const dueWidth = calculateTextWidth(node.due_time.toString() + ' days', 500);
        const width = contentWidth + dueWidth + 25 + 2 * (19 + 5) + 7;
        const lineCount = Math.ceil(calculateTextWidth(node.content, fontWeight) / contentWidth);
        const height = (16 * 1.5 * lineCount) + 1.5 * (lineCount - 1) + 20;

        switch (side) {
            case 'top':
                return { x: x + (width / 2), y };
            case 'bottom':
                return { x: x + (width / 2), y: y + height };
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

        // Nếu startNode nằm hoàn toàn bên trái của endNode, chỉ sử dụng hướng left-to-right
        if (startNode.x + (startNode.width || 200) < endNode.x) {
            return [startRight.x, startRight.y, endLeft.x, endLeft.y];
        }

        // Nếu startNode nằm hoàn toàn bên phải của endNode, chỉ sử dụng hướng right-to-left
        if (startNode.x > endNode.x + (endNode.width || 200)) {
            return [startLeft.x, startLeft.y, endRight.x, endRight.y];
        }

        // Nếu startNode nằm hoàn toàn bên trên của endNode, chỉ sử dụng hướng top-to-bottom
        if (startNode.y + (startNode.height || 50) < endNode.y) {
            return [startBottom.x, startBottom.y, endTop.x, endTop.y];
        }

        // Nếu startNode nằm hoàn toàn bên dưới của endNode, chỉ sử dụng hướng bottom-to-top
        if (startNode.y > endNode.y + (endNode.height || 50)) {
            return [startTop.x, startTop.y, endBottom.x, endBottom.y];
        }

        // Các trường hợp khác dựa trên khoảng cách
        if (verticalDistances.topToBottom < horizontalDistances.leftToRight && verticalDistances.topToBottom < verticalDistances.bottomToTop) {
            return [startBottom.x, startBottom.y, endTop.x, endTop.y];
        }

        if (horizontalDistances.leftToRight < verticalDistances.topToBottom && horizontalDistances.leftToRight < horizontalDistances.rightToLeft) {
            return [startRight.x, startRight.y, endLeft.x, endLeft.y];
        }

        // Mặc định nối giữa cạnh bên trái hoặc phải nếu không có điều kiện cụ thể nào
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

    const [openNodeDetail, setOpenNodeDetail] = useState(false);

    const handleOutsideModalClick = (e) => {
        if (String(e.target.className).includes('modal-overlay')) {
            setOpenNodeDetail(false);
        }
    }

    const [indexNodeDetail, setIndexNodeDetail] = useState(null)
    const [nodeDetailClick, setNodeDetailClick] = useState(null)
    const [nodeComment, setNodeComment] = useState(null);

    const handleOpenNodeDetail = (index, nodeDetail, nodeComment) => {
        setIndexNodeDetail(index)
        setNodeDetailClick(nodeDetail)
        setOpenNodeDetail(true)
        setNodeComment(nodeComment)
    }


    return (
        <div style={{
            border: '2px solid black',
            width: '100%',
            height: '600px',
            overflow: 'auto' // Cho phép cuộn nếu các node nằm ngoài vùng hiển thị
        }}>
            <Stage
                id="canvas-id"
                width={stageSize.width}
                height={stageSize.height}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onContextMenu={(e) => e.evt.preventDefault()}
                ref={stageRef}>
                <Layer>
                    {nodes.map((node, index) => {
                        return <AdvanceRoadmapLevel
                            userType={userType}
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
                            handleOpenNodeDetail={() => handleOpenNodeDetail(index, node.nodeDetail, node.nodeComment)}
                            updateTickState={updateTickState}
                        />
                    })}

                    {renderArrows()}
                </Layer>
            </Stage>

            {openNodeDetail &&
                <NodeDetail
                    userType={userType}
                    index={indexNodeDetail}
                    nodeDetail={nodeDetailClick}
                    nodeComment={nodeComment}
                    updateNodeDetail={updateNodeDetail}
                    handleOutsideClick={handleOutsideModalClick}
                    updateNodeComment={updateNodeComment}
                />}
        </div>
    );
}

export default AdvanceRoadmap;
