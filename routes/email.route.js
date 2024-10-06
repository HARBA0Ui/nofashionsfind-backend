import express from "express"
import { contactEmail, orderEmail } from "../controllers/email.controller.js";

const router= express.Router()

router.post("/order-email", orderEmail)
router.post("/contact-email", contactEmail)

export default router;