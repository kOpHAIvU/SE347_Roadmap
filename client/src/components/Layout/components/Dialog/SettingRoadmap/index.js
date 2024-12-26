import classNames from 'classnames/bind';
import styles from './SettingRoadmap.module.scss';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);

function SettingRoadmap({ visibility, setVisibility, setShowSetting, handleOutsideClick, handleDeleteRoadmap }) {
    return (
        <div
            className={cx('modal-overlay')}
            onClick={(e) => {
                e.stopPropagation();
                handleOutsideClick(e)
            }}>
            <div className={cx('modal')}>
                <button className={cx('close-btn')} onClick={() => setShowSetting(false)}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                <h2 className={cx('form-name')}>Settings</h2>

                <div className={cx('release-status')}>
                    <div className={cx('visibility')}>
                        <h1 className={cx('visibility-title')}>Visibility</h1>
                        <h1 className={cx('visibility-content')}>This roadmap is currently {visibility}.</h1>
                    </div>
                    <select className={cx('visibility-select')}
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}>
                        <option value="Private">Private</option>
                        <option value="Release">Release</option>
                    </select>
                </div>

                <div className={cx('delete-status')}>
                    <div className={cx('delete')}>
                        <h1 className={cx('delete-title')}>Delete this roadmap</h1>
                        <h1 className={cx('delete-content')}>Once you delete a roadmap, there is no going back. Please be certain.</h1>
                    </div>
                    <FontAwesomeIcon
                        onClick={handleDeleteRoadmap}
                        className={cx('delete-btn')}
                        icon={faTrashCan} />
                </div>

            </div>
        </div>
    );
}

export default SettingRoadmap;