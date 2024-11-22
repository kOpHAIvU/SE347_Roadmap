import styles from './MainGuest.module.scss';
import classNames from 'classnames/bind';
import image1 from '~/assets/images/image01.png';
import image2 from '~/assets/images/image02.png';
import image3 from '~/assets/images/image03.png';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function MainGuestGuest() {
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleSignupClick = () => {
        navigate('/signup'); // Điều hướng đến trang login
    };

    const handleLearnMoreClick = () => {
        navigate('/information'); // Điều hướng tới trang Information
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('left')}>
                    <div className={cx('contents')}>
                        <h2 className={cx('main-title')}>
                            The distance will not be a problem if we care enough for each other.
                        </h2>
                        <p className={cx('main-description')}>
                            That's why VertexOps was created — to help you excel at learning from home. If you're
                            struggling with self-study, you've come to the right place.
                        </p>
                    </div>

                    <div className={cx('button-group')}>
                        <button className={cx('learn-more')} onClick={handleLearnMoreClick}>
                            Lean more
                        </button>
                        <button className={cx('sign-up')} onClick={handleSignupClick}>
                            Sign up
                        </button>
                    </div>
                </div>

                <div className={cx('right')}>
                    <div className={cx('image-container')}>
                        <img src={image1} alt="Description 1" className={cx('image1')} />
                        <img src={image2} alt="Description 2" className={cx('image2')} />
                        <img src={image3} alt="Description 3" className={cx('image3')} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainGuestGuest;
