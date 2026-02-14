const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
require("dotenv").config();
const upload = require("express-fileupload");

const cookieParser = require("cookie-parser");

const Routes = require("./routes/Router.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
const { generalLimiter, authLimiter } = require("./middleware/rateLimiter.js");

const app = express();
app.use(cookieParser());

// Body parsing
app.use(express.json());

// SECURITY: Improve CORS settings for production
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(upload({ useTempFiles: true }));

// SECURITY: Apply general rate limiting
app.use("/api", generalLimiter);

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
      console.log(`Server started on port ${process.env.PORT}`),
    );
  })
  .catch((error) => {
    console.log("❌ MongoDB connection error:", error);
  });
