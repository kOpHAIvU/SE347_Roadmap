import classNames from 'classnames/bind';
import styles from './TestLayout.module.scss';
import { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";

const cx = classNames.bind(styles);

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, false] }],
    [{ font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link"]
  ]
};
function TestLayout() {
  const [text, setText] = useState("hahaa");
  const [comments, setComments] = useState([]);  // Lưu trữ các comment
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedRange, setSelectedRange] = useState(null);  // Lưu range của văn bản được chọn

  const quillRef = useRef(null);

  // Hàm xử lý việc thêm comment khi bôi đen văn bản
  const addComment = (comment) => {
    if (selectedRange) {
      const quill = quillRef.current.getEditor();
      const selectedText = quill.getText(selectedRange.index, selectedRange.length);
      setComments(prev => [
        ...prev,
        { text: selectedText, comment, index: selectedRange.index, length: selectedRange.length }
      ]);
      setShowContextMenu(false);  // Đóng menu sau khi thêm comment
    }
  };

  // Lắng nghe sự kiện nhấp chuột phải
  const handleRightClick = (e) => {
    e.preventDefault();
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection();  // Lấy range của phần văn bản được chọn
    if (range && range.length > 0) {
      setSelectedRange(range);
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      setShowContextMenu(true);  // Hiển thị menu context
    }
  };

  // Hàm xử lý khi thay đổi nội dung văn bản
  const handleTextChange = (newText) => {
    setText(newText);
  };

  return (
    <div
      className={cx('modal-overlay')}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className={cx('modal')}>
        <ReactQuill
          ref={quillRef}
          className={cx('editor')}
          theme="snow"
          value={text}
          onChange={handleTextChange}
          onContextMenu={handleRightClick}  // Lắng nghe sự kiện nhấp chuột phải
          modules={modules}
        />

        {showContextMenu && (
          <div
            className={cx('context-menu')}
            style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
          >
            <input
              type="text"
              placeholder="Thêm comment"
              onBlur={(e) => addComment(e.target.value)}  // Khi mất focus sẽ thêm comment
              autoFocus
            />
          </div>
        )}

        {comments.map((comment, i) => (
          <div key={i} className={cx('comment-container')}>
            <span
              className={cx('highlight')}
              style={{
                position: 'absolute',
                left: `${comment.index}px`,  // Điều chỉnh vị trí highlight
                top: `${comment.index * 20}px` // Điều chỉnh chiều cao highlight
              }}
            >
              {comment.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestLayout;
