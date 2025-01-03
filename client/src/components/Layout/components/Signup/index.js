import { Link, useNavigate } from 'react-router-dom';
import styles from './Signup.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import road1 from '~/assets/images/road01.png';
import road2 from '~/assets/images/road02.png';
import defaultavatar from '~/assets/images/defaultavatar.jpg';
import { useState } from 'react';

const cx = classNames.bind(styles);

function Signup() {
    const [formData, setFormData] = useState({ email: '', username: '', password: '' });
    const [errors, setErrors] = useState({ email: '', username: '', password: '' });
    // const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Xóa lỗi khi nhập lại
    };
    const handleBlur = (e) => {
        const { name, value } = e.target;

        if (name === 'email') {
            const emailError = !value
                ? 'Please enter your email!'
                : !/\S+@\S+\.\S+/.test(value)
                ? 'Invalid email!'
                : '';

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
        else if (formData.password.length < 8) {
            newErrors.password = 'Password must have at least 8 characters!';
        }

        return newErrors;
    };
    const defaultPhotoUrl = 'https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg';

    const fetchDefaultPhotoAsFile = async () => {
        try {
            // Fetch ảnh từ URL
            const response = await fetch(defaultavatar);

            if (!response.ok) {
                throw new Error('Failed to fetch default avatar.');
            }

            // Chuyển ảnh thành blob
            const blob = await response.blob();

            // Tạo file từ blob
            const defaultFile = new File([blob], 'default-avatar.jpg', { type: blob.type });

            console.log('File created:', defaultFile);

            // Truyền file vào form hoặc sử dụng tiếp
            return defaultFile;
        } catch (error) {
            console.error('Error fetching default photo:', error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            const defaultFile = await fetchDefaultPhotoAsFile();

            // Kiểm tra nếu defaultFile tồn tại
            if (!defaultFile) {
                console.error('Default file is not available.');
                //alert('Failed to load default avatar. Please try again.');
                return;
            }

            const signupData = new FormData();
            signupData.append('email', formData.email);
            signupData.append('username', formData.username);
            signupData.append('password', formData.password);
            signupData.append('fullName', formData.username);
            signupData.append('gender', 'Male');
            signupData.append('role', 2);
            signupData.append('avatar', 'hihi');
            signupData.append('file', defaultFile);
            console.log('hjksjxk', signupData);
            for (const pair of signupData.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }

            try {
                const response = await fetch('http://localhost:3004/user/signup', {
                    method: 'POST',
                    // headers: { 'Content-Type': 'application/json' },
                    body: signupData,
                });

                const data = await response.json();
                console.log('data: ', data);
                if (response.ok) {
                    //alert('Sign up successful!');
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
                        }
                    }
                    // navigate('/home'); // Navigate to Home
                } else {
                    //alert(data.message || 'Signup failed!'); // Display error message
                }
            } catch (error) {
                console.error('Error:', error);
                //alert('An error occurred. Please try again.');
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
                    <img src={images.google} alt="Google Logo" className={cx('google-logo')} />
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
                    {errors.email && <span className={cx('error-message')}>{errors.email}</span>}
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
                    {errors.username && <span className={cx('error-message')}>{errors.username}</span>}
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
                    {errors.password && <span className={cx('error-message')}>{errors.password}</span>}
                </div>

                <button type="submit" className={cx('sign-btn')}>
                    Sign up
                </button>

                <p className={cx('log-in')}>
                    Already have an account?{' '}
                    <Link to="/login" className={cx('log-in-link')}>
                        Log In
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Signup;
