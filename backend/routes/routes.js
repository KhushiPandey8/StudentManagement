import express from "express";
import { login, getAttendance, authenticateJWT, logout, getBatchTimings,getBatch, getFeeDetails,updateProfile,deleteNote,getBatchTimetable,getCourse,getFilteredBatchTimings, getMarks} from "../controllers/student.Controllers.js";
import { getNotes,uploadNote} from "../controllers/student.Controllers.js";
import upload from '../utils/multer.js';
const router = express.Router();

router.post("/login", login);
router.get("/attendance", authenticateJWT, getAttendance);
router.get("/batch-timings", authenticateJWT, getBatchTimings); // Ensure only authenticated users fetch batches
router.get("/get-batch", authenticateJWT, getBatch);
router.get("/get-timings", authenticateJWT, getBatchTimetable);
router.get("/get-courses", authenticateJWT, getFilteredBatchTimings);
router.get("/get-marks", authenticateJWT, getMarks);
router.post("/logout", logout);
router.get("/fee-details", authenticateJWT, getFeeDetails);
router.get("/course-details", authenticateJWT, getCourse);
router.post('/update-profile', authenticateJWT, upload.single('photo'), updateProfile)
router.post("/notes/upload",authenticateJWT, upload.single("file"), uploadNote);
router.get("/notes/list", getNotes);
router.delete("/notes/delete/:id", authenticateJWT, deleteNote)



export default router;
