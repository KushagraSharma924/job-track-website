const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const cors = require("cors");
const rateLimit = require('express-rate-limit');  // Import the rate limiter
const helmet = require('helmet');

const authRoutes = require('./routes/authroutes');
const jobRoutes = require('./routes/jobroutes');
const applicationRoutes = require('./routes/applicationroutes');

const app = express();
connectDB();

// Apply CORS
app.use(cors({
  origin: 'http://localhost:5173',  // React frontend URL
  methods: ['GET', 'POST'],
}));

//rate
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  message: "Too many requests from this IP, please try again later",
});

app.use(limiter); 
app.use(helmet())

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);


app.use('/uploads', express.static('uploads'));

module.exports = app;
