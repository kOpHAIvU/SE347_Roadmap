import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ChatSection.module.scss';
import ChatItem from '../ChatItem/index.js';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const cx = classNames.bind(styles);

const filterMessage = (data) => {
    if (!Array.isArray(data))
        return [];

    return data.map((item) => ({
        id: item.id,
        user: item.sender.fullName,
        userId: item.sender.id,
        avatar: item.sender.avatar ? item.sender.avatar.substring(0, item.sender.avatar.indexOf('.jpg') + 4) : '',
        date: item.createdAt.substring(0, 10),
        content: item.content,
    })).reverse();
}

function ChatSection({ profile, groupData }) {
    const navigate = useNavigate()

    const [chatContent, setChatContent] = useState('');
    const allMessagesRef = useRef(null);
    const [chats, setChats] = useState([])

    const socket = useRef(null);

    const getToken = () => {
        const token = localStorage.getItem('vertexToken');

        if (!token) {
            navigate(`/login`);
            return;
        }
        return token;
    }

    const fetchNewMessage = async () => {
        try {
            const body = new URLSearchParams({
                content: chatContent,
                check: 1,
                senderId: profile.id,
                teamId: groupData[0].team.id,
            }).toString();
            const response = await fetch('http://localhost:3004/message/new', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body,
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data);
                return data.data.id;
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchGetAllMessage = async () => {
        try {
            const response = await fetch(`http://localhost:3004/message/team/${groupData[0].team.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                //console.log(data)
                const messages = filterMessage(data.data);
                //console.log("message: ", messages);
                setChats(messages)
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Config web socket
    useEffect(() => {
        if (groupData[0]) {
            // Khởi tạo socket
            socket.current = io('http://localhost:3004/message', {
                query: {
                    teamId: groupData[0]?.team?.id,
                    userId: profile.id,
                },
                transports: ['websocket'], // Sử dụng WebSocket
                reconnect: true, // Tự động kết nối lại
                timeout: 5000, // Thời gian chờ kết nối
            });

            // Xử lý sự kiện khi socket kết nối
            socket.current.on('connect', () => {
                console.log('Connected to socket');
            });

            // Lắng nghe sự kiện nhận tin nhắn từ server
            socket.current.on('send_message', (newMessage) => {
                console.log('New message received: ', newMessage); // Debug log
            });

            socket.current.on('message', async (message) => {
                console.log('Message received:', message);  // Log message để kiểm tra
                try {
                    if (message) {
                        console.log("data: ", message.message.data)
                        // Giả sử bạn cần thực hiện thao tác bất đồng bộ tại đây (ví dụ: lấy thêm dữ liệu từ server)
                        const newMessage = {
                            id: message.message.data.id || 'Unknown',
                            user: message.message.data.sender.fullName || 'Unknown',
                            userId: message.message.data.sender.id,
                            avatar: message.message.data.sender.avatar
                                ? message.message.data.sender.avatar.substring(0, message.message.data.sender.avatar.indexOf('.jpg') + 4)
                                : 'https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg',
                            date: message.message.data.createdAt?.substring(0, 10) || 'Unknown',
                            content: message.message.data.content || 'No content',
                        };

                        // Nếu có thao tác bất đồng bộ cần chờ trước khi thêm message vào chats
                        // await someAsyncFunction(newMessage); // Ví dụ, bạn có thể gọi một hàm async tại đây

                        setChats(prevChats => [...prevChats, newMessage]);
                    } else {
                        console.error('Invalid message data:', message);
                    }
                } catch (error) {
                    console.error('Error while handling message:', error);
                }
            });

            // Xử lý lỗi kết nối
            socket.current.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
            });

            // Cleanup khi component unmount
            return () => {
                if (socket.current) {
                    socket.current.off('send_message');
                    socket.current.off('message');
                    socket.current.disconnect();
                }
            };
        }
    }, [groupData[0]]);


    useEffect(() => {
        const fetchData = async () => {
            await fetchGetAllMessage()
        }
        fetchData()
    }, [groupData[0]])

    // Sử dụng useEffect để cuộn xuống dưới cùng khi có thay đổi trong chatContent
    useEffect(() => {
        if (allMessagesRef.current) {
            allMessagesRef.current.scrollTop = allMessagesRef.current.scrollHeight;
        }
    }, [chatContent]);

    // let source = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmHLNP-oKgWYyHOZU7IdKi2wkyBfEncCFAaQ&s'
    // const [chats, setChats] = useState([
    //     {
    //         id: 0,
    //         user: 'KoPhaiVu',
    //         avatar: source,
    //         date: '26/06/2024',
    //         content: 'Các cậu làm tới đâu rồi'
    //     },
    //     {
    //         id: 1,
    //         user: 'KoPhaiLoan',
    //         avatar: source,
    //         date: '27/06/2024',
    //         content: 'Tớ chưa làm. Các cậu báo cáo tiến độ đi nhíe!!!! Tớ khò khò đây các condilon'
    //     },
    //     {
    //         id: 2,
    //         user: 'KoPhaiVinh',
    //         avatar: source,
    //         date: '28/06/2024',
    //         content: 'zzzzz'
    //     },
    // ])

    // Hàm gửi tin nhắn
    const handleSendMessage = async () => {
        if (chatContent.trim() !== '') {
            const newMessageId = await fetchNewMessage()
            if (newMessageId) {
                const newMessage = {
                    id: newMessageId,
                    user: profile.fullName,
                    userId: profile.id,
                    avatar: profile.avatar ? profile.avatar.substring(0, profile.avatar.indexOf('.jpg') + 4) : '',
                    date: new Date().toLocaleDateString('en-CA'),
                    content: chatContent
                };

                // Emit the message to the server using socket.io
                socket.current.emit('send_message', { message: chatContent });

                setChats((prevChats) => {
                    const updatedChats = [...prevChats, newMessage];
                    //console.log('Updated chats:', updatedChats); // Log giá trị mới
                    return updatedChats;
                });
                setChatContent('');
            }
        }
    };

    useEffect(() => {
        if (allMessagesRef.current) {
            allMessagesRef.current.scrollTop = allMessagesRef.current.scrollHeight;
        }
    }, [chats]);

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
                    rows={2}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSendMessage();
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