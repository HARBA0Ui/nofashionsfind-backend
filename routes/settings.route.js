import express from "express";
import {forgotPassword, resetPassword} from "../controllers/settings.controller.js"

const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id/:token", resetPassword);

export default router;