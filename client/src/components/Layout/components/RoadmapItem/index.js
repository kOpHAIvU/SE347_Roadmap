import styles from './RoadmapItem.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faCircleDown, faHeart as faSolidHeart, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function RoadmapItem({ children, onLoveChange, onClick, onDelete }) {
    const [showDialog, setShowDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [title, setTitle] = useState(children.title);
    const [content, setContent] = useState(children.content);
    const navigate = useNavigate();

    const handleOutsideClick = (e) => {
        if (String(e.target.className).includes('modal-overlay')) {
            setShowDialog(false);
        }
    };

    const handleCreate = () => {
        if (title && content) {
            const newId = 'Muahahahaha';
            navigate(`/timeline/${newId}`);
        }
    };

    const handleDeleteConfirm = () => {
        onDelete();
        setShowDeleteDialog(false);
    };


    return (
        <div className={cx('wrapper')} onClick={onClick}>
            <div className={cx('container')}>
                <img className={cx('roadmap-pic')}
                    src={children.avatar}
                    alt="Roadmap picture" />
                <h1 className={cx('title')}>{children.title}</h1>
                <h2 className={cx('content')}>{children.content}</h2>
                <div className={cx('below')}>
                    <button
                        className={cx('clone-btn')}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDialog(true)
                        }}>
                        <FontAwesomeIcon className={cx('clone-icon')} icon={faCircleDown} />
                        <span className={cx('clone-title')}>Clone</span>
                    </button>
                    <FontAwesomeIcon
                        onClick={(e) => {
                            e.stopPropagation();
                            onLoveChange();
                        }}
                        icon={children.loved ? faSolidHeart : faHeart}
                        className={cx('love')} />
                    {children.authentication === 'Owner'
                        && <FontAwesomeIcon
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteDialog(true);
                            }}
                            icon={faTrashCan}
                            className={cx('delete')} />}

                    <div className={cx('clone-num')} >
                        <span className={cx('num')}>{children.clones} clones</span>
                        <FontAwesomeIcon className={cx('bolt-icon')} icon={faBolt} />
                    </div>
                </div>
            </div>

            {showDialog && (
                <div
                    className={cx('modal-overlay')}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOutsideClick(e);
                    }}>
                    <div className={cx('modal')}>
                        <button className={cx('close-btn')} onClick={() => setShowDialog(false)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>

                        <h2 className={cx('form-name')}>Create New Timeline</h2>

                        <div className={cx('form-group')}>
                            <label>Timeline Name</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>

                        <div className={cx('form-group')}>
                            <label>Description</label>
                            <textarea className={cx('description')} value={content} onChange={(e) => setContent(e.target.value)} />
                        </div>

                        <div className={cx('button-group')}>
                            <button className={cx('cancel-btn')} onClick={() => setShowDialog(false)}>
                                Cancel
                            </button>

                            <button
                                className={cx('create-btn')}
                                onClick={handleCreate}
                                disabled={!title || !content}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Dialog xác nhận xóa */}
            {showDeleteDialog && (
                <div
                    className={cx('modal-overlay')}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOutsideClick(e);
                    }}>
                    <div className={cx('modal')}>
                        <button className={cx('close-btn')} onClick={() => setShowDeleteDialog(false)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>

                        <h2 className={cx('form-name')}>Are you sure you want to delete '{children.title}'?</h2>

                        <div className={cx('button-group')}>
                            <button className={cx('cancel-btn')} onClick={() => setShowDeleteDialog(false)}>
                                Cancel
                            </button>

                            <button className={cx('delete-roadmap')} onClick={handleDeleteConfirm}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}

export default RoadmapItem;
