import db from "../utils/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import multer from "multer";
import { log } from "console";
import { query } from "express";

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// Login endpoint
export const login = (req, res) => {
  const { contact, password } = req.body;

  if (!contact || !password) {
    return res
      .status(400)
      .json({ message: "Contact number and password are required." });
  }

  const sql =
    "SELECT id, contact, password, date12,name, branch, course, photo, address, EmailId,status, name_contactid FROM student WHERE contact = ? and password = ?";

  db.query(sql, [contact, password], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid Username or Password" });
    }

    const user = result[0];
    const token = jwt.sign(
      { id: user.id, name_contactid: user.name_contactid },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        contact: user.contact,
        name: user.name,
        name_contactid: user.name_contactid,
        branch: user.branch,
        course: user.course,
        photo: user.photo
          ? `${req.protocol}://${req.get("host")}${user.photo}`
          : null,
        // Using the raw value from the DB
        password: user.password,
        address: user.address,
        EmailId: user.EmailId,
        status: user.status,
        date12: user.date12,
      },
    });
  });
};

// Logout endpoint
export const logout = (req, res) => {
  return res.status(200).json({
    message: "Logged out successfully.",
    success: true,
  });
};

// JWT authentication middleware
export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
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
export const getBatch = (req, res) => { 
  const {name_contactid} = req.user; // Extracted from token

  const sql = `
    SELECT 
      s.subjectname, 
      s.coursename AS course, 
      COALESCE(fs2.status, 'Pending') AS status,
      fs.batch_time,
      fs.faculty,
      fs.startdate,
      fs.endate
    FROM 
      subject s
    JOIN 
      faculty_student fs 
      ON s.coursename COLLATE utf8mb4_unicode_ci = fs.course COLLATE utf8mb4_unicode_ci
      AND fs.nameid = ?
    LEFT JOIN 
      faculty_student fs2 
      ON s.subjectname COLLATE utf8mb4_unicode_ci = fs2.subject COLLATE utf8mb4_unicode_ci
      AND fs2.nameid = ?
    WHERE 
      s.coursename IS NOT NULL
  `;

  db.query(sql, [name_contactid, name_contactid], (err, results) => {
    if (err) {
      console.error("Error fetching course details:", err);
      return res.status(500).send("Server error");
    }
    console.log("Fetched Data:", results);
    res.json(results);
  });
};


export const getFilteredBatchTimings = (req, res) => {
  // const { status } = req.query;
  // const { name_contactid } = req.user;
  // // console.log("Received Name ID:", name_contactid);
  // // console.log("Received Status:", status);
  // if (!name_contactid) {
  //     return res.status(400).json({ message: "User not authenticated" });
  // }
  // let query = "";
  // if (status === "Pending") {
  //     query = `
  //         SELECT DISTINCT course, subject
  //         FROM faculty_student
  //         WHERE nameid = ? AND status = 'Pending';
  //     `;
  // } else if (status === "Pursuing") {
  //     query = `
  //         SELECT   batch_time, faculty, course, subject, startdate, endate
  //         FROM faculty_student
  //         WHERE nameid = ? AND status = 'Pursuing';
  //     `;
  // } else if (status === "Completed") {
  //     query = `
  //         SELECT DISTINCT batch_time, faculty, course, subject, startdate, endate
  //         FROM faculty_student
  //         WHERE nameid = ? AND status = 'Completed';
  //     `;
  // } else {
  //     return res.status(400).json({ message: "Invalid status" });
  // }
  // db.query(query, [name_contactid], (err, results) => {
  //     if (err) {
  //         console.error("Error fetching filtered batch timings:", err);
  //         return res.status(500).json({ message: "Database error" });
  //     }
  //     res.json(results);
  // });
};

