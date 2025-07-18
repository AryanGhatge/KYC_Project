require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const authRoutes = require("./routes/auth.routes");
const updateUserRoute = require("./routes/updateUser.routes");
// const panRoutes = require("./routes/pan.routes");
// const addressRoutes = require("./routes/address.routes");
// const bankRoutes = require("./routes/bank.routes");
// const dematRoutes = require("./routes/demat.routes");
// const profileRoutes = require("./routes/profile.routes");
const { isAuthenticated } = require("./middleware/auth.middleware");
const { cloudinaryConnect } = require("./config/cloudinaryConnect");

//external validation routes
const panValidationRoutes = require("./routes/validation/panValidation.routes");
const livelinessRoutes = require("./routes/validation/liveliness.route");
const bankValidationRoutes = require("./routes/validation/bankValidation.routes");
const ocrValidationRoutes = require("./routes/validation/ocrValidation.routes");
const userDetailsRoutes = require("./routes/user.route");

const db = require("./config/dbConnect");

const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

// Connect Database
db.dbConnect();
cloudinaryConnect();

// Port
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 24 }, // 1-day session expiry
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/v1/auth", authRoutes);
app.use("/v1/data", isAuthenticated, updateUserRoute);

//Internal Use Only
app.use("/v1/validation", panValidationRoutes);
app.use("/v1/ocrValidation", ocrValidationRoutes);
app.use("/v1/image", isAuthenticated, livelinessRoutes);
app.use("/v1/bankValidation", bankValidationRoutes);
app.use("/v1/user", userDetailsRoutes);

// app.use("/v1/pan", isAuthenticated, panRoutes);
// app.use("/v1/address", isAuthenticated, addressRoutes);
// app.use("/v1/bank", isAuthenticated, bankRoutes);
// app.use("/v1/demat", isAuthenticated, dematRoutes);
// app.use("/v1/profile", isAuthenticated, profileRoutes);

// Protected Route Example (for checking user is authorized)
app.get("/v1/protected", isAuthenticated, (req, res) => {
  res.json({ message: "You are authorized!", user: req.user });
});

// Start Server
// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler caught:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
