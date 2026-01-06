import express from "express";
import { 
    getAccountingEntries,
    getAccountingEntryById,
    createAccountingEntry,
    updateAccountingEntry,
    deleteAccountingEntry,
    validateAccountingEntry
} from "../controllers/AccountingEntryController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/accounting-entries', verifyUser, getAccountingEntries);
router.get('/accounting-entries/:id', verifyUser, getAccountingEntryById);
router.post('/accounting-entries', verifyUser, createAccountingEntry);
router.patch('/accounting-entries/:id', verifyUser, updateAccountingEntry);
router.delete('/accounting-entries/:id', verifyUser, deleteAccountingEntry);
router.patch('/accounting-entries/validate/:id', verifyUser, validateAccountingEntry);

export default router;
