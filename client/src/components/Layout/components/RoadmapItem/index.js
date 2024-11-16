import styles from './RoadmapItem.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faCircleDown, faHeart as faSolidHeart, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { useState } from 'react';
import CreateTimeline from '../CreateTimeline/index.js';
import { CantClone } from '../MiniNotification/index.js';

const cx = classNames.bind(styles);

function RoadmapItem({ children, onLoveChange, onClick }) {
    const [showDialog, setShowDialog] = useState(false);
    const [title, setTitle] = useState(children.title);
    const [content, setContent] = useState(children.content);

    const handleOutsideClick = (e) => {
        if (String(e.target.className).includes('modal-overlay')) {
            setShowDialog(false);
        }
    };


    const [errorDialogs, setErrorDialogs] = useState([]); // Array to manage multiple CantClone dialogs

    const handleClose = (id) => {
        setErrorDialogs((prevDialogs) => prevDialogs.filter((dialog) => dialog.id !== id));
    };

    let nodeCount = 1;

    const handleCloneClick = () => {
        if (nodeCount < 5) {
            const newDialog = { id: Date.now() }; // Unique ID for each CantClone
            setErrorDialogs((prevDialogs) => [...prevDialogs, newDialog]);

            // Automatically remove the CantClone after 3 seconds
            setTimeout(() => {
                setErrorDialogs((prevDialogs) => prevDialogs.filter((dialog) => dialog.id !== newDialog.id));
            }, 3000);

            return;
        }
        setShowDialog(true);
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
                            handleCloneClick()
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

                    <div className={cx('clone-num')} >
                        <span className={cx('num')}>{children.clones} clones</span>
                        <FontAwesomeIcon className={cx('bolt-icon')} icon={faBolt} />
                    </div>
                </div>
            </div>

            {showDialog &&
                <CreateTimeline
                    newId={"Haha"}
                    title={title}
                    setTitle={setTitle}
                    content={content}
                    setContent={setContent}
                    handleOutsideClick={handleOutsideClick}
                    setShowDialog={setShowDialog} />}

            <div className={cx('mini-notify')}>
                {errorDialogs.map((dialog) => (
                    <CantClone key={dialog.id} handleClose={() => handleClose(dialog.id)} />
                ))}
            </div>
            {/* Dialog xác nhận xóa */}
            {/* {showDeleteDialog && (
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
            )} */}
        </div >
    );
}

export default RoadmapItem;
