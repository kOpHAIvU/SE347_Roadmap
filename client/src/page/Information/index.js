import styles from './Information.module.scss';
import classNames from 'classnames/bind';
import page from '~/assets/images/page-yourroadmap.png';
import code from '~/assets/images/image_code.png';
import { TbDeviceAnalytics } from 'react-icons/tb';
import { CgDigitalocean } from 'react-icons/cg';
import { LuSquareCode } from 'react-icons/lu';

const cx = classNames.bind(styles);

function Information() {
    return (
        <div className={cx('container')}>
            <section className={cx('heroStack')}>
                <div className={cx('titleSection')}>
                    <p className={cx('announcement')}>Discover our tools for roadmap planning. Learn more</p>
                    <h1 className={cx('title')}>Roadmapping tools for visionaries</h1>
                    <p className={cx('subtitle')}>
                        Plan, visualize, and execute your projects seamlessly with our interactive timeline tools
                        designed for modern teams.
                    </p>
                    <div className={cx('buttons')}>
                        <button className={cx('btn', 'download')}>Try the roadmap tool</button>
                        <button className={cx('btn', 'contact')}>Get in touch with us</button>
                    </div>
                    <div className={cx('image')}>
                        <img src={page} alt="Roadmap visualization" className={cx('page')} />
                    </div>
                </div>
            </section>

            <section className={cx('features')}>
                <p className={cx('introduce-logo')}>A collection of trusted resources powering your project roadmap</p>
                <div className={cx('logos')}>
                    <span className={cx('logo')}>roadmap.sh</span>
                    <span className={cx('logo')}>github.com</span>
                    <span className={cx('logo')}>facebook.com</span>
                    <span className={cx('logo')}>docs.google.com</span>
                    <span className={cx('logo')}>taskde.ai</span>
                    <span className={cx('logo')}>figma.com</span>
                </div>
                <h2 className={cx('featureTitle')}>Essential Features for Every Project Stage</h2>
                <p className={cx('featureSubtitle')}>
                    Our roadmap tools are built to support each stage of your project, from ideation to delivery.
                </p>
                <div className={cx('cards')}>
                    <div className={cx('card-wrapper', 'glow')}>
                        <div className={cx('card')}>
                            <TbDeviceAnalytics className={cx('logo-icon')} size={40} />
                            <h3 className={cx('title-card')}>Project Analytics</h3>
                            <p className={cx('contents-card')}>
                                Track progress and monitor key metrics with our analytics. Get real-time updates and
                                gain insights to keep your roadmap on track.
                            </p>
                            <a href="/" className={cx('link-card')}>
                                View analytics
                            </a>
                        </div>
                    </div>

                    <div className={cx('card-wrapper', 'glow')}>
                        <div className={cx('card')}>
                            <CgDigitalocean className={cx('logo-icon')} size={40} />
                            <h3 className={cx('title-card')}>Resource Management</h3>
                            <p className={cx('contents-card')}>
                                Optimize resource allocation with our roadmap tool, helping you manage time, personnel,
                                and budget for every phase.
                            </p>
                            <a href="/" className={cx('link-card')}>
                                Learn more
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className={cx('features')}>
                <div className={cx('card-wrapper', 'glow')}>
                    <div className={cx('card-big')}>
                        <div className={cx('card-big-left')}>
                            <LuSquareCode className={cx('logo-icon')} size={40} />
                            <h3 className={cx('title-card')}>Collaborative Roadmap Editing</h3>
                            <p className={cx('contents-card')}>
                                Collaborate with your team in real-time. Our roadmap tool keeps everyone aligned and
                                ensures accurate updates from all contributors.
                            </p>
                            <a href="/" className={cx('link-card')}>
                                Explore collaboration tools
                            </a>
                        </div>

                        <div className={cx('image-code')}>
                            <img src={code} alt="Collaborative code editing" className={cx('code')} />
                        </div>
                    </div>
                </div>
            </section>

            <footer className={cx('footer')}>
                <h2 className={cx('main-title')}>Your roadmap to success starts here</h2>
                <p className={cx('sub-title')}>
                    Empower your team with a streamlined roadmap tool. Start creating, customizing, and tracking your
                    projects today.
                </p>
                <button className={cx('btn', 'download')}>Start Your Free Trial</button>
            </footer>
        </div>
    );
}

export default Information;
