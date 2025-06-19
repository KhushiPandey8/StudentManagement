// controllers/studentController.js
import db from "../utils/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch"; 

dotenv.config();

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
  const { username, password, captchaToken } = req.body;
  console.log("Login attempt from:", username);

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!captchaToken) {
    return res.status(400).json({ message: "CAPTCHA token missing." });
  }

  try {
    const params = new URLSearchParams();
    params.append("secret", RECAPTCHA_SECRET);
    params.append("response", captchaToken);

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      body: params
    });

    const data = await response.json();
    if (!data.success) {
      return res.status(401).json({ message: "CAPTCHA verification failed." });
    }
  } catch (err) {
    return res.status(500).json({ message: "CAPTCHA verification service error." });
  }

  try {
    const [rows] = await db.query(
      `SELECT id, username, password, contact, date12, name, branch, course, address, EmailId, status, name_contactid
       FROM student
       WHERE username = ? AND password = ?`,
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const user = rows[0];
    const token = jwt.sign({ id: user.id, name_contactid: user.name_contactid }, JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.json({ token, user });
  } catch (err) {
    return res.status(500).json({ message: "Login failed due to server error." });
  }
};

export const logout = (req, res) => {
  return res.status(200).json({ message: "Logged out successfully.", success: true });
};

export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden: Invalid token" });
    req.user = decoded;
    next();
  });
};

