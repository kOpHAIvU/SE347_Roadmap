import classNames from 'classnames/bind';
import styles from './Collaborator.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);

function Collaborator({ index, userType, collaborator, updateUserType, removeUser }) {
    return (
        <div className={cx('wrapper')}>
            <img
                className={cx('avatar')}
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStltpfa69E9JTQOf5ZcyLGR8meBbxMFJxM0w&s" />
            <div className={cx('username-and-pending')}>
                <h2 className={cx('username')}>{collaborator.username}</h2>
                <span className={cx('collab')}>{collaborator.userType}</span>
            </div>

            {userType === "Administrator" || (collaborator.userType !== "Administrator") ? (
                <p>
                    <select className={cx('role-select')}
                        defaultValue={collaborator.userType}
                        onChange={(e) => {
                            updateUserType(index, e.target.value);
                        }}>
                        <option value="Administrator">Administrator</option>
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                    </select>
                    <FontAwesomeIcon className={cx('delete')} icon={faTrashCan} onClick={removeUser}/>
                </p>
            ) : (
                <h1 className={cx('role')}>{collaborator.userType}</h1>
            )}


        </div>
    );
}

export default Collaborator;