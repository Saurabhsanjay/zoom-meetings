// Load environment variables from .env file
require("dotenv").config();

// Connect to database
require("./config/dbConnection");

// Import required modules and routers
const express = require("express");
const cors = require("cors");
const meetingRoutes =require('./routes/meetingRoutes')

// Create express app
const app = express();

// Enable cors
app.use(cors());

// Enable JSON parsing of request body
app.use(express.json());

// Enable parsing of url encoded request body
app.use(express.urlencoded({ extended: true }));


// using the routes in serverjs
app.use('/api',meetingRoutes)


// Error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});

// Start listening on port 
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
