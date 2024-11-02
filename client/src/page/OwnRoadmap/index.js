import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faA, faCircleDown, faSitemap, faPenToSquare as penSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import Comment from '~/components/Layout/components/Comment/index.js';
import styles from './OwnRoadmap.module.scss';
import classNames from 'classnames/bind';
import RoadmapSection from '~/components/Layout/components/RoadmapSection/index.js';
import AdvanceRoadmap from '~/components/Layout/components/AdvanceRoadmap/index.js';

const cx = classNames.bind(styles);

function OwnRoadmap() {
    const [roadName, setRoadName] = useState('Name not given');
    const [titleText, setTitleText] = useState('Make some description');
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef(null);
    const [contentExpanded, setIsContentExpanded] = useState(false);
    const [loved, setLoved] = useState(false);
    const [toggle, setToggle] = useState(false);

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const lineHeight = parseInt(getComputedStyle(textareaRef.current).lineHeight, 10);
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight + lineHeight}px`;
        }
    };

    useEffect(() => {
        if (isEditing) adjustTextareaHeight();
    }, [isEditing, titleText]);

    // Handle focus on road name input
    const handleFocus = () => {
        if (roadName === 'Name not given') {
            setRoadName(''); // Clear the input if it shows "Name not given"
        }
    };

    // Handle blur on road name input
    const handleBlur = () => {
        if (roadName.trim() === '') {
            setRoadName('Name not given'); // Reset to "Name not given" if input is empty
        }
    };

    // Handle change for road name input
    const handleRoadNameChange = (e) => {
        const value = e.target.value;
        setRoadName(value);
    };

    // Handle focus on title text textarea
    const handleTitleFocus = () => {
        setIsEditing(true)
        if (titleText === 'Make some description') {
            setTitleText(''); // Clear the textarea if it shows "Make some description"
        }
    };

    // Handle blur on title text textarea
    const handleTitleBlur = () => {
        setIsEditing(false)
        if (titleText.trim() === '') {
            setTitleText('Make some description'); // Reset to "Make some description" if textarea is empty
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('important-section')}>
                <input
                    className={cx('page-title')}
                    value={roadName}
                    onChange={handleRoadNameChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />

                <FontAwesomeIcon
                    onClick={() => setToggle(!toggle)}
                    icon={toggle ? faSitemap : faA}
                    className={cx('toggle-icon')} />
            </div>

            <div className={cx('content-section')}>
                {isEditing ? (
                    <textarea
                        ref={textareaRef}
                        value={titleText}
                        onChange={(e) => setTitleText(e.target.value)}
                        onFocus={handleTitleFocus}
                        onBlur={handleTitleBlur}
                        className={cx('content-input')}
                        autoFocus
                    />
                ) : (
                    <span className={cx('content', { expanded: contentExpanded })} onClick={() => setIsContentExpanded(!contentExpanded)}>
                        {titleText}
                    </span>
                )}
                <FontAwesomeIcon className={cx('rewrite-content-btn')} icon={penSolid} onClick={() => setIsEditing(!isEditing)} />
            </div>
            <div className={cx('roadmap-section')}>
                {toggle ? <RoadmapSection /> : <AdvanceRoadmap/>}
            </div>
            <div className={cx('drop-react')}>
                <button onClick={() => setLoved(!loved)} className={cx('react-love', { loved })}>
                    <FontAwesomeIcon className={cx('love-roadmap')} icon={faHeartRegular} />
                    <h1 className={cx('love-text')}>Love</h1>
                </button>
                <button className={cx('clone-roadmap')}>
                    <FontAwesomeIcon className={cx('clone-icon')} icon={faCircleDown} />
                    <h1 className={cx('clone-text')}>Clone</h1>
                </button>
            </div>
            <Comment />
        </div>
    );
}

export default OwnRoadmap;