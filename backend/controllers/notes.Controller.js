import db from '../utils/db.js';
import multer from 'multer';
import path from 'path';

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload Notes
export const uploadNote = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File upload failed" });
  }

  const { title, description } = req.body;
  const filePath = req.file.filename;

  const query = "INSERT INTO notes (title, description, file_path) VALUES (?, ?, ?)";
  db.query(query, [title, description, filePath], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(201).json({ message: "Note uploaded successfully" });
  });
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
