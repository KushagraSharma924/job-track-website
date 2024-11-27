const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/authroutes');
const jobRoutes = require('./routes/jobroutes');
const applicationRoutes = require('./routes/applicationroutes');

const app = express();
connectDB();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

module.exports = app;
