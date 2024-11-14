import { useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import { useState } from 'react';

const cx = classNames.bind(styles);

function ForgotPassword() {
    const [formData, setFormData] = useState({ email: '' });
    const [errors, setErrors] = useState({ email: '' });
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
                const response = await fetch('http://localhost:5000/api/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                const data = await response.json();
                // Kiểm tra mã trạng thái và thông báo
                if (response.ok) {
                    alert('Password reset email sent!');
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                } else {
                    alert(data.message || 'Failed to send reset email!');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className={cx('inner')}>
            <form className={cx('resetpassword-container')} onSubmit={handleSubmit}>
                <div className={cx('logo')}>
                    <img src={images.logo} alt="VertexOps" />
                </div>
                <h2 className={cx('reset-title')}>Reset your password</h2>
                <p className={cx('reset-instructions')}>
                    Enter your user account's verified email address and we will send you a password reset link.
                </p>

                {/* Email Input */}
                <div className={cx('form-group', { invalid: !!errors.email })}>
                    <input
                        type="text"
                        name="email"
                        placeholder="Enter your email address"
                        className={cx('input-field')}
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {errors.email && <span className={cx('error-message')}>{errors.email}</span>}
                </div>

                <button type="submit" className={cx('resetpassword-btn')}>
                    Send password reset email
                </button>
            </form>
        </div>
    );
}

export default ForgotPassword;
