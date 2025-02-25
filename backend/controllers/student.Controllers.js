import db from '../utils/db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export const login = (req, res) => {
    const { contact, password } = req.body;

    if (!contact || !password) {
        return res.status(400).json({ message: "Contact number and password are required." });
    }

    const sql = "SELECT id, contact, password, name, branch, course, photo, name_contactid FROM student WHERE contact = ?";
    
    db.query(sql, [contact], (err, result) => {
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
                photo: user.photo,
            }
        });
    });
};

export const logout = (req, res) => {
    return res.status(200).json({
        message: 'Logged out successfully.',
        success: true
    });
};

export const updateProfilePicture = (req, res) => {
    console.log("Received request to update profile:", req.body);
    console.log("Uploaded file:", req.file);

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded!" });
    }

    const { contact } = req.body;
    const profilePicPath = req.file.path.replace(/\\/g, "/");

    if (!contact) {
        return res.status(400).json({ message: "Contact is required." });
    }

    const sql = "UPDATE student SET photo = ? WHERE contact = ?";

    db.query(sql, [profilePicPath, contact], (err, result) => {
        if (err) {
            console.error("Error updating profile picture:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json({ 
            message: "Profile picture updated successfully", 
            photo: `http://localhost:3001/${profilePicPath}`
        });
    });
};


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