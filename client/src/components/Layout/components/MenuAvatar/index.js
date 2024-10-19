import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import MenuItem from './MenuItem';
import styles from './MenuAvatar.module.scss';


const cx = classNames.bind(styles);

function MenuAvatar({ children, items = [] }) {
    const handleMenuItemClick = (item) => {
        console.log(`Clicked on ${item.title}`);
        // Xử lý các hành động khác ở đây, ví dụ: đăng xuất.
    };

    const renderItems = () => {
        return items.map((item, index) => (
            <MenuItem key ={index} data={item} onClick={() => handleMenuItemClick(item)}/>
        ));
    }
    return (
        <Tippy
            interactive
            // visible={visible}
             visible
            placement='bottom-end'
            render={(attrs) => (
                <div className={cx('avatar-dropdown')} tabIndex="-1" {...attrs}>
                    <div className={cx('custom-dropdown')}>
                        {renderItems()}
                    </div>
                </div>
            )}
            >
            {children}
            </Tippy>
    );
}

export default MenuAvatar;