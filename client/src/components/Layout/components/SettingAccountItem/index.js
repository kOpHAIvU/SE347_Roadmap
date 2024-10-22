import React from 'react';
import classNames from 'classnames/bind';
import styles from './SettingAccountItem.module.scss';

const cx = classNames.bind(styles);

const SettingAccountItem = ({ item }) => {
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
      ) : item.options ? (
        <div className={cx('options-group')}>
          {item.options.map((option, index) => (
            <label key={index}>
              <input type="radio" name={item.label.toLowerCase()} value={option.toLowerCase()} />
              {option}
            </label>
          ))}
        </div>
      ) : (
        <div className={cx('input-group')}>
            <span className={cx('value')}>{item.value}</span>
          {item.edit && <button className={cx('edit-btn')}>Edit</button>}
        </div>
      )}
    </div>
  );
};

export default SettingAccountItem;
