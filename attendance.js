app.post('/attendance', subject.VerifyToken, async (req, res) => {
     
    client.db("BENR2423").collection("attendance").updateOne({ 
      "username":{ $push: { attendance: attendance } }
    },
    );
    
    if (result.modifiedCount === 0) 
    return res.status(404).send('Students not found');
    res.send('Attendance recorded');
    const{attendance} = req.body;
    console.log(attendance);
    
   

 });






//async abcd => {
  //  console.log('Hello World');
//}

//async banyak => {
  //  console.log('Hello World');
//}

module.exports = {
   attendance,
   // abcd}
}
