import { Link } from 'react-router-dom';
import styles from './Signup.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import road1 from './images/road01.png';
import road2 from './images/road02.png';
import { useState } from 'react';

const cx = classNames.bind(styles);

function Signup() {
    const [formData, setFormData] = useState({ email: '', username: '', password: '' });
    const [errors, setErrors] = useState({ email: '', username: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Xóa lỗi khi nhập lại
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Vui lòng nhập email';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.username) newErrors.username = 'Vui lòng nhập username';
        if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
        else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            console.log('Form data:', formData);
            // Call API hoặc thực hiện logic khác ở đây
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('image-road')}>
                    <img src={road1} alt="Road 1" className={cx('road1')} />
                    <img src={road2} alt="Road 2" className={cx('road2')} />
                </div>

                <form className={cx('login-container')} onSubmit={handleSubmit}>
                    <div className={cx('logo')}>
                        <img src={images.logo} alt="VertexOps" />
                    </div>
                    <h1>Sign up</h1>
                    <p>Create your free account 😎!!!</p>

                    <button type="button" className={cx('google-btn')}>
                        <FontAwesomeIcon icon={faGoogle} className={cx('fa-google')} />
                        <strong>Sign up with Google</strong>
                    </button>

                    {/* Email Input */}
                    <div className={cx('form-group', { invalid: !!errors.email })}>
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            className={cx('input-field')}
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && (
                            <span className={cx('error-message')}>{errors.email}</span>
                        )}
                    </div>

                    {/* Username Input */}
                    <div className={cx('form-group', { invalid: !!errors.username })}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            className={cx('input-field')}
                            value={formData.username}
                            onChange={handleChange}
                        />
                        {errors.username && (
                            <span className={cx('error-message')}>{errors.username}</span>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className={cx('form-group', { invalid: !!errors.password })}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className={cx('input-field')}
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && (
                            <span className={cx('error-message')}>{errors.password}</span>
                        )}
                    </div>

                    <button type="submit" className={cx('login-btn')}>
                        Sign up
                    </button>

                    <p className={cx('log-in')}>
                        Already have an account? <Link to="/login">Log In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signup;
