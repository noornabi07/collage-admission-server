const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const port = 4612;
 const { MongoClient, ServerApiVersion } = require('mongodb');


 app.use(cors());
 app.use(express.json());



//  const uri = 'mongodb+srv://campusBooking:yXIHY5TQ9JC1cgQg@cluster0.eo0io7y.mongodb.net/?retryWrites=true&w=majority';
 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eo0io7y.mongodb.net/?retryWrites=true&w=majority`;
 
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
     

     const allColleges = client.db("eCommerceSite").collection("allColleges");
     const research = client.db("eCommerceSite").collection("research");
     const applyForAdmission = client.db("eCommerceSite").collection("applied");
     const UserCollection = client.db("eCommerceSite").collection("users");
 


     app.get("/allCollege", async (req, res) => {
      const result = await allColleges.find().toArray();
      res.send(result);
    });


    app.get("/users", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email,  };
      }
      const result = await UserCollection.find(query).toArray();
      res.send(result);
    });


    app.post("/users",  async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await UserCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: "user already exists" });
      }

      const result = await UserCollection.insertOne(user);
      res.send(result);
    });


    app.patch("/users/:id", async(req, res)=>{
      const id = req.params.id;
    const filter = {_id : new ObjectId(id)}
     const update = req.body
     console.log(update)
     const option = {upsert : true}
     const updateDoc = {
       $set: {
         name: update.name,
         email : update.email,
         phone : update.phone,
         status : update.status
       },
     };
     const result = await UserCollection.updateOne(filter, updateDoc, option);
     res.send(result);
   })

   app.get("/research", async (req, res) => {
    const result = await research.find().toArray();
    res.send(result);
  });

  app.get("/searchCollege", async (req, res) => {
    // console.log(req.query.search)
    const search = req.query.search;
    const query = { college_name: { $regex: search } };
    const result = await allColleges.find(query).toArray();
    res.send(result);
  });

  app.get("/allCollege/:id", async (req, res) => {
    const id = req.params.id;

    const query = { _id: new ObjectId(id) };
    const result = await allColleges.findOne(query);
    res.send(result);
  });

  app.post("/admissionApply", async (req, res) => {
    const appliedDetails = req.body;
    const result = await applyForAdmission.insertOne(appliedDetails);
    res.send(result);
  });

   app.get("/admissionApply", async (req, res) => {
    let query = {};
    if (req.query?.email) {
      query = { email: req.query.email,  };
    }
    const result = await applyForAdmission.find(query).toArray();
    res.send(result);
  });

  app.get("/admissionApply", async (req, res) => {
    const result = await applyForAdmission.find().toArray();
    res.send(result);
  });

  app.patch("/admissionApply/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    console.log(filter)
    const update = req.body
    // console.log(update)
    const option = {upsert : true}
    const updateDoc = {
      $set: {
        rating: update.rating,
        review : update.review
      },
    };
    const result = await applyForAdmission.updateOne(filter, updateDoc, option);
    res.send(result);
  });




     await client.db("admin").command({ ping: 1 });
     console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
     // Ensures that the client will close when you finish/error
    //  await client.close();
   }
 }
 run().catch(console.dir);
 


 app.get('/', (req , res) =>{
    res.send("Simple crud is running on collage")
 })

 app.listen(port , ()=>{
    console.log(`simple crud is runnig on port , ${port}`)
 })