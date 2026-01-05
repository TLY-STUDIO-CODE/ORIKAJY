import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

// Function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

// Function to set the token to localStorage
const setToken = (token) => localStorage.setItem('token', token);

// Function to remove the token from localStorage
const removeToken = () => localStorage.removeItem('token');

export const LoginUser = createAsyncThunk("user/loginUser", async(user, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:5000/login', {
            email: user.email, 
            password: user.password
        });
        // Store token in localStorage
        setToken(response.data.token);
        return response.data.user;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
        return thunkAPI.rejectWithValue("An error occurred");
    }
});

export const getMe = createAsyncThunk("user/getMe", async(_, thunkAPI) => {
    try {
        const response = await axios.get('http://localhost:5000/me', {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
        return thunkAPI.rejectWithValue("An error occurred");
    }
});

export const LogOut = createAsyncThunk("user/LogOut", async(_, thunkAPI) => {
    try {
        await axios.delete('http://localhost:5000/logout', {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        // Remove token from localStorage
        removeToken();
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
        return thunkAPI.rejectWithValue("An error occurred");
    }
});

export const authSlice = createSlice({
    name: "auth", 
    initialState,
    reducers:{
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(LoginUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(LoginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        });
        builder.addCase(LoginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });

        // Get User Login 
        builder.addCase(getMe.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getMe.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        });
        builder.addCase(getMe.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });

        // Log out
        builder.addCase(LogOut.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(LogOut.fulfilled, (state) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = null;
        });
        builder.addCase(LogOut.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
