import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { useState, useRef, useEffect } from 'react';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import Roadmap from '../../SearchItem/Roadmap/index.js';

import styles from './SearchRoadmap.module.scss';
import classNames from 'classnames/bind';
import { Timeline } from '../../SearchItem/index.js';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function SearchRoadmap() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('');
    const [visible, setVisible] = useState(false);
    const searchRef = useRef(null);

    const [roadmaps, setRoadmaps] = useState([])
    const [timelines, setTimelines] = useState([])

    const [profile, setProfile] = useState(null);

    const getToken = () => {
        const token = localStorage.getItem('vertexToken');

        if (!token) {
            navigate(`/login`);
            return;
        }
        return token;
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
            setProfile(data.data.id)
            return data.data.id;
        } catch (error) {
            console.error('Fetch Profile Error:', error);
        }
    };

    const fetchSearchRoadmap = async (profileId) => {
        try {
            const response = await fetch(`http://localhost:3004/roadmap/search/${search}?page=1&limit=4`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setRoadmaps(data.data.roadmap)
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchSearchTimeline = async (profileId) => {
        try {
            const response = await fetch(`http://localhost:3004/timeline/search/${search}?page=1&limit=4`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setTimelines(data.data.timeline)
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchProfile();
        };
        fetchData();
    }, []);


    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        // // Hiển thị kết quả nếu có từ khóa
        // if (value) {
        //     setVisible(true);
        // } else {
        //     setVisible(false);
        // }
    };

    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            //setVisible(false);
        }
    };

    // let source = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStltpfa69E9JTQOf5ZcyLGR8meBbxMFJxM0w&s"
    // const roadmaps = [
    //     { id: 0, title: 'CSS cơ bản', author: 'KoPhaiVu', clones: 123, avatar: source },
    //     { id: 1, title: 'HTML cơ bản', author: 'KoPhaiVu', clones: 123, avatar: source },
    //     { id: 2, title: 'Javascript cơ bản', author: 'KoPhaiVu', clones: 123, avatar: source },
    //     { id: 3, title: 'Github cơ bản', author: 'KoPhaiVu', clones: 123, avatar: source },
    // ];

    // const [timelines, setTimelines] = useState([
    //     {
    //         id: 0,
    //         title: 'CSS cơ bản',
    //         author: 'KoPhaiVu',
    //         avatar: source,
    //         contributors: 3
    //     },
    //     {
    //         id: 1,
    //         title: 'HTML cơ bản',
    //         author: 'KoPhaiVu',
    //         avatar: source,
    //         contributors: 1
    //     },
    //     {
    //         id: 2,
    //         title: 'Javascript cơ bản',
    //         author: 'KoPhaiVu',
    //         avatar: source,
    //         contributors: 2
    //     },
    //     {
    //         id: 3,
    //         title: 'Github cơ bản',
    //         author: 'KoPhaiVu',
    //         avatar: source,
    //         contributors: 3
    //     },
    // ]);



    // Lắng nghe sự kiện click chuột ra ngoài vùng Search
    document.addEventListener('mousedown', handleClickOutside);

    const handleSearch = async (e) => {
        if (search && e.key === 'Enter') {
            setVisible(true);
            setRoadmaps([])
            setTimelines([])
            await fetchSearchRoadmap(profile)
            await fetchSearchTimeline(profile)
        }
    }

    return (
        <div ref={searchRef}>
            <Tippy
                interactive
                visible={visible}
                placement='bottom-end'
                onClickOutside={() => setVisible(false)}
                render={(attrs) => (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            <h1 className={cx('title')}>Roadmaps</h1>
                            {roadmaps.map((roadmap) => {
                                return <Roadmap key={roadmap.id} children={roadmap} setVisible={setVisible} />;
                            })}
                            <h1 className={cx('title')}>Timelines</h1>
                            {timelines.map((timeline) => {
                                return <Timeline key={timeline.id} children={timeline} setVisible={setVisible} />;
                            })}
                        </PopperWrapper>
                    </div>
                )}
            >
                <div className={cx('search')}>
                    <input placeholder='Find roadmap'
                        value={search}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleSearch(e)}
                    />

                    <button
                        className={cx('search-btn')}
                        onClick={(e) => handleSearch(e)}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </div>
            </Tippy>
        </div>
    );
}

export default SearchRoadmap;
