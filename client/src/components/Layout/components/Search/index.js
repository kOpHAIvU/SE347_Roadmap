import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Search.module.scss';
import classNames from 'classnames/bind';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);


function Search() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('search')}>
                <input placeholder='Find roadmap' />
                <button className={cx('search-btn')}>
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                </button>
            </div>
        </div>
    );
}

export default Search;