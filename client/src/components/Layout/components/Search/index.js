import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { useEffect, useState } from 'react';

import styles from './Search.module.scss';
import classNames from 'classnames/bind';

import Tippy from '@tippyjs/react';
import { Wrapper as PopperWrapper } from '~/components/Popper';

const cx = classNames.bind(styles);


function Search() {
    const [searchResult, setSearchResult] = useState([])

    useEffect(() => {
        setTimeout(() => {
            setSearchResult([1, 2, 3])
        }, 0)
    })
    return (
        <Tippy
            interactive
            visible={searchResult.length > 0}
            render={attrs => (
                <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                    <PopperWrapper>Ket qua</PopperWrapper>
                </div>
            )}
        >
            <div className={cx('search')}>
                <input placeholder='Find roadmap' />

                <button className={cx('search-btn')}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div >
        </Tippy>

    );
}

export default Search;