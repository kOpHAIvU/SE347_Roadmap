import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import classNames from 'classnames/bind';
import styles from './SettingTimeline.module.scss';
import { Collaborator, PendingInvite } from '../../MemberContainer/index.js';
import { useState } from 'react';
import SearchUser from '../../Search/SearchUser/index.js';

const cx = classNames.bind(styles);

function SettingTimeline({ setShowSetting, handleOutsideClick, handleDeleteTimeline, handleMakeDialog }) {
    const onWatchType = "Editor";
    const [collaborators, setCollaborators] = useState([
        { idUser: 0, username: "KoPhaiVu", userType: "Administrator" },
        { idUser: 1, username: "KoPhaiLoan", userType: "Editor" },
        { idUser: 2, username: "KoPhaiVinh", userType: null },
    ]);

    const updateUserType = (index, newUserType) => {
        setCollaborators(prevState => {
            const updatedCollaborators = [...prevState];
            updatedCollaborators[index].userType = newUserType;
            return updatedCollaborators;
        });
    };

    const onChooseNewCollab = (idUser, username) => {
        setCollaborators(prevState => [
            ...prevState,
            {
                idUser,
                username,
                userType: null,
            },
        ]);
        handleMakeDialog('Add', username)
    }

    const onRemoveUser = (username) => {
        setCollaborators((prevState) =>
            prevState.filter((collaborator) => collaborator.username !== username)
        );
        handleMakeDialog('Delete', username);
    };


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

                <SearchUser onChooseNewCollab={onChooseNewCollab} />

                <div className={cx('member-container')}>
                    {collaborators.map((collaborator, index) => (
                        <div key={index}>
                            {collaborator.userType === null ? (
                                <PendingInvite
                                    userType={onWatchType}
                                    collaborator={collaborator}
                                    removeUser={() => onRemoveUser(collaborator.username)} />
                            ) : (
                                <Collaborator
                                    index={index}
                                    userType={onWatchType}
                                    collaborator={collaborator}
                                    updateUserType={updateUserType}
                                    removeUser={() => onRemoveUser(collaborator.username)}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className={cx('delete-status')}>
                    <div className={cx('delete')}>
                        <h1 className={cx('delete-title')}>Delete this timeline</h1>
                        <h1 className={cx('delete-content')}>Once you delete a timeline, there is no going back. Please be certain.</h1>
                    </div>
                    <FontAwesomeIcon
                        onClick={handleDeleteTimeline}
                        className={cx('delete-btn')}
                        icon={faTrashCan} />
                </div>

            </div>
        </div>
    );
}

export default SettingTimeline;