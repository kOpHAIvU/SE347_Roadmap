import { Link, useNavigate  } from 'react-router-dom';
import styles from './Signup.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import road1 from '~/assets/images/road01.png'
import road2 from '~/assets/images/road02.png'
import { useState } from 'react';

const cx = classNames.bind(styles);

function Signup() {
    const [formData, setFormData] = useState({ email: '', username: '', password: '' });
    const [errors, setErrors] = useState({ email: '', username: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); 

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

        if (!formData.username) newErrors.username = 'Please enter username!';
        if (!formData.password) newErrors.password = 'Please enter your password!';
        else if (formData.password.length < 6) {
            newErrors.password = 'Password must have at least 6 characters!';
        }

        return newErrors;
    };

    const handleSubmit = async  (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            console.log('Form data:', formData);
            // Call API hoặc thực hiện logic khác ở đây
            try {
                const response = await fetch('http://localhost:5000/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Sign up successful!');
                    navigate('/home'); // Điều hướng đến trang Home
                } else {
                    alert(data.message || 'Signup failed!'); // Thông báo lỗi
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
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
                    <h1 className={cx('sign-up-title')}>Sign up</h1>
                    <p className={cx('sign-up-description')}>Create your free account 😎!!!</p>

                    <button type="button" className={cx('google-btn')}>
                        <img src={images.google} alt="Google Logo"className={cx('google-logo')} />
                        <strong>Sign up with Google</strong>
                    </button>

                    <div className={cx('divider')}>
                        <span className={cx('divider-text')}>OR</span>
                    </div>

                    {/* Email Input */}
                    <div className={cx('form-group', { invalid: !!errors.email })}>
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            className={cx('input-field')}
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
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

                    <button type="submit" className={cx('sign-btn')}>
                        Sign up
                    </button>

                    <p className={cx('log-in')}>
                        Already have an account? 
                        <Link to="/login" className={cx('log-in-link')}>Log In</Link>
                    </p>
                </form>
            </div>
    );
}

export default Signup;
