import classNames from 'classnames/bind';
import styles from './User.module.scss';

const cx = classNames.bind(styles);

function User({ children, onChooseNewCollab }) {
    return (
        <div className={cx('wrapper')} onClick={() => {
            console.log('onChooseNewCollab triggered');
            onChooseNewCollab(children.idUser, children.username);
        }}>
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