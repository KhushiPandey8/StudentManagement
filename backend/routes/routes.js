import express from "express";
import { login, getAttendance, authenticateJWT, logout, getBatchTimings,getFeeDetails,updateProfile,uploadNote, getNotes, downloadFile } from "../controllers/student.Controllers.js";
import upload from '../utils/multer.js';
const router = express.Router();

router.post("/login", login);
router.get("/attendance", authenticateJWT, getAttendance);
router.get("/batch-timings", authenticateJWT, getBatchTimings); // Ensure only authenticated users fetch batches
router.post("/logout", logout);
router.get("/fee-details", authenticateJWT, getFeeDetails);
router.post('/update-profile', authenticateJWT, upload.single('photo'), updateProfile)
router.post("/upload", authenticateJWT, upload.single("file"), uploadNote);
router.get("/list", authenticateJWT, getNotes);
router.get("/download/:file", downloadFile);

export default router;
