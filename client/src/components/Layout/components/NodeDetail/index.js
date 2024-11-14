import classNames from 'classnames/bind';
import styles from './NodeDetail.module.scss';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css"

const cx = classNames.bind(styles);

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, false] }],
        [{ font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" }
        ],
        ["link"]
    ]
}

function NodeDetail({ userType, index, nodeDetail, updateNodeDetail, handleOutsideClick }) {
    const [text, setText] = useState(nodeDetail);
    console.log(text)

    return (
        <div
            className={cx('modal-overlay')}
            onClick={(e) => {
                e.stopPropagation()
                if (userType !== 'Viewer')
                    updateNodeDetail(index, text)
                handleOutsideClick(e)
            }}>
            <div className={cx('modal')}>
                <ReactQuill
                    className={cx('editor')}
                    theme="snow"
                    value={text}
                    onChange={setText}
                    modules={modules} />
            </div>
        </div>
    );
}

export default NodeDetail;