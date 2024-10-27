import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './TestLayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const ItemTypes = {
    ITEM: 'item',
};

function DraggableItem({ id, text, index, moveItem }) {
    const [, ref] = useDrag({
        type: ItemTypes.ITEM,
        item: { id, index },
    });

    return (
        <div ref={ref} className={cx('draggable-item')}>
            {text}
        </div>
    );
}

function DroppableArea({ index, moveItem, children }) {
    const [, ref] = useDrop({
        accept: ItemTypes.ITEM,
        hover(item) {
            if (item.index !== index) {
                moveItem(item.index, index);
                item.index = index; // Cập nhật chỉ số của item đã kéo
            }
        },
    });

    return (
        <div ref={ref} className={cx('droppable-area')}>
            {children}
        </div>
    );
}

function TestLayout() {
    const [items, setItems] = useState([
        { id: 1, text: 'Item 1' },
        { id: 2, text: 'Item 2' },
        { id: 3, text: 'Item 3' },
    ]);

    const moveItem = (fromIndex, toIndex) => {
        const updatedItems = [...items];
        const [movedItem] = updatedItems.splice(fromIndex, 1);
        updatedItems.splice(toIndex, 0, movedItem);
        setItems(updatedItems);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className={cx('wrapper')}>
                {items.map((item, index) => (
                    <DroppableArea key={item.id} index={index} moveItem={moveItem}>
                        <DraggableItem 
                            id={item.id} 
                            text={item.text} 
                            index={index} 
                            moveItem={moveItem} 
                        />
                    </DroppableArea>
                ))}
            </div>
        </DndProvider>
    );
}

export default TestLayout;
