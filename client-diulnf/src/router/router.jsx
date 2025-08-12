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
import Forbidden from "../pages/Shared/Forbidden";
import AdminLayout from "../layouts/AdminLayout";
import AdminLogin from "../pages/Admin/AdminLogin";
import RootLayout from "../layouts/RootLayout";
import UserLogin from "../pages/User/UserLogin";
import Dashboard from "../pages/Admin/Dashboard";
import ManageAdmin from "../pages/Admin/ManageAdmin";
import AdminHome from "../pages/Admin/AdminHome";
import AdminProfile from "../pages/Admin/AdminProfile";
import LostReports from "../pages/Admin/LostReports";
import FoundReports from "../pages/Admin/FoundReports";
import ManualEntry from "../pages/Admin/ManualEntry";
import AdminRecoveredItems from "../pages/Admin/AdminRecoveredItems";
import ClaimedItems from "../pages/Admin/ClaimedItems";
import AdminResolvedItems from "../pages/Admin/AdminResolvedItems";
import SearchedResults from "../pages/User/SearchedResults";
import AdminRoute from "../routes/AdminRoute";
import Error from "../pages/Shared/Error";


export const router = createBrowserRouter([
    // public 
    {
        path: "/",
        Component: RootLayout,
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
            },
            {
                path: "forbidden",
                element: <Forbidden></Forbidden>
            }

        ]
    },
    //auth
    {
        path: "/auth",
        Component: AuthLayout,
        children: [
            {
                path: "login",
                element: <UserLogin></UserLogin>
            },
            {
                path: "login/admin",
                element: <AdminLogin></AdminLogin>
            }
        ]

    },



    // user
    {
        path: "/user",
        Component: UserLayout,
        children: [
            {
                path: "search",
                element: <Search></Search>
            },
            {
                path: "search-results",
                element: <SearchedResults></SearchedResults>
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
    // admin
    {
        path: "/admin",
        element: <AdminRoute><AdminLayout></AdminLayout></AdminRoute>,
        children: [
            {
                index: true,
                element: <AdminHome></AdminHome>
            },
            {
                path: "profile",
                element: <AdminProfile></AdminProfile>
            },
            {
                path: "dashboard",
                element: <Dashboard></Dashboard>
            },
            {
                path: "manage-admin",
                element: <ManageAdmin></ManageAdmin>
            },
            {
                path: "lost-reports",
                element: <LostReports></LostReports>
            },
            {
                path: "found-reports",
                element: <FoundReports></FoundReports>
            },
            {
                path: "admin-entry",
                element: <ManualEntry></ManualEntry>
            },
            {
                path: "recovered-items",
                element: <AdminRecoveredItems></AdminRecoveredItems>
            },
            {
                path: "claimed-items",
                element: <ClaimedItems></ClaimedItems>
            },
            {
                path: "resolved-items",
                element: <AdminResolvedItems></AdminResolvedItems>
            }
        ]

    },
    {
        path: "*",
        element: <Error></Error>
    }
]);