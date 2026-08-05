
import { Navigate, Outlet } from "react-router-dom"

const ProtectedPage = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <Navigate to='/login' replace />
    } else {
        return <Outlet />
    }
}

export default ProtectedPage