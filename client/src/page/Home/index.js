import RoadmapItem from '~/components/Layout/components/RoadmapItem/index.js';
import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
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

function Home() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);

    const getToken = () => {
        const token = localStorage.getItem('vertexToken');

        if (!token) {
            navigate(`/login`);
            return;
        }
        return token;
    };

    const filterRoadmapData = async (data) => {
        const profileId = await fetchProfile();
        setProfile(profileId);
        const favorites = await fetchFavoriteData();

        const favoritesArray = Array.isArray(favorites) ? favorites : [];

        console.log(data);

        // return data.filter(item => {
        //     if (!item.owner?.id || (item.isPublic === false && item.owner.id !== profileId))
        //         return false;
        //     return true;
        // }).
        return data.map((item) => {
            const favorite = favoritesArray.find((fav) => fav.roadmap.id === item.id && fav.user.id === profileId);
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
                nodeCount: item.node.length,
            };
        });
    };

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:3004/auth/profile', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${getToken()}`, // Đính kèm token vào tiêu đề Authorization
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message || 'Failed to fetch profile data.');
                navigate(`/login`);
                return;
            }

            const data = await response.json();
            return data.data.id;
        } catch (error) {
            console.error('Fetch Profile Error:', error);
        }
    };

    const fetchRoadmapData = async () => {
        try {
            const response = await fetch('http://localhost:3004/roadmap/all?page=1&limit=12', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${getToken()}`, // Đính kèm token vào tiêu đề Authorization
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                const filteredData = filterRoadmapData(data.data);
                console.log("Filter: ", filteredData)
                return filteredData;
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message || 'Failed to fetch roadmap data.');
                navigate(`/login`);
            }
        } catch (error) {
            console.error('Fetch Roadmap Error:', error);
        }
    };

    const fetchFavoriteData = async () => {
        try {
            const response = await fetch('http://localhost:3004/favorite/all/owner?page=1&limit=10', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message || 'Failed to fetch favorite data.');
                navigate(`/login`);
            }

            const data = await response.json();

            return data.data;
        } catch (error) {
            console.error('Fetch Favorite Error:', error);
        }
    };

    const fetchNewFavourite = async (userId, roadmapId) => {
        try {
            const body = new URLSearchParams({
                userId: userId,
                roadmapId: roadmapId,
            }).toString();

            const response = await fetch('http://localhost:3004/favorite/new', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body,
            });

            console.log('Body:', body);

            if (response.ok) {
                const data = await response.json();
                console.log('Favorite added:', data); // Xử lý dữ liệu nếu cần
            } else {
                console.error('Failed to add favorite. Status:', response.status);
                navigate(`/login`);
            }

            const fetchData = async () => {
                const data = await fetchRoadmapData();
                setRoadmaps(data);
            };
            fetchData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchDelFavourite = async (id) => {
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
    //         loved: true
    //     },
    //     {
    //         id: 1,
    //         title: 'HTML cơ bản',
    //         content: 'HTML là một ngôn ngữ đánh dấu được thiết kế ra để tạo nên các trang web trên World Wide Web. Nó có thể được trợ giúp bởi các công nghệ như CSS và các ngôn ngữ kịch bản giống như JavaScript. ',
    //         clones: 123,
    //         avatar: source,
    //         loved: true
    //     },
    //     {
    //         id: 2,
    //         title: 'Javascript cơ bản',
    //         content: 'JavaScript là ngôn ngữ lập trình được nhà phát triển sử dụng để tạo trang web tương tác.',
    //         clones: 123,
    //         avatar: source,
    //         loved: false
    //     },
    //     {
    //         id: 3,
    //         title: 'Github cơ bản',
    //         content: 'KoPhaiVu',
    //         clones: 123,
    //         avatar: source,
    //         loved: false
    //     },
    // ]);

    const [roadmaps, setRoadmaps] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchRoadmapData();
            setRoadmaps(data);
        };
        fetchData();
    }, []);

    const handleLoveChange = async (id) => {
        setRoadmaps((prevRoadmaps) =>
            prevRoadmaps.map((roadmap) =>
                roadmap.id === id
                    ? { ...roadmap, loved: { ...roadmap.loved, loveState: !roadmap.loved.loveState } }
                    : roadmap,
            ),
        );

        const roadmapToUpdate = roadmaps.find((roadmap) => roadmap.id === id);
        let newReactValue;
        if (!roadmapToUpdate.loved.loveState) {
            newReactValue = roadmapToUpdate.react - 1;
            fetchDelFavourite(roadmapToUpdate.loved.loveId);
        } else {
            newReactValue = roadmapToUpdate.react + 1;
            fetchNewFavourite(profile, roadmapToUpdate.id);
        }

        try {
            const response = await fetch(`http://localhost:3004/roadmap/item/${id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
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

    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('page-title')}>Recommended Roadmaps</h1>
            <div className={cx('container')}>
                {roadmaps?.length > 0 &&
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
                <div className={cx('card')}>1</div>
                <div className={cx('card')}>2</div>
                <div className={cx('card')}>3</div>
                <div className={cx('card')}>4</div>
            </div>
        </div>
    );
}

export default Home;
