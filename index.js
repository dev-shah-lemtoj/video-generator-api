const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const cors = require("cors");
const MongoStore = require('connect-mongo');
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


// Allow frontend on port 8000 to make requests
app.use(cors({
  origin: 'http://localhost:8000',
  credentials: true
}));

// Allow static files under /uploads to be fetched with CORS
app.use('/uploads', cors({
  origin: 'http://localhost:8000',
  credentials: true
}), express.static('uploads'));


// Session Middleware
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
// }));


app.use(session({
  secret: process.env.SESSION_SECRET || 'nodedemo', // use env if possible
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60 // 1 day (optional but good to be explicit)
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'lax', // prevents CSRF but allows normal cookies in frontend/backend dev
    secure: process.env.NODE_ENV === 'production' // only true on HTTPS
  }
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
