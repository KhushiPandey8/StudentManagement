import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import routes from './routes/routes.js';
import path from "path";

const app = express();
dotenv.config();
const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:5173", // Update this to your frontend URL in production
  credentials: true,
};
app.use(cors(corsOptions));

app.use('/uploads', express.static('uploads'));

// API Routes
app.use("/api/v1/routes", routes);

// Serve React Frontend
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
