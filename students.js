//login n register x payah letak token

app.get('/student', async (req,res) => {
  console.log (req.headers.authorization);

  const tokens = req.headers.authorization.split('');
  console.log(tokens);

  jwt.verify(tokens[1], 'very strong password', function(err, decoded) {
    
  
if(err) {
res.status(401).send('Invalid token')
}
if(decoded.role == 'student'){
client.db('assign').collection('student').findOne({username:decoded.user})
}
if(decoded.role == 'lecterur'){
client.db('assign').collection('student').find({})
}
});
});
  
  app.listen(3000, () => console.log('Server started on port 3000'));

  app.post('/take/attendance', subject.VerifyToken, async (req, res) => {
     
      client.db("BENR2423").collection("students").updateOne({ 
        "username":{ $push: { attendance: attendance } }
      },
      );
      
      if (result.modifiedCount === 0) return res.status(404).send('Student not found');
      res.send('Attendance recorded');
      const{attendance} = req.body;
      console.log(attendance);
      
     

   });

