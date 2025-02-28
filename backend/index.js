import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import routes from './routes/routes.js';

dotenv.config();
const app = express();

// Middleware
app.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:5173"], // Allow both ports
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'))
// API Routes
app.use(routes);

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
