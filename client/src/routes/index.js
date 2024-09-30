import { HomeLayout, MainScreenLayout } from "~/components/Layout/index.js";
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
    { path: '/login', Component: Login },
    { path: '/signup', Component: Signup },
    { path: '/information', Component: Information },
];

const privateRoutes = [
    { path: '/home', Component: Home, layout: HomeLayout },
    { path: '/timeline', Component: Timeline, layout: HomeLayout },
    { path: '/your_roadmap', Component: YourRoadmap, layout: HomeLayout },
    { path: '/favorite', Component: YourFavourite, layout: HomeLayout },
    { path: '/account', Component: Account, layout: HomeLayout },
    { path: '/security', Component: Security, layout: HomeLayout },
    { path: '/report', Component: Report, layout: HomeLayout },
];

export { publicRoutes, privateRoutes };