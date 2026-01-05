import express from "express";
import { 
    getAccounts,
    getAccountById,
    createAccount,
    createBalance,
    updateAccount,
    deleteAccount
} from "../controllers/AccountController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/accounts', verifyUser, getAccounts);
router.get('/accounts/:id', verifyUser, getAccountById);
router.post('/accounts', verifyUser, createAccount);
router.post('/balances', createBalance);
router.patch('/accounts/:id', verifyUser, updateAccount);
router.delete('/accounts/:id', verifyUser, deleteAccount);

export default router;
