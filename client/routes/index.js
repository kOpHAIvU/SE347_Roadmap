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
    { path: '/', Component: MainScreen },
    { path: '/login', Component: Login },
    { path: '/signup', Component: Signup },
    { path: '/information', Component: Information },
];

const privateRoutes = [
    { path: '/home', Component: Home },
    { path: '/timeline', Component: Timeline },
    { path: '/your_roadmap', Component: YourRoadmap },
    { path: '/favorite', Component: YourFavourite },
    { path: '/account', Component: Account },
    { path: '/security', Component: Security },
    { path: '/report', Component: Report },
];

export { publicRoutes, privateRoutes };