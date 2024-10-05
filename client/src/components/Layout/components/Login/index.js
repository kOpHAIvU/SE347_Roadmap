import { Link } from 'react-router-dom'; 
import styles from './Login.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import Signup from '~/page/Signup';
import road1 from './images/road01.png'
import road2 from './images/road02.png'

const cx = classNames.bind(styles);

function Login() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>

                <div className={cx('image-road')}>
                    <img src={road1} alt="Description 1" className={cx('road1')} />   
                    <img src={road2} alt="Description 2" className={cx('road2')} />
                </div>

                <div className={cx('login-container')}>
                    <div className={cx('logo')}>
                        <img src={images.logo} alt="VertexOps" />
                    </div>
                    <h1>Log in</h1>
                    <p>Welcome back to VertexOps!!!</p>

                    <button className={cx('google-btn')}>
                        <FontAwesomeIcon icon={faGoogle} className={cx('fa-google')}/>
                        <trong>Log in with Google</trong>
                    </button>

                    <input 
                        type="text" 
                        placeholder="Username or Email" 
                        className={cx('input-field')}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className={cx('input-field')}
                    />
                    <a href="#" className={cx('forgot-password')}>Forgot Password?</a>
                    <button className={cx('login-btn')}>Log in</button>
                    <p className={cx('sign-up')}>Don't have an account? 
                        <Link to="/signup">Sign up</Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Login;
