import { Link } from 'react-router-dom';
import styles from './Login.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import road1 from '~/assets/images/road01.png'
import road2 from '~/assets/images/road02.png'
import { useState } from 'react';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const cx = classNames.bind(styles);

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Xóa lỗi khi nhập lại
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        
        if (name === 'email') {
            const emailError = 
                !value ? 'Please enter your email!' : 
                !/\S+@\S+\.\S+/.test(value) ? 'Invalid email!' : '';
    
            setErrors((prev) => ({ ...prev, email: emailError }));
        }
    };
      
    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Please enter your email!';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email!';
        }

        if (!formData.password) newErrors.password = 'Please enter your password!';
        else if (formData.password.length < 6) {
            newErrors.password = 'Password must have at least 6 characters';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn hành vi reload trang
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            console.log('Form data:', formData);
            // Call API hoặc thực hiện logic khác ở đây
        }
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
                    <h1>Log in</h1>
                    <p>Welcome back to VertexOps!!!</p>

                    <button type="button" className={cx('google-btn')}>
                        <img src={images.google} alt="Google Logo"className={cx('google-logo')} />
                        <strong>Log in with Google</strong>
                    </button>

                    {/* Email Input */}
                    <div className={cx('form-group', { invalid: !!errors.email })}>
                        <input
                            type="text"
                            name="email"
                            placeholder="Username or Email"
                            className={cx('input-field')}
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errors.email && (
                            <span className={cx('error-message')}>{errors.email}</span>
                        )}
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

                        {errors.password && (
                            <span className={cx('error-message')}>{errors.password}</span>
                        )}
                    </div>

                    <a href="#" className={cx('forgot-password')}>Forgot Password?</a>

                    <button type="submit" className={cx('login-btn')}>
                        Log in
                    </button>

                    <p className={cx('sign-up')}>
                        Don't have an account? <Link to="/signup">Sign up</Link>
                    </p>
                </form>
            </div>
    );
}

export default Login;
