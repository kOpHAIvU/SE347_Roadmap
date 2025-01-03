import classNames from 'classnames/bind';
import styles from './TestLayout.module.scss';
import { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const cx = classNames.bind(styles);

function TestLayout() {
    const [userType, setUserType] = useState('Edit');
    return <div>{userType === 'Admin' && <h1>Cặc</h1>}</div>;
}

export default TestLayout;
