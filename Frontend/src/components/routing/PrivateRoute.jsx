import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
            <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
