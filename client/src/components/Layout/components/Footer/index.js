import React from 'react';
import { FaFacebook, FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';
import classNames from 'classnames/bind';
import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <footer className={cx('footer')}>
            <div className={cx('footer-container')}>
                <div className={cx('footer-content')}>
                    <div className={cx('footer-left')}>
                        <h3>VertexOps</h3>
                        <p>
                            The milestone creation support website made by the bare hands of UIT University's K17 will help you create the most appropriate learning path for yourself and your teammates.
                        </p>
                    </div>
                </div>

                <div className={cx('footer-links')}>
                    <h4>Quick Links</h4>
                    <ul>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                                Resources
                            </a>
                        </li>
                        <li>
                            <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
                                React
                            </a>
                        </li>

                        <li>
                            <a href="/demo">Demo</a>
                        </li>
                    </ul>
                </div>

                <div className={cx('footer-contact')}>
                    <h4>Contact Us</h4>
                    <p>Email: vinhcute@lovely.frv</p>
                    <p>Phone: 999 999 999 9</p>
                    <p>Address: 123 Roadmap St, Success City</p>
                </div>

                <div className={cx('footer-newsletter')}>
                    <h4>Subscribe to our Newsletter</h4>
                    <form>
                        <input type="email" placeholder="Your email address" />
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </div>

            <div className={cx('footer-bottom')}>
                <p className={cx('footer-text')}>&copy; {new Date().getFullYear()} VertexOps. All rights reserved.</p>

                <div className={cx('footer-social')}>
                    <a href="https://www.facebook.com/phamthanh050204" target="_blank" rel="noopener noreferrer">
                        <FaFacebook size={24} />
                    </a>
                    <a href="https://github.com/Pttvinh253" target="_blank" rel="noopener noreferrer">
                        <FaGithub size={24} />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin size={24} />
                    </a>
                    <a href="https://www.instagram.com/phamthanh050204/" target="_blank" rel="noopener noreferrer">
                        <FaInstagram size={24} />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
