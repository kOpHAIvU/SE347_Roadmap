import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { useState, useRef } from 'react';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import Roadmap from '../../SearchItem/Roadmap/index.js';

import styles from './SearchRoadmap.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function SearchRoadmap() {
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
        // Kiểm tra nếu click bên ngoài vùng search
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setVisible(false);  // Ẩn kết quả
        }
    };

    let source = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStltpfa69E9JTQOf5ZcyLGR8meBbxMFJxM0w&s"
    const roadmaps = [
        { id: 0, title: 'CSS cơ bản', author: 'KoPhaiVu', clones: 123, avatar: source },
        { id: 1, title: 'HTML cơ bản', author: 'KoPhaiVu', clones: 123, avatar: source },
        { id: 2, title: 'Javascript cơ bản', author: 'KoPhaiVu', clones: 123, avatar: source },
        { id: 3, title: 'Github cơ bản', author: 'KoPhaiVu', clones: 123, avatar: source },
    ];

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
                            {roadmaps.map((roadmap) => {
                                return <Roadmap key={roadmap.id} children={roadmap} />;
                            })}
                        </PopperWrapper>
                    </div>
                )}
            >
                <div className={cx('search')}>
                    <input placeholder='Find roadmap'
                        value={search}
                        onChange={handleInputChange}
                        onBlur={() => setVisible(false)}  // Ẩn khi mất focus
                        onFocus={() => search && setVisible(true)}  // Hiển thị lại khi có từ khóa và focus
                    />

                    <button className={cx('search-btn')}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </div>
            </Tippy>
        </div>
    );
}

export default SearchRoadmap;
