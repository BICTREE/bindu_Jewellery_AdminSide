import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';


const AdminGuard = () => {
  const user = useSelector((state) => state.auth.userInfo)

  return (
    user?.role === "admin" ? <Outlet /> : <Navigate to='/login' replace />
  )
}

export default AdminGuard