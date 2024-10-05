import { Link } from 'react-router-dom'; 
import styles from './Signup.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import road1 from './images/road01.png'
import road2 from './images/road02.png'

const cx = classNames.bind(styles);

function Signup() {
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
                    <h1>Sign up</h1>
                    <p>Create your free account 😎!!!</p>

                    <button className={cx('google-btn')}>
                        <FontAwesomeIcon icon={faGoogle} className={cx('fa-google')}/>
                        <trong>Sign up with Google</trong>
                    </button>

                    <input 
                        type="text" 
                        placeholder="Email" 
                        className={cx('input-field')}
                    />
                    <input 
                        type="password" 
                        placeholder="Username" 
                        className={cx('input-field')}
                    />
                    <input 
                        type="password" 
                        placeholder="Username" 
                        className={cx('input-field')}
                    />
                    <button className={cx('login-btn')}>Sign up</button>
                    <p className={cx('log-in')}>Already have an account?
                        <Link to="/login">Log In</Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Signup;
