import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { useState, useRef } from 'react';

import styles from './Search.module.scss';
import classNames from 'classnames/bind';

import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountItem from '../AccountItem/index.js';

const cx = classNames.bind(styles);

function Search() {
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

    // Lắng nghe sự kiện click chuột ra ngoài vùng Search
    document.addEventListener('mousedown', handleClickOutside);

    return (
        <div ref={searchRef}>
            <Tippy
                interactive
                visible={true}
                onClickOutside={() => setVisible(false)}
                render={(attrs) => (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            <AccountItem />
                            <AccountItem />
                            <AccountItem />
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

export default Search;
