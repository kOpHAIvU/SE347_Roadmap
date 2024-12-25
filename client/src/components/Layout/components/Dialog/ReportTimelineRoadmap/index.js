import classNames from 'classnames/bind';
import styles from './ReportTimelineRoadmap.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function ReportTimelineRoadmap({ type, name, handleOutsideClick, setShowSetting }) {
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

                <div className={cx('report-header')}>
                    <FontAwesomeIcon className={cx('alert-icon')} icon={faTriangleExclamation} />
                    <h2 className={cx('form-name')}>Report {name}</h2>
                </div>
                <textarea
                    className={cx('report-content')}
                    placeholder="Report something you see."
                />
                <h1 className={cx('submit-form')} onClick={() => setShowSetting(false)}>Submit</h1>

            </div>
        </div>
    );
}

export default ReportTimelineRoadmap;