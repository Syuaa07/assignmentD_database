/*app.get("/attendance/:id",async (req,res)=>{ //view
              try{
                const found = await findByID(req.params.id)
                if(!found)
                return res.status(404).json({msg:"No class found"})
              res.json(found)
              } catch(err){
                res.status(500).json({msg: err.message})
                }
                })
                // @route DELETE api/data/:id
                // @desc Delete A Class By its Id
                // @access public
                app.delete("/attendance/:id",auth,(req,res)=> {
                  const id = req.params.id;
                  deleteData(id)
                  .then(gone=>{
                    res.json(gone)
                    })
                    .catch(e=>{
                      res.status(500).json({ msg: "Error Deleting the
                      Class"})
                      })
                      })
                      // Helper Functions
                      function auth(req,res,next){
                        const token=req.header("x-auth-token");
                        if (!token) {
                          return res.status(401).json({ msg: "No Token
                          Provided!"});
                          } else {
                            jwt.verify(token,process.env.JWT_SECRET ,
                              (err,decoded)=>{
                                if (err) {

*/
  
     
     //app.get('/attendance/:id', async (req, res) => {
      //const attendance = await Attendance.findById(req.params.id);
     // res.json(attendance);
    // });
     
     //app.patch('/attendance/:id', async (req, res) => {
     // const updatedAttendance = await Attendance.findByIdAndUpdate(
      //   req.params.id,
       //  req.body,
        // { new: true }
     // );
     // res.json(updatedAttendance);
    // });
     
    //app.delete('/attendance/:id', async (req, res) => {
    //  await Attendance.findByIdAndDelete(req.params.id);
      //res.json({ message: 'Attendance record deleted' });
   //  })

// function addStudentData(_id,matric,date,subject,section) 
//{
//studentData[rollNumber] = {
  //name: name,
  //rollNumber: rollNumber,
  //status: status
//};
//}

//addStudentData("John Doe", 1, "Present");
//addStudentData("Jane Smith", 2, "Absent");

//function displayStudentData() {
//let output = "<table><tr><th>Name</th><th>Roll Number</th><th>Status</th></tr>";
//for (let rollNumber in studentData) {
  //output += "<tr><td>" + studentData[rollNumber].name + "</td><td>" + studentData[rollNumber].rollNumber + "</td><td>" + studentData[rollNumber].status + "</td></tr>";
//}
//output += "</table>";
//console.log(output);
//}

//displayStudentData();
  
  //if (result.modifiedCount === 0) 
  //return res.status(404).send('Students not found');
  //res.send('Attendance recorded');
  //const{attendance} = req.body;
 // console.log(attendance);
  
 

//});