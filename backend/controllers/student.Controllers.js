import db from '../utils/db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import upload from '../utils/multer.js'; // Separate multer configuration

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// Login endpoint
export const login = (req, res) => {
  const { contact, password } = req.body;

  if (!contact || !password) {
    return res.status(400).json({ message: "Contact number and password are required." });
  }

  const sql = "SELECT id, contact, password, name, branch, course, photo, name_contactid FROM student WHERE contact = ? and password = ?";

  db.query(sql, [contact, password], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid Username or Password" });
    }

    const user = result[0];
    const token = jwt.sign({ id: user.id, name_contactid: user.name_contactid }, SECRET_KEY, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user.id,
        contact: user.contact,
        name: user.name,
        name_contactid: user.name_contactid,
        branch: user.branch,
        course: user.course,
        photo: user.photo, // Using the raw value from the DB
        password: user.password,
      }
    });
  });
};

// Logout endpoint
export const logout = (req, res) => {
  return res.status(200).json({
    message: 'Logged out successfully.',
    success: true
  });
};

// JWT authentication middleware
export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

// Get Batch Timings
export const getBatchTimings = (req, res) => {
  const { name_contactid } = req.user; // Get logged-in student details

  if (!name_contactid) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  const query = "SELECT DISTINCT batchtime FROM attendence WHERE name = ?";
  db.query(query, [name_contactid], (err, results) => {
    if (err) {
      console.error("Error fetching batch timings:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const batchTimings = results.map((row) => row.batchtime);
    res.json(batchTimings);
  });
};

// Get Attendance
export const getAttendance = (req, res) => {
  const { batchtime } = req.query;
  const { name_contactid } = req.user; // Ensure logged-in user

  if (!batchtime || !name_contactid) {
    return res.status(400).json({ message: "Missing batchtime or user info." });
  }

  const query = "SELECT date, topic, attendence FROM attendence WHERE batchtime = ? AND name = ?";
  db.query(query, [batchtime, name_contactid], (err, results) => {
    if (err) {
      console.error("Error fetching attendance:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

// Get Fee Details
export const getFeeDetails = (req, res) => {
  const { name_contactid } = req.user;  // Get authenticated user

  if (!name_contactid) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  const query = `
    SELECT 
      Receipt, name, course, Recieve, Dates, ModeOfPayement, 
      courseFees, Paid, Balance, status, totalfees, courseFees 
    FROM payement 
    WHERE name_contactid = ?`;

  db.query(query, [name_contactid], (err, results) => {
    if (err) {
      console.error("Error fetching fee details:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

// Update Profile (using name_contactid for record lookup)
// If a new password is provided (non-empty), update it; otherwise, leave it unchanged.
export const updateProfile = (req, res) => {
  const { name_contactid } = req.user;
  const { name, contact, course, address, branch, password } = req.body;
  // Use new file if provided, otherwise fallback to the existing photo value
  const photo = req.file ? `/uploads/${req.file.filename}` : req.body.photo;

  if (!name_contactid) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  let sql, params;
  if (password && password.trim() !== "") {
    sql = `
      UPDATE student 
      SET name=?, contact=?, course=?, address=?, branch=?, photo=?, password=?
      WHERE name_contactid = ?`;
    params = [name, contact, course, address, branch, photo, password, name_contactid];
  } else {
    sql = `
      UPDATE student 
      SET name=?, contact=?, course=?, address=?, branch=?, photo=?
      WHERE name_contactid = ?`;
    params = [name, contact, course, address, branch, photo, name_contactid];
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database update failed" });
    }
    res.json({ message: "Profile updated successfully", photo });
  });
};
