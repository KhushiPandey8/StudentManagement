import express from "express";
import { login, getAttendance, authenticateJWT, logout, getBatchTimings } from "../controllers/student.Controllers.js";

const router = express.Router();

router.post("/login", login);
router.get("/attendance", authenticateJWT, getAttendance);
router.get("/batch-timings", authenticateJWT, getBatchTimings); // Ensure only authenticated users fetch batches
router.post("/logout", logout);

export default router;
