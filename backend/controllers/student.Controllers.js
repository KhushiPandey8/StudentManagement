import db from '../utils/db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';
// import upload from '../utils/multer.js'; // Separate multer configuration

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// Login endpoint
export const login = (req, res) => {
  const { contact, password } = req.body;

  if (!contact || !password) {
    return res.status(400).json({ message: "Contact number and password are required." });
  }

  const sql = "SELECT id, contact, password, date12,name, branch, course, photo, address, EmailId,status, name_contactid FROM student WHERE contact = ? and password = ?";

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
        photo: user.photo ? `${req.protocol}://${req.get("host")}${user.photo}` : null,
 // Using the raw value from the DB
        password: user.password,
        address: user.address,
        EmailId: user.EmailId,
        status: user.status,
        date12 : user.date12,

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



export const updateProfile = (req, res) => {
  const { name, contact, course, address, branch, password, status, EmailId } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null; // Store file path if a new photo is uploaded

  // Constructing the update query dynamically
  let updateFields = [];
  let updateValues = [];

  if (name) {
    updateFields.push("name = ?");
    updateValues.push(name);
  }
  if (contact) {
    updateFields.push("contact = ?");
    updateValues.push(contact);
  }
  if (course) {
    updateFields.push("course = ?");
    updateValues.push(course);
  }
  if (address) {
    updateFields.push("address = ?");
    updateValues.push(address);
  }
  if (branch) {
    updateFields.push("branch = ?");
    updateValues.push(branch);
  }
  if (password) {
    updateFields.push("password = ?");
    updateValues.push(password);
  }
  if (status) {
    updateFields.push("status = ?");
    updateValues.push(status);
  }
  if (EmailId) {
    updateFields.push("EmailId = ?");
    updateValues.push(EmailId);
  }
  if (photo) {
    updateFields.push("photo = ?");
    updateValues.push(photo);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  updateValues.push(req.user.id); // Add user ID for WHERE clause

  const sql = `UPDATE student SET ${updateFields.join(", ")} WHERE id = ?`;

  db.query(sql, updateValues, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database update failed" });
    }
    res.json({ message: "Profile updated successfully", photo });
  });
};



// Upload Notes
export const uploadNote = (req, res) => {
  const { title, description } = req.body;
  const file_path = req.file ? `/uploads/${req.file.filename}` : null;
  const user = req.user; // User details from authentication middleware

  if (!title || !req.file) {
    return res.status(400).json({ message: "Title and file are required." });
  }

  const sql = `INSERT INTO notes (title, description, file_path, user_id, name, contact, name_contactid)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [title, description, file_path, user.id, user.name, user.contact, user.name_contactid],
    (err, result) => {
      if (err) {
        console.error("Error uploading note:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({ message: "Note uploaded successfully", file_path });
    }
  );
};

// Get User Notes
export const getNotes = (req, res) => {
  const user_id = req.user.id;
  
  const sql = "SELECT * FROM notes WHERE user_id = ?";
  
  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching notes:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

// Download File
export const downloadFile = (req, res) => {
  const { file } = req.params;
  const filePath = `uploads/${file}`;
  
  res.download(filePath, (err) => {
    if (err) {
      console.error("File download error:", err);
      res.status(500).json({ message: "Error downloading file" });
    }
  });
};
