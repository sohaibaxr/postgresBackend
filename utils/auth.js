const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../model/users");
const { SECRET } = require("../config");
const Attendance = require("../model/Attendance");
const moment = require("moment")
const pool = require("../queries")

const getUsers = (req, res) => {
  pool.query('SELECT * FROM datausers ', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const userRegister = async (userDets, res,) => {
  try {
    // let emailNotRegistered = await validateEmail(userDets.email);
    // if (!emailNotRegistered) {
    //   return res.json({ message: "Email  already registered", success: false });
    // }
    let result = await pool.query('select * from datausers where email=$1', [userDets.email])
    console.log(result.rowCount)
    if (result.rowCount > 1) {
      res.json("Email already registered")
    }
    else {
      const hashedPassword = await bcrypt.hash(userDets.password, 12);
      const { role, id, name, email } = userDets
      const newUser = await pool.query('Insert Into datausers(name,role,id,email,password) VALUES ($1,$2,$3,$4,$5)', [name, role, id, email, hashedPassword])
      res.send(newUser)
    }
  }
  catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unable to create account.",
    });
  }
};

// const getAllUser = async (req, res) => {
//   try {
//     const users = await User.find({})
//     res.send(users)
//   } catch (error) {
//     res.send(error)
//   }
// };
const deleteUser = async (req, res) => {
  try {
    const _id = req.params.id
    const user = await pool.query('DELETE FROM datausers WHERE id = $1', [_id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    })
    res.send(user)
  } catch (error) {
    res.send(error)
  }
}
const updateUser = async (req, res) => {
  try {
    const _id = req.params.id
    const updatedUser = await User.findByIdAndUpdate({ _id }, { name: req.body.name, email: req.body.email, courses: req.body.courses })
    res.status(200).send(updatedUser)
  } catch (error) {
    res.send(error)
  }
}
const getUserByCourse = async (req, res) => {
  try {
    const courseId = req.params.id
    const requiredUser = await User.find({ courses: courseId })
    const allAttendance = await Attendance.find({})
    var attendanceList = []
    requiredUser.forEach(usr => {
      const userId = usr._id.toString()
      const userName = usr.name
      var attendanceObject = new Object()
      const today = moment(new Date()).format("YYYY-MM-DD")
      allAttendance.forEach(atnd => {
        var attendanceStatus = atnd.isPresent
        if (atnd.student.toString() === userId && atnd.course.toString() === courseId && moment(atnd.date).format("YYYY-MM-DD") === today) {
          attendanceObject.id = userId,
            attendanceObject.name = userName,
            attendanceObject.isPresent = attendanceStatus
          attendanceList.push(attendanceObject)
        }
        else {
          console.log("not matched")
        }
      })
    })
    res.send(attendanceList)
  } catch (error) {
    res.send(error)
  }
}
const getBycourseId = async (req, res) => {
  try {
    const course = req.params.courseId
    const requiredUser = await pool.query('SELECT * FROM user_course WHERE course_id=$1', [course])
    data = requiredUser.rows
    let studentsList = []
    data.map(usr => {
      studentsList.push(usr.user_id)
    })
    res.send(studentsList)
  } catch (error) {
    res.send(error)
  }
}
const userLogin = async (userCreds, res) => {
  let { email, password } = userCreds;
  const user = await pool.query('select * from datausers where email=$1 ', [email])
  let data = user.rows
  data.map(usr => {
    pswrd = usr.password
    id = usr.id
    role = usr.role
    email = usr.email
  })
  if (user.rowCount == 0) {
    return res.status(201).json({
      message: "Invalid email.",
      success: false
    });
  }

  let matchPassword = await bcrypt.compare(password, pswrd);
  if (matchPassword) {
    let token = jwt.sign(
      {
        id: id,
        role: role,
        email: email
      },
      SECRET,
      { expiresIn: "7 days" }
    );
    let result = {
      role: role,
      email: email,
      _id: id,
      token: `Bearer ${token}`,
      expiresIn: 168
    };
    return res.status(200).json({ ...result, message: "You are now logged in." });
  } else {
    return res.json({ message: "Incorrect password.", success: false });
  }
};

const userAuth = passport.authenticate("jwt", { session: false });


const checkRole = roles => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next()
    }
    return res.status(401).json({
      message: "UnAuthorized",
      succes: "false"
    })
  }
}
// const validateEmail = async email => {
//   let user = pool.query('SELECT * from datausers WHERE email=$1',[email])
//   if (user) {
//     return false
//   }
//   else {
//     return true
//   }
// };
module.exports = {
  userAuth,
  userLogin,
  getBycourseId,
  userRegister,
  // getAllUser,
  deleteUser,
  updateUser,
  getUserByCourse,
  checkRole,
  getUsers
};
