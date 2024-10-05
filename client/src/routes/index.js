import { HomeLayout, MainScreenLayout, LoginLayout, SignupLayout } from "~/components/Layout/index.js";
import Home from "~/page/Home/index.js";
import Information from "~/page/Information/index.js";
import Login from "~/page/Login/index.js";
import MainScreen from "~/page/MainScreen/index.js";
import { Account, Report, Security } from "~/page/Settings/index.js";
import Signup from "~/page/Signup/index.js";
import Timeline from "~/page/Timeline/index.js";
import YourFavourite from "~/page/YourFavourite/index.js";
import YourRoadmap from "~/page/YourRoadmap/index.js";


const publicRoutes = [
    { path: '/', Component: MainScreen, layout: MainScreenLayout },
    { path: '/login', Component: Login, layout: LoginLayout },
    { path: '/signup', Component: Signup, layout: SignupLayout },
    { path: '/information', Component: Information },
];

const privateRoutes = [
    { path: '/home', Component: Home, layout: DefaultLayout },
    { path: '/timeline', Component: Timeline, layout: DefaultLayout },
    { path: '/your_roadmap', Component: YourRoadmap, layout: DefaultLayout },
    { path: '/favorite', Component: YourFavourite, layout: DefaultLayout },
    { path: '/account', Component: Account, layout: DefaultLayout },
    { path: '/security', Component: Security, layout: DefaultLayout },
    { path: '/report', Component: Report, layout: DefaultLayout },
];

const accountDataRoutes = [
    { path: '/roadmap/1', Component: Roadmap, },
]

export { publicRoutes, privateRoutes, accountDataRoutes };