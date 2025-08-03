const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;


require("dotenv").config();
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1gc3l46.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});




async function run() {
    try {
        await client.connect();  
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");


        const usersCollection = client.db("diu-lnf").collection("users"); 



        app.get("/test", async (req, res) => {
            res.send("Test route is working");
        });
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("DIU-lnf server is running");
});

app.listen(port, () => {
  console.log(`User server is running on port ${port}`);
});