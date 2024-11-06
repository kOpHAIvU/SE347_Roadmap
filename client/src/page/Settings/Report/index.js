import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Report.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Report() {
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [reportText, setReportText] = useState('');

    const handleAddFile = (event) => {
        const files = Array.from(event.target.files);
        setAttachedFiles((prevFiles) => [...prevFiles, ...files]);
        event.target.value = null;
    };

    const handleRemoveFile = (index) => {
        setAttachedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleSendReport = () => {
        // Ttạm thời log ra console nha
        console.log('Report Text:', reportText);
        console.log('Attached Files:', attachedFiles);

        setReportText('');
        setAttachedFiles([]);
    };

    return (
        <div className={cx('wrapper')}>
            <h1>Report a problem</h1>

            <div className={cx('textarea-container')}>
                <div className={cx('attached-files')}>
                    {attachedFiles.map((file, index) => (
                        <div key={index} className={cx('file-item')}>
                            <span className={cx('file-icon')}>📄</span>
                            <div className={cx('file-info')}>
                                <p className={cx('file-name')}>{file.name}</p>
                                <p className={cx('file-size')}>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                            <button className={cx('remove-btn')} onClick={() => handleRemoveFile(index)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                    ))}
                </div>

                <textarea
                    className={cx('report-textarea')}
                    placeholder="Please include as much info as possible..."
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                />
            </div>

            <div className={cx('button-group')}>
                <button className={cx('btn')} onClick={handleSendReport}>
                    Send report
                </button>

                <label htmlFor="fileInput" className={cx('btn')}>
                    Add file
                </label>
                <input id="fileInput" type="file" onChange={handleAddFile} style={{ display: 'none' }} multiple />
            </div>
        </div>
    );
}

export default Report;
