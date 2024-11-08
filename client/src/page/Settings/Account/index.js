import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Account.module.scss';
import SettingAccountItem from '~/components/Layout/components/SettingItem'; 

const cx = classNames.bind(styles);

// Dữ liệu tài khoản
const ACCOUNT_ITEMS = [
  {
    label: 'Profile Photo',
    value: 'https://i.pinimg.com/736x/e6/9d/09/e69d09cbbc827e4e117ce570f633120c.jpg', 
  },
  {
    label: 'Username',
    value: 'dodoo0309',
    edit: true
  },
  {
    label: 'Full name',
    value: 'Baby Shark Do Doo',
    edit: true
  },
  {
    label: 'Email',
    value: 'babydoo@lovely.sizuka',
    edit: true
  },
  {
    label: 'Gender',
    value: 'Male',
    options: ['Male', 'Female', 'Others'], 
    edit: false
  },
  {
    label: 'Connected social accounts',
    value: {
      platform: 'Google',
      username: 'Hải Đăng Đỗ babyboy',
      logo: 'https://img.icons8.com/?size=100&id=17949&format=png&color=000000'
    },
    edit: false
  }
];

const Account = () => {
  const [accountData, setAccountData] = useState(ACCOUNT_ITEMS); // Lưu trữ dữ liệu tài khoản

  const handleUpdateValue = (index, newValue) => {
    const updatedAccountData = [...accountData];
    updatedAccountData[index].value = newValue; // Cập nhật giá trị mới
    setAccountData(updatedAccountData); // Cập nhật trạng thái
  };

  return (
    <div className={cx('wrapper')}>
      <h1>Your account</h1>
      {accountData.map((item, index) => (
        <SettingAccountItem 
          key={index} 
          item={item} 
          onUpdateValue={(newValue) => handleUpdateValue(index, newValue)} // Truyền callback
        />
      ))}
    </div>
  );
};

export default Account;
