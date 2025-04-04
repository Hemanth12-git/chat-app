const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require('cors');
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const authRoutes = require("./routes/auth-routes");
const messageRoutes = require("./routes/message-routes");
const { dbConnect } = require("./lib/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use("/api/auth", authRoutes);
app.use('/api/message', messageRoutes);

dbConnect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running successfully on port: ${PORT}`);
  });
}).catch((error) => {
  console.error("Database connection failed:", error);
  process.exit(1);
});
