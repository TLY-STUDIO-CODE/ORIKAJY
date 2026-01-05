import express from "express";
import { 
    getStocks,
    getStockById,
    createStock,
    updateStock,
    deleteStock,
    notifyStockLevel
} from "../controllers/Stocks.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/stocks', verifyUser, getStocks);
router.get('/stocks/notify', verifyUser,notifyStockLevel );
router.get('/stocks/:id', verifyUser, getStockById);
router.post('/stocks', verifyUser, createStock);
router.patch('/stocks/:id',verifyUser, updateStock);
router.delete('/stocks/:id', verifyUser, deleteStock);


export default router;