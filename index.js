const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const cors = require("cors");
require("dotenv").config();

// Import the database connection function
const connectDB = require("./config/db");

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());  // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies
app.use(flash());

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,  // Make sure this is set in your .env file
    resave: false,
    saveUninitialized: true,
}));
// Connect to MongoDB
connectDB();  // Call the database connection function

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
