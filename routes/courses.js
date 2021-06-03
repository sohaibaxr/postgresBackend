const router = require("express").Router();
const Courses = require("../model/Course");
const pool = require("../queries");

router.post("/", async (req, res) => {
    try {
        const { name, code } = req.body
        let courseExists = await pool.query('SELECT * FROM courses WHERE name=$1', [name])
        if (courseExists.rowCount > 1) return res.send("Course already Exists")
        else {
            const newCourse = await pool.query('INSERT INTO courses (name,code) Values ($1,$2)', [name, code])
            res.status(201).send(newCourse);
        }
    } catch (error) {
        res.send(error)
    }
});
router.get("/", async (req, res) => {
    try {
        pool.query('SELECT * FROM courses ', (error, result) => {
            res.status(200).json(result.rows)
        })
    } catch (error) {
        res.send(error)
    }
});
// get courses by course id
router.get("/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const result = await pool.query('SELECT * FROM courses WHERE id=$1', [_id])
        res.send(result.rows);
    } catch (error) {
        res.send(error)
    }
});
// get student assigned courses 
router.get("/students/:studentId", async (req, res) => {
    try {
        const studentId = req.params.studentId
        const requiredStudents = await pool.query('SELECT * FROM user_course WHERE user_id=$1', [studentId])
        data = requiredStudents.rows
        let coursesList = []
        data.map(usr => {
            coursesList.push(usr.course_id)
        })
        res.send(coursesList)
    } catch (error) {
        res.send(error)
    }
});
router.delete("/:id", async (req, res) => {
    const courseId = req.params.id
    try {
        pool.query('DELETE FROM courses WHERE id = $1', [courseId], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(`course deleted with ID: ${courseId}`)
        })
    } catch (error) {
        console.log(error)
    }
});
router.put("/:id", async (req, res) => {
    const _id = req.params.id
    const { name, code } = req.body
    try {
        const updatedCourse = await pool.query('UPDATE courses set name=$1,code=$2 WHERE id=$3', [name, code, _id])
        res.send(updatedCourse)
    } catch (error) {
        console.log(error)
    }
})
module.exports = router;
