const express = require('express')
const app = express();
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const attendance = require('./attendance.js')
const subject = require('./subject.js')
const lecturer = require('./lecturer.js')

const { MongoClient, ServerApiVersion, MongoDBNamespace } = require('mongodb');
const uri = "mongodb+srv://b022210028:0zYZqBoOLuoGjuNf@cluster0.vsvuozb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

// // View details
// app.post('/viewDetails', verifyToken, async (req, res) => {
  
//   try {
//     // Validate request body
//     const { code } = req.body;
//     if (!code) {
//       return res.status(400).json({ error: "Code is required" });
//     }

//     // Fetch details
//     const details = await viewDetails();
//     console.log(details);
//     return res.status(200).json(details);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send('Error retrieving data from database');
//   }
// })

//  async function viewDetails(){
// try {

//     await client.connect();
    
//     const database = client.db("BENR2423");
//     const collection = database.collection("attendance");

//     // Query the database with the provided code
//     const code = await collection.find({"code":{$eq:req.body.code}}).toArray();
//     console.log(code);

//     return code;
//   }
//   catch (err) {
//     console.error(err);
//     res.status(500).send('Error retrieving data');
//   }
  
//   }

app.post('/viewDetails', verifyToken, async (req, res) => {
  client.db("BENR2423").collection("attendance").find({
    "code": { $eq: req.body.code }
  }).toArray().then((result) => {
    if (result.length > 0) {
      res.status(200).json(result);
      res.status(400).send('View Successful')
    } else {
      res.send('No record')
    }
  })
});

//student attendance
app.post('/attendance' , StudentToken, async (req, res) => {
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
      "matrix": matrix,
    "date": date,
    "subject": subject,
    "code": code,
    "section": section
  })
   res.send('Attendance Submitted')
  
    }
  } )

})

// Subject
app.post('/subject', SubjectToken, async (req, res) => {
  const { subject, code, program, lecturer} = req.body;

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
      
      
      "subject": subject,
      "code": code,
      "program": program,
      "lecturer": lecturer
    })
   res.send('Subject added succesfully')
  
    }
  } )

})

// Lecturer
app.post('/lecturer', verifyToken, async (req, res) => {
  const { subject, code, program, lecturer } = req.body;

  client.db("BENR2423").collection("lecturer").find({
    "code":{$eq:req.body.code }
    
  }).toArray().then((result) =>{
    console.log(result)

    if(result.length>0) {

      res.status(400).send ("Subject already exists")
    }
    else {
       client.db("BENR2423").collection("lecturer").insertOne(
    {
      "subject": subject,
      "code": code,
      "program": program,
      "lecturer": lecturer
    })
   res.send('Lecturer register succesfully')
  
    }
  } )

})

 // Token for lecterur and admin
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

      if (decoded.role !== 'admin' && decoded.role !== 'lecturer') {
        return res.status(401).send('Access Denied.');
      }

      next();
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send('Internal server error');
  }
}

// Token for subject
function SubjectToken(req, res, next) {
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

      if (decoded.role !== 'student') {
        return res.status(401).send( 'You are not authorized to submit subject.');
      }

      next();
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send('Internal server error');
  }
}

