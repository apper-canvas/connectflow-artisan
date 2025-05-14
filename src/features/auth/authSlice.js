import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock API functions (replace with actual API calls in production)
const mockLoginAPI = async (credentials) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock validation
  if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
    return { 
      id: '1', 
      email: 'admin@example.com', 
      firstName: 'John', 
      lastName: 'Doe',
      role: 'Sales Manager'
    };
  }
  
  throw new Error('Invalid credentials');
};

const mockRegisterAPI = async (userData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check if email exists (mock)
  if (userData.email === 'admin@example.com') {
    throw new Error('User already exists');
  }
  
  // Return created user
  return {
    id: '2',
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: 'User'
  };
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const user = await mockLoginAPI(credentials);
      // Store token in localStorage for persistence
      localStorage.setItem('userToken', 'mock-jwt-token');
      localStorage.setItem('userInfo', JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const user = await mockRegisterAPI(userData);
      // Store token in localStorage
      localStorage.setItem('userToken', 'mock-jwt-token');
      localStorage.setItem('userInfo', JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('userInfo')) || null,
  token: localStorage.getItem('userToken') || null,
  isAuthenticated: !!localStorage.getItem('userToken'),
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfo');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = 'mock-jwt-token';
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = 'mock-jwt-token';
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;