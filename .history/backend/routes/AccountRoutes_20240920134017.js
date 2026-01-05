import express from "express";
import { 
    getAccounts,
    createAccount,
    updateAccount,
    deleteAccount
} from "../controllers/AccountController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/accounts', verifyUser, getAccounts);
router.post('/accounts', verifyUser, createAccount);
router.patch('/accounts/:id', verifyUser, updateAccount);
router.delete('/accounts/:id', verifyUser, deleteAccount);

export default router;
