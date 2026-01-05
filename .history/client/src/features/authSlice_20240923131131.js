import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
user: null,
token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
isAuthenticated: false,
loading: false,
error: null,
};

// Thunk for login
export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
try {
const response = await axios.post('/api/login', credentials);  // Adjust the endpoint based on your API
const { token, user } = response.data;

// Store the token in localStorage
localStorage.setItem('token', token);

return { token, user };
} catch (error) {
return thunkAPI.rejectWithValue(error.response.data);
}
});

// Thunk for logout
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
// Remove the token from localStorage
localStorage.removeItem('token');
return null;
});

// The auth slice
const authSlice = createSlice({
name: 'auth',
initialState,
reducers: {
// Additional reducers if necessary
},
extraReducers: (builder) => {
builder
    .addCase(login.pending, (state) => {
    state.loading = true;
    state.error = null;
    })
    .addCase(login.fulfilled, (state, action) => {
    state.loading = false;
    state.token = action.payload.token;
    state.user = action.payload.user;
    state.isAuthenticated = true;
    })
    .addCase(login.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
    })
    .addCase(logout.fulfilled, (state) => {
    state.token = null;
    state.user = null;
    state.isAuthenticated = false;
    });
},
});

export default authSlice.reducer;
