const cors = require("cors");
const exp = require("express");
const bp = require("body-parser");
const { connect } = require("mongoose");
const { success, error } = require("consola");
const passport=require("passport")
const { DB, PORT } = require ("./config");
const moment = require ("moment")



const authRoute=require("./routes/users")
const courseRoute=require("./routes/courses")
const attendanceRoute=require("./routes/attendances")

const app = exp();

app.use(cors());
app.use(bp.json());
app.use(passport.initialize());

require("./middlware/passport")(passport);

app.use("/api/users", authRoute);
app.use("/api/courses", courseRoute);
app.use("/api/attendance",attendanceRoute)

const startApp = async () => {
  try {
    
    await connect(DB, {
      useFindAndModify: true,
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    success({
      message: `Successfully connected with the Database \n${DB}`,
    });
    app.listen(PORT, () =>
      success({ message: `Server started on PORT ${PORT}`})
    );
  } catch (err) {
    error({
      message: `Unable to connect with Database \n${err}`,
    });
    startApp();
  }
};

startApp();
