import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ChatSection.module.scss';
import ChatItem from '../ChatItem/index.js';

const cx = classNames.bind(styles);

function ChatSection() {
    const [chatContent, setChatContent] = useState('');
    const allMessagesRef = useRef(null);

    // Sử dụng useEffect để cuộn xuống dưới cùng khi có thay đổi trong chatContent
    useEffect(() => {
        if (allMessagesRef.current) {
            allMessagesRef.current.scrollTop = allMessagesRef.current.scrollHeight;
        }
    }, [chatContent]);

    let source = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmHLNP-oKgWYyHOZU7IdKi2wkyBfEncCFAaQ&s'
    const [chats, setChats] = useState([
        {
            id: 0,
            user: 'KoPhaiVu',
            avatar: source,
            date: '26/06/2024',
            content: 'Các cậu làm tới đâu rồi'
        },
        {
            id: 1,
            user: 'KoPhaiLoan',
            avatar: source,
            date: '27/06/2024',
            content: 'Tớ chưa làm. Các cậu báo cáo tiến độ đi nhíe!!!! Tớ khò khò đây các condilon'
        },
        {
            id: 2,
            user: 'KoPhaiVinh',
            avatar: source,
            date: '28/06/2024',
            content: 'zzzzz'
        },
    ])

    // Hàm gửi tin nhắn
    const handleSendMessage = () => {
        if (chatContent.trim() !== '') {
            const newMessage = {
                id: chats.length, // Tạo ID mới dựa trên độ dài của mảng chats
                user: 'KoPhaiVu', // Thay đổi tên người dùng nếu cần
                avatar: source, // Thay đổi avatar nếu cần
                date: new Date().toLocaleDateString(),
                content: chatContent
            };
            setChats([...chats, newMessage]); // Cập nhật trạng thái với tin nhắn mới
            setChatContent(''); // Xóa nội dung textarea
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('all-message')} ref={allMessagesRef}>
                {chats.map((chat) => {
                    return <ChatItem key={chat.id} children={chat} />
                })}
            </div>
            <div className={cx('make-message')}>
                <textarea
                    className={cx('input-message')}
                    value={chatContent}
                    placeholder='Type something...'
                    onChange={(e) => setChatContent(e.target.value)}
                    rows={2} // Đặt số dòng mặc định
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault(); // Ngăn chặn hành vi mặc định (tạo dòng mới)
                            handleSendMessage(); // Gọi hàm gửi tin nhắn
                        }
                    }}
                />
                <FontAwesomeIcon
                    className={cx('send-btn')}
                    icon={faPaperPlane}
                    onClick={handleSendMessage}
                />
            </div>
        </div>
    );
}

export default ChatSection;