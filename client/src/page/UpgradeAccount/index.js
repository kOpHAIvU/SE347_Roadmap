import { useEffect, useState } from 'react';
import styles from './UpgradeAccount.module.scss';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function UpgradeAccount() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);


    const [showMessage, setShowMessage] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [upgradeLink, setUpgradleLink] = useState('');

    const getToken = () => {
        const token = localStorage.getItem('vertexToken');

        if (!token) {
            navigate(`/login`);
            return;
        }
        return token;
    }

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:3004/auth/profile', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${getToken()}`, // Đính kèm token vào tiêu đề Authorization
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message || 'Failed to fetch profile data.');
                navigate(`/login`);
                return;
            }

            const data = await response.json();
            setProfile(data.data.id)
            return data.data.id
        } catch (error) {
            console.error('Fetch Profile Error:', error);
        }
    };

    const fetchNewZaloPayment = async () => {
        try {
            const body = new URLSearchParams({
                totalPayment: 100000,
                type: 'zalopay'
            }).toString();
            const response = await fetch('http://localhost:3004/payment/new/zalopay', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body,
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data);
                setShowMessage(true)
                setUpgradleLink(data.data.oderurl)
                window.open(data.data.oderurl, "_blank");
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchPaymentStatus = async (profileId) => {
        try {
            const response = await fetch(`http://localhost:3004/payment/user/${profileId}?page=1&limit=1`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Payment status: ", data);
                if (data && data.data && data.data.length > 0)
                    navigate('/home')
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const profileId = await fetchProfile();
            if (profileId)
                await fetchPaymentStatus(profileId);
        };
        fetchData();
    }, []);

    const handleUpgrade = async () => {
        await fetchNewZaloPayment()
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(upgradeLink);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // Thông báo biến mất sau 2 giây
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('detail-container')}>
                <h1 className={cx('benefit')}>Account Upgrade Benefits</h1>
                <ul className={cx('benefit-list')}>
                    <li className={cx('dash-line')}>○ Limited to 3 roadmaps.</li>
                    <li className={cx('normal-line')}>○ Upgrade to 15 roadmaps.</li>
                    <li className={cx('dash-line')}>○ Limited to 3 timelines.</li>
                    <li className={cx('normal-line')}>○ Upgrade to 15 timelines.</li>
                    <li className={cx('normal-line')}>○ Enjoy more workspace.</li>
                </ul>
                <div className={cx('payment-section')}>
                    <h3 className={cx('payment-price')}>For only 100,000 VND</h3>
                    <button className={cx('upgrade-button')} onClick={handleUpgrade}>
                        Upgrade Now
                    </button>
                    {showMessage && (
                        <div className={cx('confirmation')}>
                            <p className={cx('small-text')}>
                                Account will be upgraded 2 minutes after payment.
                            </p>
                            <div className={cx('copy-container')}>
                                <span className={cx('link')}>{upgradeLink}</span>
                                <button className={cx('copy-button')} onClick={handleCopy}>
                                    Copy Link
                                </button>
                                {copySuccess && <span className={cx('copy-success')}>Copied!</span>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UpgradeAccount;
