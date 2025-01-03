import RoadmapItem from '~/components/Layout/components/RoadmapItem/index.js';
import styles from './YourFavourite.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const cx = classNames.bind(styles);

const secretKey = 'kophaivu'; // Khóa bí mật

// Hàm mã hóa
const encryptId = (id) => {
    let encrypted = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
    // Thay thế ký tự đặc biệt
    return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

function YourFavourite() {
    const navigate = useNavigate();

    const [roadmapRecords, setRoadmapRecords] = useState(0);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);

    const getToken = () => {
        const token = localStorage.getItem('vertexToken');

        if (!token) {
            navigate(`/login`);
            return;
        }
        return token;
    }

    const filterRoadmapData = (data) => {
        console.log("Filter: ", data)

        return data
            .filter(item => item.roadmap && item.roadmap.id)
            .map((item) => {
                return {
                    id: item.roadmap.id,
                    title: item.roadmap.title,
                    content: item.roadmap.content,
                    clone: item.roadmap.clone,
                    avatar: item.roadmap.avatar ? item.roadmap.avatar.substring(0, item.roadmap.avatar.indexOf('.jpg') + 4) : '',
                    loved: {
                        loveId: item.id,
                        loveState: true,
                    },
                    react: item.roadmap.react,
                    nodeCount: item.roadmap.node?.length || 0, // Xử lý nếu node bị undefined
                };
            })
    };

    const fetchRoadmapData = async (pageNumber) => {
        try {
            const response = await fetch(`http://localhost:3004/favorite/all/owner?page=${pageNumber}&limit=12`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data.data)
                const filteredData = filterRoadmapData(data.data.favorite);
                setRoadmapRecords(data.data.total)
                setRoadmaps(filteredData)
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message || 'Failed to fetch roadmap data.');
                navigate(`/login`);
            }
        } catch (error) {
            console.error('Fetch Roadmap Error:', error);
        }
    };

    const fetchDelFavourite = async (id) => {
        console.log("Id: ", id)
        try {
            const response = await fetch(`http://localhost:3004/favorite/item/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message || 'Failed to delete favorite.');
                navigate(`/login`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // let source = "https://i.ebayimg.com/images/g/XI0AAOSw~HJker7R/s-l1200.jpg"
    // // Đặt roadmaps trong state để có thể cập nhật
    // const [roadmaps, setRoadmaps] = useState([
    //     {
    //         id: 0,
    //         title: 'CSS cơ bản',
    //         content: 'CSS là chữ viết tắt của Cascading Style Sheets là ngôn ngữ để tìm và định dạng lại các phần tử được tạo ra bởi các ngôn ngữ đánh dấu (HTML)',
    //         clones: 123,
    //         avatar: source,
    //         authentication: 'Owner',
    //         loved: true
    //     },
    //     {
    //         id: 1,
    //         title: 'HTML cơ bản',
    //         content: 'HTML là một ngôn ngữ đánh dấu được thiết kế ra để tạo nên các trang web trên World Wide Web. Nó có thể được trợ giúp bởi các công nghệ như CSS và các ngôn ngữ kịch bản giống như JavaScript. ',
    //         clones: 123,
    //         avatar: source,
    //         authentication: 'Owner',
    //         loved: true
    //     },
    //     {
    //         id: 2,
    //         title: 'Javascript cơ bản',
    //         content: 'JavaScript là ngôn ngữ lập trình được nhà phát triển sử dụng để tạo trang web tương tác.',
    //         clones: 123,
    //         avatar: source,
    //         authentication: 'User',
    //         loved: true
    //     },
    //     {
    //         id: 3,
    //         title: 'Github cơ bản',
    //         content: 'KoPhaiVu',
    //         clones: 123,
    //         avatar: source,
    //         authentication: 'Owner',
    //         loved: true
    //     },
    // ]);

    const [roadmaps, setRoadmaps] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchRoadmapData(currentPageNumber);
        };
        fetchData();
    }, []);

    const handleLoveChange = async (id) => {
        setRoadmaps((prevRoadmaps) => {
            const updatedRoadmaps = prevRoadmaps.map((roadmap) =>
                roadmap.id === id ? { ...roadmap, loved: !roadmap.loved } : roadmap
            );

            // Xóa các roadmap có loved === false
            return updatedRoadmaps.filter((roadmap) => roadmap.loved);
        });

        const roadmapToUpdate = roadmaps.find(roadmap => roadmap.id === id);
        const newReactValue = roadmapToUpdate.react - 1;
        fetchDelFavourite(roadmapToUpdate.loved.loveId);

        try {
            const response = await fetch(`http://localhost:3004/roadmap/item/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    react: newReactValue,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Updated roadmap:', data);
            } else {
                console.error('Failed to update react value');
                navigate(`/login`);
            }
        } catch (error) {
            console.error('Error while patching react value:', error);
        }
    };

    const handleClickRoadmap = (id) => {
        const encryptedId = encryptId(id);
        navigate(`/roadmap/${encryptedId}`);
    };

    const handlePageChange = async (pageNumber) => {
        setCurrentPageNumber(pageNumber);
    };

    useEffect(() => {
        console.log("Current", currentPageNumber)
        fetchRoadmapData(currentPageNumber);
    }, [currentPageNumber]);


    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('page-title')}>Your favourite Roadmaps</h1>
            <div className={cx('container')} >
                {roadmaps.length > 0 &&
                    roadmaps.map((roadmap) => (
                        <RoadmapItem
                            key={roadmap.id}
                            children={roadmap}
                            onLoveChange={() => handleLoveChange(roadmap.id)}
                            onClick={() => handleClickRoadmap(roadmap.id)}
                        />
                    ))}
            </div>
            <div className={cx('numeric')}>
                {Array.from({ length: Math.ceil(roadmapRecords / 12) }, (_, index) => (
                    <div
                        key={index + 1}
                        className={cx('card', { active: currentPageNumber === index + 1 })}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default YourFavourite;