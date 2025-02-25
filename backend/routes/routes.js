import express from 'express';
import { login, getAttendance, authenticateJWT,  logout } from '../controllers/student.Controllers.js';

const router = express.Router();

router.post('/login', login);
router.get('/attendance', authenticateJWT, getAttendance); 
// router.post('/upload-profile-pic', upload, updateProfilePicture);  
router.post('/logout', logout);  // Add this line

export default router;
