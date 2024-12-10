import classNames from 'classnames/bind';
import styles from './User.module.scss';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function User({ children, onChooseNewCollab }) {
    useEffect(() => {
        console.log('Children updated:', children);
    }, [children]);

    return (
        <div className={cx('wrapper')}
            onClick={(event) => {
                event.stopPropagation();
                onChooseNewCollab(children.idUser, children.username);
            }}
        >
            <img
                className={cx('roadmap-pic')}
                src={children.avatar}
            />
            <div className={cx('info')}>
                <p className={cx('roadmap-name')}>
                    <span>{children.username}</span>
                </p>
            </div>
        </div>
    );
}

export default User;