// Get Batch Timings
export const getBatchTimings = (req, res) => {
  const { name_contactid } = req.user; // Get logged-in student details

  if (!name_contactid) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  const query =
    "SELECT DISTINCT batchtime, Subject, course FROM attendence WHERE name = ?";
  db.query(query, [name_contactid], (err, results) => {
    if (err) {
      console.error("Error fetching batch timings:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const batchTimings = results.map((row) => row.batchtime);
    res.json(batchTimings);
  });
};

export const getBatchTimetable = (req, res) => {
  if (!req.user || !req.user.name_contactid) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  const { name_contactid } = req.user;

  const query = `SELECT DISTINCT batch_time, faculty, course, subject, startdate, enddate 
                 FROM faculty_student WHERE nameid = ?`;

  db.query(query, [name_contactid], (err, results) => {
    if (err) {
      console.error("Error fetching batch timings:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

export const getAttendance = (req, res) => {
  const { batchtime, Subject } = req.query;
  const { name_contactid } = req.user; // Ensure logged-in user

  if (!batchtime || !name_contactid || !Subject) {
    return res.status(400).json({ message: "Missing batchtime, subject, or user info." });
  }

  console.log("Received:", { name_contactid, batchtime, Subject });

  const query = `
    SELECT 
      a.date, 
      a.topic, 
      a.attendence, 
      a.Subject AS subject_name, 
      a.batchtime, 
      fs.faculty, 
      fs.startdate, 
      fs.endate 
    FROM attendence a
    JOIN faculty_student fs 
      ON a.batchtime = fs.batch_time 
      AND a.Subject = fs.subject
    WHERE a.batchtime = ? 
      AND a.name = ? 
      AND a.Subject = ?;
  `;

  console.log("Executing Query:", query);
  console.log("Query Parameters:", [batchtime, name_contactid, Subject]); 

  db.query(query, [batchtime, name_contactid, Subject], (err, results) => {
    if (err) {
      console.error("Error fetching attendance:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      console.log("No attendance records found.");
      return res.status(404).json({ message: "No attendance records found." });
    }

    console.log("Query Results:", JSON.stringify(results, null, 2));
    res.json(results);
  });
};


// API route


// // Get Attendance
// export const getAttendance = (req, res) => {
//   const { batchtime } = req.query;
//   const { name_contactid } = req.user; // ensure logged-in user

//   if (!batchtime || !name_contactid) {
//     return res.status(400).json({ message: "Missing batchtime or user info." });
//   }

//   const query = "SELECT date, topic, attendence, Subject FROM attendence WHERE batchtime = ? AND name = ?";
//   console.log("Executing Query with Parameters:", name_contactid, batchtime);
//   console.log("SQL Query:", query);


//   db.query(query, [batchtime, name_contactid], (err, results) => {
//     if (err) {
//       console.error("Error fetching attendance:", err);
//       return res.status(500).json({ message: "Database error" });
//     }
//     res.json(results);
//   });
// };

// Get Fee Details
export const getFeeDetails = (req, res) => {
  const { name_contactid } = req.user; // Get authenticated user

  if (!name_contactid) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  const query = `
    SELECT 
      Receipt, name, course, Recieve, Dates, ModeOfPayement, 
      courseFees, Paid, Balance, status, totalfees, course
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

// export const getCourse = (req, res) => {
//   const { name_contactid } = req.user;
//   if (!name_contactid) {
//     return res.status(400).json({ message: "User not authenticated" });
//   }
//   const query = `
//     SELECT DISTINCT course, status FROM faculty_student WHERE nameid = ?`;

//   db.query(query, [name_contactid], (err, results) => {
//     if (err) {
//       console.error("Error fetching course details:", err);
//       return res.status(500).json({ message: "Database error" });
//     }
//     res.json(results);
//   });
// }
export const getCourse = (req, res) => {
  const { name_contactid } = req.user;
  if (!name_contactid) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  const query = `
    SELECT 
        s.subjectname, 
        s.coursename AS course, 
        COALESCE(fs2.status, 'Pending') AS status
    FROM subject s
    JOIN faculty_student fs 
        ON s.coursename COLLATE utf8mb4_unicode_ci = fs.course COLLATE utf8mb4_unicode_ci
        AND fs.nameid = ?
    LEFT JOIN faculty_student fs2 
        ON s.subjectname COLLATE utf8mb4_unicode_ci = fs2.subject COLLATE utf8mb4_unicode_ci
        AND fs2.nameid = ?
  `;

  db.query(query, [name_contactid, name_contactid], (err, results) => {
    if (err) {
      console.error("Error fetching course details:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

export const updateProfile = (req, res) => {
  const { name, contact, course, address, branch, password, status, EmailId } =
    req.body;
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

export const uploadNote = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File upload failed" });
  }

  const { title, description } = req.body;
  const filePath = req.file.filename;
  const { name_contactid } = req.user; // Get authenticated user
  const query =
    "INSERT INTO notes (title, description, file_path ,name_contactid) VALUES (?, ?, ?, ?)";
  db.query(
    query,
    [title, description, filePath, name_contactid],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({ message: "Note uploaded successfully" });
    }
  );
};

// Get all notes
export const getNotes = (req, res) => {
  db.query("SELECT * FROM notes", (err, results) => {
    if (err) {
      console.error("Error fetching notes:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

export const deleteNote = (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No user found in request" });
  }

  const { id } = req.params;
  const { name_contactid } = req.user; // Ensure user owns the note

  console.log(`Deleting note with ID: ${id}`); // Debugging log

  if (!id) {
    return res.status(400).json({ message: "Note ID is required" });
  }

  const query = "DELETE FROM notes WHERE id = ? AND name_contactid = ?";
  db.query(query, [id, name_contactid], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Note not found or unauthorized" });
    }
    res.json({ message: "Note deleted successfully" });
  });
};
