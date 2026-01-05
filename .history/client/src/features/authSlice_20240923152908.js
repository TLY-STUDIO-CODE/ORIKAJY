import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Create async thunks for login and logout
export const LoginUser = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await axios.post('http://localhost:5000/auth/login', userData, { withCredentials: true });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg || error.message);
  }
});

export const LogoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
    return;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg || error.message);
  }
});

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(LogoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LogoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;
      })
      .addCase(LogoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
