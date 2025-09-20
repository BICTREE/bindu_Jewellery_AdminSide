import { useSelector } from 'react-redux';
import { Navigate, Outlet, } from 'react-router-dom';


const AuthGuard = () => {
    const user = useSelector((state) => state.auth.userInfo)

    return (
        user?.role === "admin"
            ? <Navigate to="/admin/dashboard" replace />
            : <Outlet />
    )
}

export default AuthGuard