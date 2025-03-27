import { createBrowserRouter } from 'react-router-dom'
import { DefaultLayout } from '../Pages/Layouts/DefaultLayout'
import Login from '../Pages/Login'
import Register from '../Pages/Register'
import Dashboard from '../Pages/Dashboard'
import ProtectedRoute from '../utils/PrivateRoute'

export const router = createBrowserRouter([
    {
        element: <DefaultLayout />,
        children: [
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            },
        ],
    },


    {
        path: "/",
        element: <ProtectedRoute element={<Dashboard/>}/>
    }
])