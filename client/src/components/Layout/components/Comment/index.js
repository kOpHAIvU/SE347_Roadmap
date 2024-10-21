import { useRef, useState } from 'react';
import styles from './Comment.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Comment() {
    const [titleText, setTitleText] = useState("");

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>
                <h1 className={cx('title-text')}>Comment</h1>
                <h1 className={cx('title-count')}>123</h1>
            </div>
            <div className={cx('write-cmt-section')}>
                <img
                    className={cx('avatar')}
                    alt='avatar'
                    src='https://us-tuna-sounds-images.voicemod.net/b962568b-a0e4-4ccc-b041-2f230293d740-1661361350797.jpg' />
                <textarea
                    className={cx('write-cmt')}
                    type="text"
                    onChange={(e) => setTitleText(e.target.value)}
                />
                <FontAwesomeIcon className={cx('send-icon')} icon={faPaperPlane} />
            </div>
        </div>
    );
}

export default Comment;