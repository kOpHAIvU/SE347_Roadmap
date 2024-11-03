import { Stage, Layer } from 'react-konva';
import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AdvanceRoadmap.module.scss';
import { AdvanceLevelOne } from '../AdvanceRoadmapLevel/index.js';

const cx = classNames.bind(styles);

function AdvanceRoadmap() {
    const [nodes, setNodes] = useState([
        { id: 1, level: 1, x: 50, y: 50, type: 'square', ticked: false, due_time: 2, content: 'Write something...' },
        { id: 2, level: 1, x: 150, y: 150, type: 'square', ticked: false, due_time: 2, content: 'Continue here...' },
    ]);

    const handleDragMove = (e, nodeId) => {
        const newNodes = nodes.map(node =>
            node.id === nodeId ? { ...node, x: e.target.x(), y: e.target.y() } : node
        );
        setNodes(newNodes);
    };

    const handleNodeClick = (id) => {
        console.log(`Node ${id} clicked`);
    };

    return (
        <Stage id="canvas-id" width={window.innerWidth} height={600}>
            <Layer>
                {nodes.map(node => (
                    <AdvanceLevelOne
                        key={node.id}
                        x={node.x}
                        y={node.y}
                        text={node.content}
                        onClick={() => handleNodeClick(node.id)}
                        onDragMove={(e) => handleDragMove(e, node.id)} // Cập nhật vị trí khi kéo
                    />
                ))}
            </Layer>
        </Stage>
    );
}

export default AdvanceRoadmap;
