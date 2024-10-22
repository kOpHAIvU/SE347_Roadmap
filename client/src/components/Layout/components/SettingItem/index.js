import React from 'react';
import classNames from 'classnames/bind';
import styles from './SettingItem.module.scss';

const cx = classNames.bind(styles);

const SettingItem = ({ item }) => {
  const handleRemovePhoto = () => {
    // Logic để xóa ảnh (có thể set giá trị của item.value thành '')
    console.log('Remove Photo');
  };

  const handleChangePhoto = () => {
    // Logic để thay đổi ảnh (có thể mở một dialog chọn ảnh)
    console.log('Change Photo');
  };

  const handleDisconnect = () => {
    console.log('Disconnected from', item.value.platform);
    // Thêm logic để ngắt kết nối tài khoản mạng xã hội
  };


  return (
    <div className={cx('field')}>
        <label className={cx('label')}>{item.label}</label>
        <span className={cx('item-value-header')}>{item.value.content_header}</span>

      {item.label === 'Profile Photo' ? (
        <div className={cx('profile-photo')}>

          <img
           src={item.value || 'default-profile.png'} 
           alt="Profile" 
           className={cx('profile-img')} 
           />

          <div className={cx('photo-actions')}>

            <button onClick={handleRemovePhoto} className={cx('remove-btn')}>
                Remove Photo
            </button>

            <button onClick={handleChangePhoto} className={cx('change-btn')}>
                Change Photo
            </button>

          </div>
        </div>
      )  : item.label === 'Connected social accounts' ? (
        <div className={cx('social-account')}>

          <img src={item.value.logo} alt={item.value.platform} className={cx('social-logo')}/>

          <div className={cx('social-info')}>

            <span className={cx('social-name')}>{item.value.platform}</span>
            <span className={cx('social-username')}>{item.value.username}</span>

          </div>

          <button onClick={handleDisconnect} className={cx('disconnect-btn')}>
            Disconnect
          </button>

        </div>
      ) : item.label === 'Login' ? (
        <div className={cx('item-details')}>
          <img src={item.value.logo} alt={item.value.label} className={cx('item-logo')} />
          <div>
            <b>{item.value.label}</b>
            <br />
            <span className={cx('item-value')}>{item.value.content}</span>
          </div>
        </div>
      ) 
      : item.options ? (
        <div className={cx('options-group')}>
          {item.options.map((option, index) => (
            <label key={index}>
              <input type="radio" name={item.label.toLowerCase()} value={option.toLowerCase()} />
              {option}
            </label>
          ))}
        </div>
      )
       : item.sercurity ? (
        <div className={cx('input-group-custom')}>
            <span className={cx('value')}>{item.value}</span>
            <button className={cx('edit-btn')}>{item.button}</button>
        </div>
      ): (
        <div className={cx('input-group')}>
            <span className={cx('value')}>{item.value}</span>
            {item.edit && <button className={cx('edit-btn')}>Edit</button>}
        </div>
      )}
    </div>
  );
};

export default SettingItem;
