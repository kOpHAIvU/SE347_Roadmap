import { MainScreenLayout, DefaultLayout } from '~/components/Layout/index.js';
import TestLayout from '~/components/Layout/TestLayout/index.js';
import Home from '~/page/Home/index.js';
import Information from '~/page/Information/index.js';
import Login from '~/page/Login/index.js';
import MainScreen from '~/page/MainScreen/index.js';
import OwnRoadmap from '~/page/OwnRoadmap/index.js';
import { Account, Report, Security, TimelineSetting } from '~/page/Settings/index.js';
import Signup from '~/page/Signup/index.js';
import Timeline from '~/page/Timeline/index.js';
import YourFavourite from '~/page/YourFavourite/index.js';
import YourRoadmap from '~/page/YourRoadmap/index.js';
import YourTimeline from '~/page/YourTimeline/index.js';
import ForgotPassword from '~/page/ForgotPassword/index.js';
import UpgradeAccount from '~/page/UpgradeAccount/index.js';
import Reports from '~/page/Reports/index.js';

const publicRoutes = [
    { path: '/', Component: MainScreen, layout: MainScreenLayout },
    { path: '/login', Component: Login, layout: MainScreenLayout },
    { path: '/signup', Component: Signup, layout: MainScreenLayout },
    { path: '/password_reset', Component: ForgotPassword, layout: MainScreenLayout },
    { path: '/information', Component: Information },
];

const privateRoutes = [
    { path: '/home', Component: Home, layout: DefaultLayout },
    { path: '/timeline', Component: YourTimeline, layout: DefaultLayout },
    // { path: '/timeline/setting', Component: TimelineSetting, layout: DefaultLayout },
    // { path: '/timeline/setting/invite', Component: TimelineSetting, layout: DefaultLayout },
    { path: '/your_roadmap', Component: YourRoadmap, layout: DefaultLayout },
    { path: '/favourite', Component: YourFavourite, layout: DefaultLayout },
    { path: '/upgrade', Component: UpgradeAccount, layout: DefaultLayout },
    { path: '/security', Component: Security, layout: DefaultLayout },
    { path: '/report', Component: Report, layout: DefaultLayout },
    { path: '/reportRoadmap', Component: Reports, layout: DefaultLayout },
];

const accountDataRoutes = [
    { path: '/roadmap/:id', Component: OwnRoadmap, layout: DefaultLayout },
    { path: '/timeline/:id', Component: Timeline, layout: DefaultLayout },
    { path: '/timeline/:id/setting', Component: TimelineSetting, layout: DefaultLayout },
    { path: '/account/:id', Component: Account, layout: DefaultLayout },
    { path: '/timeline/:id/setting/invite', Component: TimelineSetting, layout: DefaultLayout },
    { path: '/test', layout: TestLayout },
];

export { publicRoutes, privateRoutes, accountDataRoutes };
