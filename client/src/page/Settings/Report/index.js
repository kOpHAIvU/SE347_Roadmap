import React from 'react';
import classNames from 'classnames/bind';
import styles from './Report.module.scss';

const cx = classNames.bind(styles);

function Report() {
  return (
    <div className={cx('wrapper')}>
      <h1>Report a problem</h1>

      <textarea 
        className={cx('report-textarea')} 
        placeholder="Please include as much info as possible..." 
      />

      <div className={cx('button-group')}>
        <button className={cx('btn')}>Send report</button>
        <button className={cx('btn')}>Add file</button>
      </div>
    </div>
  );
}






export default Report;
