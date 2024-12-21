import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import road1 from '~/assets/images/road01.png';
import road2 from '~/assets/images/road02.png';
import { useState } from 'react';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Xóa lỗi khi nhập lại
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.username) {
            newErrors.username = 'Please enter your username!';
        }

        if (!formData.password) {
            newErrors.password = 'Please enter your password!';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must have at least 6 characters';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn hành vi reload trang
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            console.log('Form data:', formData);
            try {
                const response = await fetch('http://localhost:3004/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: formData.username,
                        password: formData.password,
                    }),
                });

                const data = await response.json();
                // Kiểm tra mã trạng thái và thông báo
                if (response.ok) {
                    const { accessToken } = data; // Lấy accessToken từ phản hồi

                    if (accessToken) {
                        localStorage.setItem('vertexToken', accessToken);
                        navigate('/home');
                    } else {
                        console.log('Access token not received!');
                    }
                } else {
                    console.log(data.message || 'Login failed!'); // Thông báo lỗi
                }
            } catch (error) {
                console.error('Error:', error);
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    const handleForgotPassword = () => {
        navigate('/password_reset');
    };

    return (
        <div className={cx('inner')}>
            <div className={cx('image-road')}>
                <img src={road1} alt="Road 1" className={cx('road1')} />
                <img src={road2} alt="Road 2" className={cx('road2')} />
            </div>

            <form className={cx('login-container')} onSubmit={handleSubmit}>
                <div className={cx('logo')}>
                    <img src={images.logo} alt="VertexOps" />
                </div>
                <h1 className={cx('login-title')}>Log in</h1>
                <p className={cx('login-welcome')}>Welcome back to VertexOps😍!!!</p>

                <button type="button" className={cx('google-btn')}>
                    <img src={images.google} alt="Google Logo" className={cx('google-logo')} />
                    <strong>Log in with Google</strong>
                </button>

                <div className={cx('divider')}>
                    <span className={cx('divider-text')}>OR</span>
                </div>

                {/* Username  Input */}
                <div className={cx('form-group', { invalid: !!errors.username })}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className={cx('input-field')}
                        value={formData.username}
                        onChange={handleChange}
                    />
                    {errors.username && <span className={cx('error-message')}>{errors.username}</span>}
                </div>

                {/* Password Input */}
                <div className={cx('form-group', { invalid: !!errors.password })}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        className={cx('input-field')}
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <span className={cx('password-toggle')} onClick={() => setShowPassword(!showPassword)}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </span>

                    {errors.password && <span className={cx('error-message')}>{errors.password}</span>}
                </div>

                <a href="" className={cx('forgot-password')} onClick={handleForgotPassword}>
                    Forgot Password?
                </a>

                <button type="submit" className={cx('login-btn')}>
                    Log in
                </button>

                <p className={cx('sign-up')}>
                    Don't have an account?{' '}
                    <Link to="/signup" className={cx('sign-up-link')}>
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
