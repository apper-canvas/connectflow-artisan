import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { loginUser } from '../features/auth/authSlice';
import AuthLayout from '../components/AuthLayout';
import getIcon from '../utils/iconUtils';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const EyeIcon = getIcon('Eye');
  const EyeOffIcon = getIcon('EyeOff');
  
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    // If already authenticated, redirect to homepage
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const resultAction = await dispatch(loginUser(formData));
      
      if (loginUser.fulfilled.match(resultAction)) {
        toast.success('Login successful!');
        navigate(from, { replace: true });
      }
    }
  };
  
  return (
    <AuthLayout title="Welcome back!" subtitle="Log in to your ConnectFlow account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Email address</label>
          <input id="email" name="email" type="email" className={`input-field ${errors.email ? 'border-red-500 dark:border-red-500' : ''}`} onChange={handleChange} value={formData.email} />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Password</label>
          <div className="relative">
            <input id="password" name="password" type={showPassword ? 'text' : 'password'} className={`input-field pr-10 ${errors.password ? 'border-red-500 dark:border-red-500' : ''}`} onChange={handleChange} value={formData.password} />
            <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-500" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
        </div>
        
        <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn-primary w-full py-2.5" disabled={loading}>{loading ? 'Logging in...' : 'Log In'}</motion.button>
      </form>
      
      <p className="mt-4 text-sm text-center text-surface-600 dark:text-surface-400">Don't have an account? <Link to="/register" className="text-primary hover:text-primary-dark font-medium">Register now</Link></p>
      
      <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
        <p className="text-xs text-center text-surface-500">Demo credentials: admin@example.com / password</p>
      </div>
    </AuthLayout>
  );
};

export default Login;