// Token for student attendance
function StudentToken(req, res, next) {
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

      if (decoded.role !== 'student') {
        return res.status(401).send( 'You are not authorized to submit attendance.');
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
// Helper function to validate password strength
function isPasswordStrong(password) {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}
// Register for users (admin, lecturer, student)
app.post('/register', (req, res) => {

  const { username, password, role } = req.body;
  console.log(username, password);

  if (!isPasswordStrong(password)) {
    return res.status(400).send('Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long.');
  }

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

// In-memory store for failed attempts during a session (use Redis for production)
/*const sessionAttempts = {};

// Maximum password re-entry attempts and cooldown duration (in milliseconds)
const MAX_PASSWORD_ATTEMPTS = 3;
const COOL_DOWN_PERIOD = 30 * 60 * 1000; // 30 minutes*/

// Login for users (admin, lecturer, student)
/*app.post('/login', async (req, res) => {
  console.log('login', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  // Initialize or fetch session attempt data
  const currentTime = Date.now();
  const userSession = sessionAttempts[password] || { attempts: 0, lockUntil: null };

  // Check if user is locked out
  if (userSession.lockUntil && userSession.lockUntil > currentTime) {
    const waitTime = Math.ceil((userSession.lockUntil - currentTime) / 1000);
    return res.status(403).send(`Too many incorrect attempts. Try again in ${waitTime} seconds.`);
  }

  // Validate password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    // Increment password attempts
    userSession.attempts += 1;

    if (userSession.attempts >= MAX_PASSWORD_ATTEMPTS) {
      userSession.lockUntil = currentTime + COOL_DOWN_PERIOD; // Lock account for cooldown period
      sessionAttempts[password] = userSession;
      return res.status(403).send("Too many incorrect attempts. Try again in 30 minutes.");
    }

    sessionAttempts[password] = userSession;
    const remainingAttempts = MAX_PASSWORD_ATTEMPTS - userSession.attempts;
    return res
      .status(401)
      .send(`Incorrect password. You have ${remainingAttempts} attempts remaining.`);
  }


  const user = await client.db("BENR2423").collection("users").find({ "username": username }).toArray();
  console.log(user);
  
  if (user) {
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {

        const token = jwt.sign({

          user: user.username,
          role: user.role
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
});*/

// In-memory store for failed attempts during a session (use Redis for production)
const sessionAttempts = {};

// Maximum password re-entry attempts and cooldown duration (in milliseconds)
const MAX_PASSWORD_ATTEMPTS = 3;
const COOL_DOWN_PERIOD = 10 * 60 * 1000; // 30 minutes

// Login for users (admin, lecturer, student)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  // Initialize or fetch session attempt data
  const currentTime = Date.now();
  sessionAttempts[username] = sessionAttempts[username] || { attempts: 0, lockUntil: null };
  const userSession = sessionAttempts[username];

  // Check if the user is locked out
  if (userSession.lockUntil && userSession.lockUntil > currentTime) {
    const waitTime = Math.ceil((userSession.lockUntil - currentTime) / 1000);
    return res.status(403).send(`Too many incorrect attempts. Try again in ${waitTime} seconds.`);
  }

  try {
    // Fetch user from database
    const users = await client.db("BENR2423").collection("users").find({ username }).toArray();

    if (!users || users.length === 0) {
      return res.status(404).send("User not found");
    }

    const user = users[0];

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Increment failed attempts
      userSession.attempts += 1;

      if (userSession.attempts >= MAX_PASSWORD_ATTEMPTS) {
        userSession.lockUntil = currentTime + COOL_DOWN_PERIOD; // Lock the user for cooldown period
        return res.status(403).send("Too many incorrect attempts. Try again in 10 minutes.");
      }

      const remainingAttempts = MAX_PASSWORD_ATTEMPTS - userSession.attempts;
      return res
        .status(401)
        .send(`Incorrect password. You have ${remainingAttempts} attempts remaining.`);
    }

    // Reset session attempts on successful login
    userSession.attempts = 0;
    userSession.lockUntil = null;

    // Generate and send JWT token
    const token = jwt.sign(
      { user: user.username, role: user.role },
      "very strong password",
      { expiresIn: "365d" }
    );

    res.send(token);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal server error");
  }
});


// Logout for users (admin, lecturer, student)
app.post('/logout', (req, res) => {

  console.log('logout', req.body);
 // const { role} = req.body;

  //console.log(role);

  res.send("See You Again :)")
})

// View attendance for lecturer or admin
app.get('/view/Details/:code', verifyToken, async (req, res) => {

  
  try {
    
    await viewDetails(client, req.params.code);
 
    return res.status(200).send("Details view succesfully")
  }
  catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  })

// Connect to the MongoDB cluster
app.listen(port, () => {

  console.log(`Example app listening on port ${port}`)
})