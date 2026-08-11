import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Dashboard from "../Layouts/DashboardLayout";
import Home from "../Pages/home/Home";
import Login from "../Pages/login/Login";
import Register from "../Pages/register/Register";
import AllBooks from "../Pages/allBooks/AllBooks";
import AddBook from "../Pages/dashboards/librarian/Addbook";
import PrivateRoute from "./Private/PrivateRoutes";
import MyBooks from "../Pages/dashboards/librarian/MyBooks";
import Orders from "../Pages/dashboards/librarian/Orders";
import ManageBooks from "../Pages/dashboards/admin/ManageBooks";
import ManageUser from "../Pages/dashboards/admin/ManageUsers";
import MyOrders from "../Pages/dashboards/user/MyOrders";
import MyProfile from "../Pages/myProfile/MyProfile";
import Stats from "../Pages/dashboards/stats/stats";
import Invoices from "../Pages/dashboards/user/Invoices";
import PaymentSuccess from "../Pages/dashboards/payment/PaymentSuccess";
import PaymentCancel from "../Pages/dashboards/payment/PaymentCancel";
import MyWishlist from "../Pages/dashboards/user/MyWishlist";
import BookDetails from "../Pages/home/bookDetails/BookDetails";
import ErrorPage from "../Pages/Error/ErrorPage";


const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout></RootLayout>,
        errorElement: <div className="text-3xl font-bold underline">404 Not Found</div>,
        children: [
            {
                index: true,
                element: <Home></Home>,
            },
            {
                path: "login",
                element: <Login></Login>
            },
            {
                path: "register",
                element: <Register></Register>
            },
            {
                path: "book/:id",
                element: <BookDetails></BookDetails>
            },
            {
                path: "all-books",
                element: <AllBooks></AllBooks>
            }
        ]
    },
    {
        path: "dashboard",
        element: <PrivateRoute>
            <Dashboard></Dashboard>
        </PrivateRoute>,
        children: [
            {
                index: true,
                element: <PrivateRoute allowedRoles={['admin', 'user', 'librarian']}>
                    <Stats></Stats>
                </PrivateRoute>,
            },
            {
                path: "manage-books",
                element: <PrivateRoute allowedRoles={['admin']}>
                    <ManageBooks></ManageBooks>
                </PrivateRoute>,
            },
            {
                path: 'stats',
                element: <PrivateRoute allowedRoles={['admin', 'user', 'librarian']}>
                    <Stats></Stats>
                </PrivateRoute>,
            },
            {
                path: "manage-users",
                element: <PrivateRoute allowedRoles={['admin']}>
                    <ManageUser></ManageUser>
                </PrivateRoute>,
            },
            {
                path: "add-book",
                element: <PrivateRoute allowedRoles={['librarian']}>
                    <AddBook></AddBook>
                </PrivateRoute>,
            },
            {
                path: "my-books",
                element: <PrivateRoute allowedRoles={['librarian']}>
                    <MyBooks></MyBooks>
                </PrivateRoute>,
            },
            {
                path: "orders",
                element: <PrivateRoute allowedRoles={['librarian']}>
                    <Orders></Orders>
                </PrivateRoute>,
            },
            //USER
            {
                path: "my-orders",
                element: <PrivateRoute >
                    <MyOrders></MyOrders>
                </PrivateRoute>,
            },
            {
                path: "payment-success",
                element: <PaymentSuccess></PaymentSuccess>
            },
            {
                path: "payment-cancel",
                element: <PaymentCancel></PaymentCancel>
            },
            {
                path: "my-invoices",
                element: <PrivateRoute >
                    <Invoices></Invoices>
                </PrivateRoute>,
            },
            {
                path: "my-wishlist",
                element: <PrivateRoute >
                    <MyWishlist></MyWishlist>
                </PrivateRoute>,
            },
            {
                path: "my-profile",
                element: <PrivateRoute>
                    <MyProfile></MyProfile>
                </PrivateRoute>,
            }
        ]
    },
    {
        path: "*",
        element: <ErrorPage></ErrorPage>
    }
]);

export default router;