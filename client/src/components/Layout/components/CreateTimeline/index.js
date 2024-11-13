import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './CreateTimeline.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function CreateTimeline({ newId, title, setTitle, content, setContent, handleOutsideClick, setShowDialog }) {
    const navigate = useNavigate();

    const handleCreate = () => {
        if (title && content) {
            navigate(`/timeline/${newId}`);
        }
    };

    return (
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
    );
}

export default CreateTimeline;