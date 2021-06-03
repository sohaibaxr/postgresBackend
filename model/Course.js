const { Schema, model } = require("mongoose");
const courseSchema=new Schema({
    name:{
        type:"String",
        required:true,
    },
    code:{
        type:"String",
        required:true,
    },
    students:[{
        type:Schema.Types.ObjectId,ref:"users"
    }],
    teacher:{
        type:Schema.Types.ObjectId,ref:"users"
    }
})   
module.exports=model("Courses",courseSchema)