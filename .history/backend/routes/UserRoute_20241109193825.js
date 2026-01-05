import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    countUsers
} from "../controllers/Users.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/users', adminOnly, getUsers);
router.get('/users/count',  adminOnly, countUsers);
router.get('/users/:id', adminOnly, getUserById);
router.post('/users',  adminOnly, createUser);
router.patch('/users/:id',  adminOnly, updateUser);
router.delete('/users/:id', adminOnly, deleteUser);

export default router;