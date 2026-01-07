const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
require("dotenv").config();
const upload = require("express-fileupload");

const cookieParser = require("cookie-parser");

const Routes = require("./routes/Router.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");

const app = express();
app.use(cookieParser());

// Body parsing
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // अगर cookies/token भेजने हो
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: ["http://localhost:3000"] }));
app.use(upload());

// CORS
app.use(cors({ credentials: true, origin: ["http://localhost:3000"] }));

// Routes
app.use("/api", Routes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB
connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(process.env.PORT, () =>
      console.log(`Server started on port ${process.env.PORT}`)
    );
  })
  .catch((error) => {
    console.log("❌ MongoDB connection error:", error);
  });
