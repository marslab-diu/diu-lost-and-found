import { createBrowserRouter } from "react-router";
import UserLayout from "../layouts/UserLayout";
import Home from "../pages/User/Home";
import Search from "../pages/User/Search";
import ReportLost from "../pages/User/ReportLost";
import ReportFound from "../pages/User/ReportFound";
import RecoveredItems from "../pages/User/RecoveredItems";
import Profile from "../pages/User/Profile";
import About from "../pages/Shared/About";
import Help from "../pages/Shared/Help";
import Locations from "../pages/Shared/Locations";
import Feedback from "../pages/Shared/Feedback";
import Terms from "../pages/Shared/Terms";
import Privacy from "../pages/Shared/Privacy";
import AuthLayout from "../layouts/AuthLayout";


export const router = createBrowserRouter([
    {
        path: "/",
        Component: AuthLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: "about",
                element: <About></About>
            },
            {
                path: "help",
                element: <Help></Help>
            },
            {
                path: "locations",
                element: <Locations></Locations>
            },
            {
                path: "feedback",
                element: <Feedback></Feedback> 
            },
            {
                path: "terms",
                element: <Terms></Terms>
            },
            {
                path: "privacy",
                element: <Privacy></Privacy>
            }   

        ]
    },
    {
        path: "/user",
        Component: UserLayout, 
        children: [
            { 
                path: "search",
                element: <Search></Search>
            },
            {
                path: "report-lost",
                element: <ReportLost></ReportLost>
            },
            {
                path: "report-found",
                element: <ReportFound></ReportFound> 
            },
            {
                path: "recovered-items",
                element: <RecoveredItems></RecoveredItems>
            },
            {
                path: "profile",
                element: <Profile></Profile>
            },
        ]
    }, 
]);