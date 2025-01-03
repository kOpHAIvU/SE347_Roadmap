import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import styles from './MenuAvatar.module.scss';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Header({ title, onBack }) {
    return (
        <header className={cx('header')}>
            <button className={cx('back-btn')} onClick={onBack}>
                <FontAwesomeIcon className={cx('back-icon')} icon={faChevronLeft} />
            </button>
            <h4 className={cx('header-title')}>{title}</h4>
        </header>
    );
}

// MenuItem
function MenuItem({ data, onClick }) {
    return (
        <div className={cx('menu-item')} onClick={onClick}>
            <span className={cx('icon')}>{data.icon}</span>
            <span className={cx('title')}>{data.title}</span>
        </div>
    );
}

// MenuAvatar
function MenuAvatar({ children, items = [] }) {
    const [history, setHistory] = useState([{ data: items }]);
    const current = history[history.length - 1];
    const [isVisible, setIsVisible] = useState(false);

    const navigate = useNavigate();

    const handleMenuItemClick = (item) => {
        if (item.to) {
            navigate(item.to);
            setIsVisible(false);
        } else if (item.onClick) {
            item.onClick();
            setIsVisible(false);
        } else if (item.children) {
            setHistory((prev) => [...prev, item.children]); // Chuyển sang menu con
        }
    };

    const handleBack = () => {
        setHistory((prev) => prev.slice(0, prev.length - 1)); // Quay lại menu trước
    };

    const renderItems = () => {
        return current.data.map((item, index) => (
            <MenuItem key={index} data={item} onClick={() => handleMenuItemClick(item)} />
        ));
    };

    return (
        <Tippy
            interactive
            visible={isVisible}
            delay={[0, 500]}
            placement="bottom-end"
            offset={[0, 1]}
            render={(attrs) => (
                <div className={cx('avatar-dropdown')} tabIndex="-1" {...attrs}>
                    <div className={cx('custom-dropdown')}>
                        {history.length > 1 && <Header title={current.title} onBack={handleBack} />}
                        {renderItems()}
                    </div>
                </div>
            )}
        >
            {/* {children} */}
            <div className={cx('avatar-wrapper')} onClick={() => setIsVisible((prev) => !prev)}>
                {children}
            </div>
        </Tippy>
    );
}

export default MenuAvatar;
