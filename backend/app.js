const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const session = require("express-session");
const upload = require("express-fileupload");
require("dotenv").config();

const users = require("./routes/Users");
const enquiries = require("./routes/Enquiry");
const property = require("./routes/Property");
const connectDB = require("./config/db");
connectDB();
const app = express();

const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(upload({ createParentPath: true }));
app.use(express.json());
// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 300000 },
  })
);

//? API's
app.use("/users", users);
app.use("/enquiry", enquiries);
app.use("/property", property);

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
