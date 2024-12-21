import styles from './RoadmapItem.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faCircleDown, faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons'
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

    const handleCloneClick = () => {
        console.log(children)
        console.log(children.nodeCount)
        if (children.nodeCount < 5) {
            const newDialog = { id: Date.now() };
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
                        icon={children.loved.loveState ? faHeart : faSolidHeart}
                        className={cx('love')} />

                    <div className={cx('clone-num')} >
                        <span className={cx('num')}>{children.clone} clones</span>
                        <FontAwesomeIcon className={cx('bolt-icon')} icon={faBolt} />
                    </div>
                </div>
            </div>

            {showDialog &&
                <CreateTimeline
                    children={children}
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
        </div >
    );
}

export default RoadmapItem;
