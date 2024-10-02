
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './MainGuest.module.scss';
import classNames from 'classnames/bind';
import { faFacebook, faGithub, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import image1 from './images/image01.png'
import image2 from './images/image02.png'
import image3 from './images/image03.png'


const cx = classNames.bind(styles);

function MainGuestGuest() {
    return <div className={cx('wrapper')}>
            <div className={cx('inner')}>

                <div className={cx('left')}>
                    <div className={cx('contents')}>
                        <h2 className={cx('main-title')}>The distance will not be a problem if we care enough for each other.</h2>
                        <p className={cx('main-description')}>
                            That's why VertexOps was created — to help you excel at learning from home. If you're struggling with self-study, you've come to the right place.
                        </p>
                    </div>
                    
                    <div className={cx('button-group')}>
                        <button className={cx('learn-more')}>Lean more</button>
                        <button className={cx('sign-up')}>Sign up</button>
                    </div>
                    
                    <div className={cx('social-icons')}>
                        <a href="https://github.com/Pttvinh253" className={cx('icon-github')}>
                        <FontAwesomeIcon icon={faGithub}/>
                        </a>
                        <a href="https://www.instagram.com/_pttvinh_253/" className={cx('icon-linkedin')}>
                        <FontAwesomeIcon icon={faLinkedin}/>
                        </a>
                        <a href="https://www.instagram.com/phamthanh050204/" className={cx('icon-instagram')}>
                        <FontAwesomeIcon icon={faInstagram}/>
                        </a>
                        <a href="https://www.facebook.com/phamthanh050204" className={cx('icon-facebook')}>
                            <FontAwesomeIcon icon={faFacebook}/>
                        </a>
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
}

export default MainGuestGuest;