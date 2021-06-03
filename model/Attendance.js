const { Schema, model } = require("mongoose");

const AttendanceSchema=new Schema({
    student:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    course:{
        type:Schema.Types.ObjectId,
        ref:"Courses"
    },
    date:{
        type:Date,
        required:true        
    },
    isPresent:{
        type:Boolean,
        required:true    
    },    
},{timestamps:true})
module.exports = model("Attendance", AttendanceSchema);