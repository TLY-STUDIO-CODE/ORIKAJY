import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    users: [], // Liste des utilisateurs connectés
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const LoginUser = createAsyncThunk("user/loginUser", async(user, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:5000/login', {
            email: user.email, 
            password: user.password
        });
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const getMe = createAsyncThunk("user/getMe", async(_, thunkAPI) => {
    try {
        const response = await axios.get('http://localhost:5000/me');
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const LogOut = createAsyncThunk("user/LogOut", async(userId, thunkAPI) => {
    try {
        await axios.delete('http://localhost:5000/logout');
        return userId;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const authSlice = createSlice({
    name: "auth", 
    initialState,
    reducers:{
        reset: (state) => initialState,
    },
    extraReducers:(builder) =>{
        // Login User
        builder.addCase(LoginUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(LoginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;

            // Ajouter l'utilisateur à la liste des utilisateurs connectés
            state.users.push(action.payload);
        });
        builder.addCase(LoginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });

        // Get User Login Info
        builder.addCase(getMe.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getMe.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;

            // Mettre à jour les informations de l'utilisateur dans la liste
            const existingUser = state.users.find(user => user.id === action.payload.id);
            if (existingUser) {
                Object.assign(existingUser, action.payload);
            } else {
                state.users.push(action.payload);
            }
        });
        builder.addCase(getMe.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });

        // Log Out User
        builder.addCase(LogOut.fulfilled, (state, action) => {
            // Supprimer l'utilisateur de la liste lors de la déconnexion
            state.users = state.users.filter(user => user.id !== action.payload);
        });
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
