import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { registerUser } from '../features/auth/authSlice';
import AuthLayout from '../components/AuthLayout';
import getIcon from '../utils/iconUtils';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const EyeIcon = getIcon('Eye');
  const EyeOffIcon = getIcon('EyeOff');
  
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    // If already authenticated, redirect to homepage
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
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
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const resultAction = await dispatch(registerUser(formData));
      
      if (registerUser.fulfilled.match(resultAction)) {
        toast.success('Registration successful!');
        navigate('/');
      }
    }
  };
  
  return (
    <AuthLayout title="Create an account" subtitle="Join ConnectFlow to manage your customer relationships">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">First name</label>
            <input id="firstName" name="firstName" type="text" className={`input-field ${errors.firstName ? 'border-red-500 dark:border-red-500' : ''}`} onChange={handleChange} value={formData.firstName} />
            {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Last name</label>
            <input id="lastName" name="lastName" type="text" className={`input-field ${errors.lastName ? 'border-red-500 dark:border-red-500' : ''}`} onChange={handleChange} value={formData.lastName} />
            {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
          </div>
        </div>
        
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
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Confirm password</label>
          <input id="confirmPassword" name="confirmPassword" type={showPassword ? 'text' : 'password'} className={`input-field ${errors.confirmPassword ? 'border-red-500 dark:border-red-500' : ''}`} onChange={handleChange} value={formData.confirmPassword} />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>
        
        <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn-primary w-full py-2.5" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</motion.button>
      </form>
      
      <p className="mt-4 text-sm text-center text-surface-600 dark:text-surface-400">Already have an account? <Link to="/login" className="text-primary hover:text-primary-dark font-medium">Log in</Link></p>
    </AuthLayout>
  );
};

export default Register;