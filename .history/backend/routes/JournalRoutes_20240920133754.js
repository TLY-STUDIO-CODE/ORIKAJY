import express from "express";
import { 
    getJournals,
    createJournal,
    assignEntriesToJournal
} from "../controllers/JournalController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/journals', verifyUser, getJournals);
router.post('/journals', verifyUser, createJournal);
router.post('/journals/assign-entries', verifyUser, assignEntriesToJournal);

export default router;
