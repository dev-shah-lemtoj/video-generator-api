const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const cors = require("cors");
const MongoStore = require('connect-mongo');
require("dotenv").config();
const path = require("path");
const userRoutes = require('./routes/userRoutes');
const configRoutes = require('./routes/configRoutes');
const roleRoutes = require('./routes/roleRoutes');
const layoutRoutes = require('./routes/layoutRoutes')
const siteRoutes = require('./routes/siteRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
// Import the database connection function
const connectDB = require("./config/db");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins (for now)
app.use(express.json());  // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies
app.use(flash());


// Allow frontend on port 8000 to make requests
app.use(cors({
  origin: 'http://103.154.233.39:8000',
  credentials: true
}));

// Allow static files under /uploads to be fetched with CORS
app.use('/uploads', cors({
  origin: 'http://103.154.233.39:8000',
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


app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/admin', configRoutes);
app.use('/api', layoutRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/analytics', analyticsRoutes);
// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
