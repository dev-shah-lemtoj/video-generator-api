const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const configRoutes = require('./routes/configRoutes');
const layoutRoutes = require('./routes/layoutRoutes')
// Import the database connection function
const connectDB = require("./config/db");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());  // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies
app.use(flash());


// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Connect to MongoDB
connectDB();

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files (e.g. uploaded logos and favicons)
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
// Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/configRoutes');

app.use('/api/users', userRoutes);
app.use('/admin', configRoutes);
app.use('/api', layoutRoutes);
// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
