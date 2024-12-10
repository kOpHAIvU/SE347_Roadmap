
import { useRef, useState } from 'react';
import styles from './SearchUser.module.scss';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../SearchItem/index.js';

const cx = classNames.bind(styles);

function SearchUser({ onChooseNewCollab }) {
    const [search, setSearch] = useState('');
    const [visible, setVisible] = useState(false);
    const searchRef = useRef(null);  // Ref để theo dõi vùng Search

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        // Hiển thị kết quả nếu có từ khóa
        if (value) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    };

    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setVisible(false);
        }
    };

    let source = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStltpfa69E9JTQOf5ZcyLGR8meBbxMFJxM0w&s"
    const [collaborators, setCollaborators] = useState([
        { idUser: 0, username: "KoPhaiVu", avatar: source },
        { idUser: 1, username: "KoPhaiLoan", avatar: source },
        { idUser: 2, username: "KoPhaiVinh", avatar: source },
    ]);

    // Lắng nghe sự kiện click chuột ra ngoài vùng Search
    document.addEventListener('mousedown', handleClickOutside);
    return (
        <div ref={searchRef}>
            <Tippy
                interactive
                visible={visible}
                placement='bottom-end'
                onClickOutside={() => setVisible(false)}
                render={(attrs) => (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            {collaborators.map((collaborator) => {
                                return <User
                                    key={collaborator.id}
                                    children={collaborator}
                                    onChooseNewCollab={(id, username) => {
                                        onChooseNewCollab(id, username);
                                        setVisible(false);
                                    }}
                                />;
                            })}
                        </PopperWrapper>
                    </div>
                )}
            >
                <div className={cx('search')}>
                    <input placeholder='Find collaborator'
                        value={search}
                        onChange={handleInputChange}
                        onFocus={() => search && setVisible(true)}
                    />

                    <button className={cx('search-btn')}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </div>
            </Tippy>
        </div>
    );
}

export default SearchUser;