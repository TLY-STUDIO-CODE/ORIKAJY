// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    status: "offline" // Ajout de l'état de statut
};

// Thunk pour la connexion de l'utilisateur
export const LoginUser = createAsyncThunk("user/loginUser", async (user, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:5000/login', {
            email: user.email, 
            password: user.password
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

// Thunk pour obtenir les informations de l'utilisateur connecté
export const getMe = createAsyncThunk("user/getMe", async (_, thunkAPI) => {
    try {
        const response = await axios.get('http://localhost:5000/me');
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

// Thunk pour déconnecter l'utilisateur
export const LogOut = createAsyncThunk("user/LogOut", async () => {
    await axios.delete('http://localhost:5000/logout');
});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        // Cas pour la connexion de l'utilisateur
        builder.addCase(LoginUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(LoginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
            state.status = "connected"; // Met à jour le statut après la connexion
        });
        builder.addCase(LoginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });

        // Cas pour obtenir les informations de l'utilisateur
        builder.addCase(getMe.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getMe.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
            state.status = "connected"; // Assurez-vous que le statut est également mis à jour
        });
        builder.addCase(getMe.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });

        // Cas pour la déconnexion de l'utilisateur
        builder.addCase(LogOut.fulfilled, (state) => {
            state.isSuccess = false;
            state.user = null;
            state.status = "offline"; // Met à jour le statut lors de la déconnexion
        });
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
