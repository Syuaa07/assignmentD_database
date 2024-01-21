const express = require('express')
const app = express();
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const attendance = require('./attendance.js')
const subject = require('./subject.js')
const lecterur = require('./lecterur.js')

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://b022210028:0zYZqBoOLuoGjuNf@cluster0.vsvuozb.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.use(express.json())

//student attendance
app.post('/attendance', verifyToken, async (req, res) => {
  const { matrix, date, subject, code, section } = req.body;

  client.db("BENR2423").collection("attendance").find({
    "matrix":{$eq:req.body.matrix },

    
  }).toArray().then((result) =>{
    console.log(result)

    if(result.length>0) {

      res.status(400).send ("Matrix already exists")
    }
    else {
       client.db("BENR2423").collection("attendance").insertOne(
    {
      "matrix": req.body.matrix,
    "date": req.body.date,
    "subject": req.body.subject,
    "code": req.body.code,
    "section": req.body.section
  })
   res.send('Attendance Submitted')
  
    }
  } )

})


//Subject
app.post('/subject', verifyToken, async (req, res) => {
  const { matrix, section, subject, code, program, lecterur} = req.body;

  client.db("BENR2423").collection("Subject").find({
    "code":{$eq:req.body.code }
    
  }).toArray().then((result) =>{
    console.log(result)

    if(result.length>0) {

      res.status(400).send ("Subject already exists")
    }
    else {
       client.db("BENR2423").collection("Subject").insertOne(
    {
      "matrix": req.body.matrix,
      "section": req.body.section,
      "subject": req.body.subject,
      "code": req.body.code,
      "program": req.body.program,
      "lecterur": req.body.lecterur
    })
   res.send('Subject added succesfully')
  
    }
  } )

})

//Lecterur
app.post('/lecterur', verifyToken, async (req, res) => {
  const { subject, code, program, lecterur } = req.body;

  client.db("BENR2423").collection("lecterur").find({
    "code":{$eq:req.body.code }
    
  }).toArray().then((result) =>{
    console.log(result)

    if(result.length>0) {

      res.status(400).send ("Subject already exists")
    }
    else {
       client.db("BENR2423").collection("lecterur").insertOne(
    {
      "subject": subject,
      "code": code,
      "program": program,
      "lecterur": lecterur
    })
   res.send('Lecterur register succesfully')
  
    }
  } )

})

 
function verifyToken(req, res, next) {
  let header = req.headers.authorization;


  if (!header) {
    return res.status(401).send('Unauthorized request');
  }

  let tokens = header.split(' ')[1]; // Ensure correct space-based split

  try {
    // Log token for inspection
    console.log('Received token:', tokens);

    jwt.verify(tokens, 'very strong password', async (err, decoded) => {
      if (err) {
        console.error('Error verifying token:', err);
        return res.status(401).send('Invalid token');
      }

      console.log('Decoded token:', decoded);
      
      const { role, username } = req.body;

      if (!decoded || !decoded.role) { // Check for missing properties
        return res.status(401).send('Invalid or incomplete token');
      }

      if (decoded.role !== 'lecterur') {
        return res.status(401).send('Invalid role');
      }

      next();
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send('Internal server error');
  }
}

function generateAccessToken(payload) {
  return jwt.sign(payload, "very strong password", { expiresIn: '365d' });
}

app.post('/register', (req, res) => {

  const { username, password, role } = req.body;
  console.log(username, password);


  const hash = bcrypt.hashSync(password, 10);

  client.db("BENR2423").collection("users").insertOne({
    "username": req.body.username,
    "password": hash,
    "role": req.body.role
  });

  res.send("register success")
})

app.post('/register', (req, res) => {

  const { username, password, role } = req.body;
  console.log(username, password);


  const hash = bcrypt.hashSync(password, 10);

  client.db("BENR2423").collection("users").find({
    "username":{$eq:req.body.username }
    


  }).toArray().then((result) =>{
    console.log(result)

    if(result.length>0) {

      res.status(400).send ("Username already exists")
    }
    else {
       client.db("BENR2423").collection("users").insertOne(
    {
      "username": req.body.username,
      "password": hash,
      "role": req.body.role
    })
   res.send('register succesfully')
  
    }
  } )

})

app.post('/login', async (req, res) => {
  console.log('login', req.body);
  const { username, password } = req.body;

  console.log(username, password);

  const user = await client.db("BENR2423").collection("users").find({ "username": username }).toArray();
  console.log(user);

  if (user) {
    bcrypt.compare(password, user[0].password, (err, result) => {
      if (result) {

        const token = jwt.sign({

          user: user[0].username,
          role: user[0].role
        }, "very strong password", { expiresIn: "365d" });

        res.send(token)
      }
      else {
        res.send("wrong password")
      }

    })
  } else {

    res.send("user not found")

  }
});

app.post('/logout', verifyToken, (req, res) => {

  console.log('logout', req.body);
 // const { role} = req.body;

  //console.log(role);

  res.send("See You Again :)")
})


app.listen(port, () => {

  console.log(`Example app listening on port ${port}`)
})