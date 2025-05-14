import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NotFound = () => {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="text-center max-w-md p-8 bg-white dark:bg-surface-800 rounded-lg shadow-lg">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-surface-800 dark:text-surface-100 mb-4">Page Not Found</h2>
        <p className="mb-6 text-surface-600 dark:text-surface-400">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to={isAuthenticated ? '/dashboard' : '/login'} 
          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors inline-block"
        >
          {isAuthenticated ? 'Back to Dashboard' : 'Back to Login'}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;