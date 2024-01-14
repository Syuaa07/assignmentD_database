
const express = require('express')
const app = express();
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');

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


app.post('/register', (req,res) => {

    const{username, password} = req.body;
    console.log(username, password);


    const hash = bcrypt.hashSync(password, 6);

client.db("BENR2423").collection("users").insertOne({"username":username, "password":hash});

res.send("register success")
})

app.post('/login', (req,res) => {

    const{username, password} = req.body;
    console.log(username, password);

    client.db("BENR2423").collection("users").findOne({"username":username }).then((user) => {

        console.log(user)

        if(bcrypt.compareSync(password, user.password) == true){

            res.send("login success");
        }
        else {
            res.send("login failed")
        }
        
        })
        app.post('/login', (req,res) => {

          const{username, password} = req.body;
      
      
          client.db("BENR2423").collection("users").find({"username":username }).then((result) => {
      
              const user = result[0]
      
              if(user){
      
              
                  bcrypt.compare(password, user.password, function (err,result){
                      if(result){
      
                          const token = jwt.sign[{
      
                              user:username,
                              role:"student"
                          }, "very strong password" , {expiresIn: "365d"}]
      
                          res.send(token)
              }
              else {
                  res.send("wrong password")
              }
      
              })
          }else{
      
              res.send("user not found")
      
          }
      })
      })

  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
})