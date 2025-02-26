const express = require("express");
const app = express();
const db = require("./config/dbConnect");
const cors = require("cors");
require("dotenv").config();
const passport = require("passport");
const session = require("express-session");
const authRoutes = require("./routes/auth.routes");
const panRoutes = require("./routes/pan.routes");
const addressRoutes = require("./routes/address.routes");
const bankRoutes = require("./routes/bank.routes");
const dematRoutes = require("./routes/demat.routes");
const profileRoutes = require("./routes/profile.routes");
require("./config/passport"); 

// Port
const PORT = process.env.PORT || 8080;

// DB Connection
db.dbConnect();

// Middleware
app.use(express.json());
app.use(cors({
  // origin: "http://localhost:5173",
  // credentials: true,
}));
app.use(session({
  secret: process.env.SESSION_SECRET || "secret_key",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/v1/auth", authRoutes);
app.use("/v1/pan", passport.authenticate("jwt", { session: false }), panRoutes);
app.use("/v1/address", passport.authenticate("jwt", { session: false }), addressRoutes);
app.use("/v1/bank", passport.authenticate("jwt", { session: false }), bankRoutes);
app.use("/v1/demat", passport.authenticate("jwt", { session: false }), dematRoutes);
app.use("/v1/profile", passport.authenticate("jwt", { session: false }), profileRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
