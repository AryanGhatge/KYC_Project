const express = require("express");
const app = express();

const db = require("./config/dbConnect");
const cors = require("cors");
require("dotenv").config();
const panRoutes = require("./routes/pan.routes");
const addressRoutes = require("./routes/address.routes");
const bankRoutes = require("./routes/bank.routes");
const dematRoutes = require("./routes/demat.routes");
const profileRoutes = require("./routes/profile.routes");

//port
const PORT = process.env.PORT || 8080;

//Db Connection
db.dbConnect();

//middlewares
app.use(express.json());
app.use(
  cors({
    // origin: "http://localhost:5173",
    // credentials: true,
  })
);

//routes
app.use("/v1/pan", panRoutes);
app.use("/v1/address", addressRoutes);
app.use("/v1/bank", bankRoutes);
app.use("/v1/demat", dematRoutes);
app.use("/v1/profile", profileRoutes);

//server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
