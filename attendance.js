const MongoClient = require('mongodb').MongoClient;
const Schema = MongoClient.Schema;
const AttendanceSchema = new Schema({
    role: {
        type: String,
    
        required:'role is required'
    },
    userType: {
        type: String,
    
        required:'usertype is required'
    },
    username: {
        type: String,
    
        required:'username is required'
    },
    attendacedate: {
        type: Date,
        required:true,
        default: Date
    },
    
    subject: {
        type: String,
        required:true
    },
    
    class:{
        type: [
          
        ]
      }
});
const Attendance = MongoClient.model("Attendance", AttendanceSchema);
module.exports = {Attendance};