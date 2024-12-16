
import RoadmapItem from '~/components/Layout/components/RoadmapItem/index.js';
import styles from './YourRoadmap.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function YourRoadmap() {
    const navigate = useNavigate();

    const getToken = () => {
        const token = localStorage.getItem('vertexToken');

        if (!token) {
            navigate(`/login`);
            return;
        }
        return token;
    }

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:3004/auth/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`, // Đính kèm token vào tiêu đề Authorization
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message || 'Failed to fetch profile data.');
                alert(errorData.message || 'Failed to fetch profile data.');
                return;
            }

            const data = await response.json();
            return data.data.id;
        } catch (error) {
            console.error('Fetch Profile Error:', error);
        }
    };

    const filterRoadmapData = async (data) => {
        const profileId = await fetchProfile();
        const favorites = await fetchFavoriteData();

        const favoritesArray = Array.isArray(favorites) ? favorites : [];

        return data.filter(item => {
            if (item.isPublic === false && item.owner.id !== profileId)
                return false;
            return true;
        }).map(item => {
            const favorite = favoritesArray.find(fav => fav.roadmap.id === item.id && fav.user.id === profileId);
            return {
                id: item.id,
                title: item.title,
                content: item.content,
                clone: item.clone,
                avatar: item.avatar ? item.avatar.substring(0, item.avatar.indexOf('.jpg') + 4) : '',
                loved: {
                    loveId: favorite ? favorite.id : null,
                    loveState: favorite ? false : true,
                },
                react: item.react,
                nodeCount: Array.isArray(item.node) ? item.node.length : 0,
            };
        });
    };

    const fetchRoadmapData = async () => {
        try {
            const response = await fetch('http://localhost:3004/roadmap/all?page=1&limit=10', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`, // Đính kèm token vào tiêu đề Authorization
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message || 'Failed to fetch roadmap data.');
                alert(errorData.message || 'Failed to fetch roadmap data.');
                return;
            }

            const data = await response.json();
            const filteredData = filterRoadmapData(data.data);

            return filteredData;
        } catch (error) {
            console.error('Fetch Roadmap Error:', error);
        }
    };

    const fetchFavoriteData = async () => {
        try {
            const response = await fetch('http://localhost:3004/favorite/all/owner?page=1&limit=10', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message || 'Failed to fetch favorite data.');
                alert(errorData.message || 'Failed to fetch favorite data.');
                return;
            }

            const data = await response.json();

            return data.data;
        } catch (error) {
            console.error('Fetch Favorite Error:', error);
        }
    };

    const fetchNewFavourite = async (userId, roadmapId) => {
        try {
            const response = await fetch('http://localhost:3004/favorite/new', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: userId, roadmapId: roadmapId }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Favorite added:', data); // Xử lý dữ liệu nếu cần
            } else {
                console.error('Failed to add favorite. Status:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchDelFavourite = async (id) => {
        try {
            const response = await fetch(`http://localhost:3004/favorite/item/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message || 'Failed to delete favorite.');
                alert(errorData.message || 'Failed to delete favorite.');
                return;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const [roadmaps, setRoadmaps] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchRoadmapData();
            console.log(data)
            setRoadmaps(data);
        };
        fetchData();
    }, []);

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
    //         authentication: 'Owner',
    //         loved: false
    //     },
    //     {
    //         id: 3,
    //         title: 'Github cơ bản',
    //         content: 'KoPhaiVu',
    //         clones: 123,
    //         avatar: source,
    //         authentication: 'Owner',
    //         loved: false
    //     },
    // ]);

    const handleLoveChange = (id) => {
        setRoadmaps((prevRoadmaps) =>
            prevRoadmaps.map((roadmap) =>
                roadmap.id === id ? { ...roadmap, loved: !roadmap.loved } : roadmap
            )
        );
    };

    const handleClickRoadmap = (id) => {
        navigate(`/roadmap/${id}`); // Điều hướng tới /roadmap/{id}
    };

    const handleDeleteRoadmap = (id) => {
        setRoadmaps((prevRoadmaps) => prevRoadmaps.filter((roadmap) => roadmap.id !== id));
    };

    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('page-title')}>Your Roadmaps</h1>
            <div className={cx('container')} >
                {roadmaps?.length > 0 && roadmaps.map((roadmap) => {
                    return <RoadmapItem
                        key={roadmap.id}
                        children={roadmap}
                        onLoveChange={() => handleLoveChange(roadmap.id)}
                        onClick={() => handleClickRoadmap(roadmap.id)}
                        onDelete={() => handleDeleteRoadmap(roadmap.id)}
                    />
                })}
            </div>
        </div>
    );
}

export default YourRoadmap;