export const getBatch = async (req, res) => {
  const { name_contactid } = req.user;

  const sql = `SELECT DISTINCT s.subjectname, s.coursename AS course, COALESCE(fs2.status, 'Pending') AS status,
                  fs.batch_time, fs.faculty, fs.startdate, fs.endate
              FROM subject s
              JOIN faculty_student fs ON s.coursename COLLATE utf8mb4_unicode_ci = fs.course COLLATE utf8mb4_unicode_ci
                AND fs.nameid = ?
              LEFT JOIN faculty_student fs2 ON s.subjectname COLLATE utf8mb4_unicode_ci = fs2.subject COLLATE utf8mb4_unicode_ci
                AND fs2.nameid = ?
              WHERE s.coursename IS NOT NULL`;

  try {
    const [results] = await db.query(sql, [name_contactid, name_contactid]);
    res.json(results);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getBatchTimings = async (req, res) => {
  const { name_contactid } = req.user;
  if (!name_contactid) return res.status(400).json({ message: "User not authenticated" });

  const sql = "SELECT DISTINCT batchtime, Subject, course FROM attendence WHERE name = ?";
  try {
    const [results] = await db.query(sql, [name_contactid]);
    const batchTimings = results.map(row => row.batchtime);
    res.json(batchTimings);
  } catch (err) {
    return res.status(500).json({ message: "Database error" });
  }
};

export const getBatchTimetable = async (req, res) => {
  const { name_contactid } = req.user;
  if (!name_contactid) return res.status(400).json({ message: "User not authenticated" });

  const sql = `SELECT DISTINCT batch_time, faculty, course, subject, startdate, enddate FROM faculty_student WHERE nameid = ?`;
  try {
    const [results] = await db.query(sql, [name_contactid]);
    res.json(results);
  } catch (err) {
    return res.status(500).json({ message: "Database error" });
  }
};

export const getAttendance = async (req, res) => {
  const { batchtime, Subject } = req.query;
  const { name_contactid } = req.user;

  if (!batchtime || !name_contactid || !Subject) {
    return res.status(400).json({ message: "Missing batchtime, subject, or user info." });
  }

  const sql = `SELECT DISTINCT a.date, a.topic, a.attendence, a.Subject AS subject_name, a.batchtime, 
                fs.faculty, fs.startdate, fs.endate
              FROM attendence a
              JOIN faculty_student fs ON a.batchtime = fs.batch_time AND a.Subject = fs.subject
              WHERE a.batchtime = ? AND a.name = ? AND a.Subject = ?
              GROUP BY a.date, a.topic, a.attendence, a.Subject, a.batchtime, fs.faculty, fs.startdate, fs.endate;`;

  try {
    const [results] = await db.query(sql, [batchtime, name_contactid, Subject]);
    if (results.length === 0) {
      return res.status(404).json({ message: "No attendance records found." });
    }
    res.json(results);
  } catch (err) {
    return res.status(500).json({ message: "Database error" });
  }
};

export const getFeeDetails = async (req, res) => {
  const { name_contactid } = req.user;
  if (!name_contactid) return res.status(400).json({ message: "User not authenticated" });

  const sql = `SELECT DISTINCT Receipt, name, course, Recieve, Dates, ModeOfPayement, courseFees, Paid, Balance, status, totalfees, course FROM payement WHERE name_contactid = ?`;

  try {
    const [results] = await db.query(sql, [name_contactid]);
    res.json(results);
  } catch (err) {
    return res.status(500).json({ message: "Database error" });
  }
};

export const getCourse = async (req, res) => {
  const { name_contactid } = req.user;
  if (!name_contactid) return res.status(400).json({ message: "User not authenticated" });

  const sql = `SELECT DISTINCT s.subjectname, s.coursename AS course, COALESCE(fs2.status, 'Pending') AS status
              FROM subject s
              JOIN faculty_student fs ON s.coursename COLLATE utf8mb4_unicode_ci = fs.course COLLATE utf8mb4_unicode_ci AND fs.nameid = ?
              LEFT JOIN faculty_student fs2 ON s.subjectname COLLATE utf8mb4_unicode_ci = fs2.subject COLLATE utf8mb4_unicode_ci AND fs2.nameid = ?`;

  try {
    const [results] = await db.query(sql, [name_contactid, name_contactid]);
    res.json(results);
  } catch (err) {
    return res.status(500).json({ message: "Database error" });
  }
};

export const getMarks = async (req, res) => {
  const { name_contactid } = req.user;
  if (!name_contactid) return res.status(400).json({ message: "User not authenticated" });

  const courseQuery = `SELECT DISTINCT fs.course FROM faculty_student fs WHERE fs.nameid = ?`;
  const marksQuery = `SELECT fs.subject AS subjectname, fs.course, sm.subject AS sm_subject, sm.marks_outoff, DATE_FORMAT(sm.exam_date, '%d-%m-%Y') AS exam_date, sm.marks_obtain
                      FROM faculty_student fs
                      LEFT JOIN student_marks sm ON fs.subject COLLATE utf8mb4_unicode_ci = sm.subject COLLATE utf8mb4_unicode_ci AND sm.nameid = ?
                      WHERE fs.nameid = ?`;
  try {
    const [courseResults] = await db.query(courseQuery, [name_contactid]);
    const [marksResults] = await db.query(marksQuery, [name_contactid, name_contactid]);

    const courses = courseResults.map(row => row.course);
    const subjects = marksResults.map(row => ({
      subjectname: row.subjectname,
      course: row.course,
      status: row.sm_subject ? "Completed" : "Pending",
      exam_date: row.exam_date || null,
      marks_obtain: row.marks_obtain || null,
      marks_outoff: row.marks_outoff || null,
    }));

    res.json({ courses, subjects });
  } catch (err) {
    return res.status(500).json({ message: "Database error" });
  }
};

export const updateProfile = async (req, res) => {
  const { name, contact, course, address, branch, password, status, EmailId, username } = req.body;
  const { id } = req.user;

  let updateFields = [];
  let updateValues = [];

  if (name) { updateFields.push("name = ?"); updateValues.push(name); }
  if (contact) { updateFields.push("contact = ?"); updateValues.push(contact); }
  if (username) { updateFields.push("username = ?"); updateValues.push(username); }
  if (course) { updateFields.push("course = ?"); updateValues.push(course); }
  if (address) { updateFields.push("address = ?"); updateValues.push(address); }
  if (branch) { updateFields.push("branch = ?"); updateValues.push(branch); }
  if (password) { updateFields.push("password = ?"); updateValues.push(password); }
  if (status) { updateFields.push("status = ?"); updateValues.push(status); }
  if (EmailId) { updateFields.push("EmailId = ?"); updateValues.push(EmailId); }

  if (updateFields.length === 0) return res.status(400).json({ message: "No fields to update" });

  updateValues.push(id);
  const sql = `UPDATE student SET ${updateFields.join(", ")} WHERE id = ?`;

  try {
    await db.query(sql, updateValues);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Database update failed" });
  }
};
