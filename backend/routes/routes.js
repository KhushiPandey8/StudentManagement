import express from "express";
import { login, getAttendance, authenticateJWT, logout, getBatchTimings,getFeeDetails,updateProfile } from "../controllers/student.Controllers.js";
import upload from '../utils/multer.js';
const router = express.Router();

router.post("/login", login);
router.get("/attendance", authenticateJWT, getAttendance);
router.get("/batch-timings", authenticateJWT, getBatchTimings); // Ensure only authenticated users fetch batches
router.post("/logout", logout);
router.get("/fee-details", authenticateJWT, getFeeDetails);
router.post("/update-profile", authenticateJWT, upload.single("photo"), updateProfile);
export default router;
