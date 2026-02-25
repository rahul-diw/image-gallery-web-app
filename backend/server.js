const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();
require("./config/cloudinary");

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://admin-dashboard-navy-three-15.vercel.app",
      "https://website-omega-orpin-77.vercel.app"
    ],
    credentials: true
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Working 🔥");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/images", require("./routes/imageRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
