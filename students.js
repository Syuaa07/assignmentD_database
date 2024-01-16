//login n register x payah letak token

app.get('/students', async (req,res) => {
  console.log (req.headers.authorization);

  const tokens = req.headers.authorization.split('');
  console.log(tokens);

  jwt.verify(tokens[1], 'very strong password', function(err, decoded) {
    
  
if(err) {
res.status(401).send('Invalid token')
}
if(decoded.role == 'students'){
client.db('assign').collection('students').findOne({username:decoded.user})
}
if(decoded.role == 'lecterur'){
client.db('assign').collection('students').find({})
}
});
});
  
  

  app.post('/take/attendance', subject.VerifyToken, async (req, res) => {
     
      client.db("BENR2423").collection("students").updateOne({ 
        "username":{ $push: { attendance: attendance } }
      },
      );
      
      if (result.modifiedCount === 0) 
      return res.status(404).send('Students not found');
      res.send('Attendance recorded');
      const{attendance} = req.body;
      console.log(attendance);
      
     

   });

