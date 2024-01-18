const express = require('express')
const app = express();
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const attendance = require('./attendance.js')

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


//record attendance
app.post('/attendance', async (req, res) => {
  const { matrix, date, subject, section } = req.body;
  try {
    attendanceModule.recordAttendance(matrix, date, subject, section);
    res.status(201).send("Attendance Submitted");
  } catch (error) {
    console.log(error);
    res.status(500).send(`Error ${error}`);
  }
});
  async function recordAttendance(matrix, date, subject, section){
    try{
      const database = client.db ('BENR2423');
      const collection = database.collection('attendance') ;
      
      const user ={
        matrix: matrix,
        date :date ,
        subject:subject,
        section:section,
        };
      
        await collection.insertOne(user);
        console.log("Attendance Submitted Successfully");
      }
      catch(error){
        console.log("Attendance already exists")
        }
        }
    


//get kalau guna nama or userame dia akan keluar semua , tapi kalau guna id dia akan keluar spesifik orangg

app.listen(port, () => {

console.log(`Example app listening on port ${port}`)
})