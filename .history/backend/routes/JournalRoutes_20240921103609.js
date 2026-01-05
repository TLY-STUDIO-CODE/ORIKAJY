import express from "express";
import { 
    getJournals,
    createJournal,
    updateJournal,
    deleteJournal,
    assignEntriesToJournal
} from "../controllers/JournalController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/journals', verifyUser, getJournals);
router.post('/journals', verifyUser, createJournal);
router.patch('/journals/:id', verifyUser, updateJournal);
router.delete('/journals/:id', verifyUser, deleteJournal);
router.post('/journals/assign-entries', verifyUser, assignEntriesToJournal);

export default router;
