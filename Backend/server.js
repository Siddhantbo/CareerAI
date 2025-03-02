const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
require("./src/config/db");
const port = process.env.PORT;
const corsOptions = {
  origin: function (origin, callback) {
    callback(null, origin);
  },
  credentials: true,
};

app.use(cors(corsOptions));
const authRoute = require("./src/routes/authroutes");
const examRoute = require("./src/routes/examRoute");
const skillroute = require("./src/routes/skillRoute");
const roleRoutes = require("./src/routes/roleroutes");
const courseRoutes = require("./src/routes/courseRoutes");
const courseInfoRoutes = require("./src/routes/courseInfoRoutes");
const enrollRoutes = require("./src/routes/enrollroute");
const recruiterRoutes = require("./src/routes/recruiterRoutes");
const candidateInfo = require("./src/routes/candidateInformationcontrollerroute");
const Interview = require("./src/routes/interviewroute");

//apis
app.use("/api/v1/auth", authRoute);
app.use("/api/v2/exam", examRoute);
app.use("/api/v2/skill", skillroute);
app.use("/api/roles", roleRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/course-info", courseInfoRoutes);
app.use("/api/v2/enroll", enrollRoutes);
app.use("/api/recruiters", recruiterRoutes);
app.use("/api/v2/candidate", candidateInfo);
app.use("/api/v2/interview", Interview);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
