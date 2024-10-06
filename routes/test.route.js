import { shouldBeAdmin } from "../controllers/test.controller.js";

import express from "express";
import verifyToken from "../middlware/verifyToken.js";

const router = express.Router();

router.get("/should-be-admin", verifyToken, shouldBeAdmin);

export default router;