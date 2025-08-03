const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;

require("dotenv").config();
app.use(cors());
app.use(express.json());

var admin = require("firebase-admin");

var serviceAccount = require("./firebase-admin-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// middleware to verify Firebase ID token
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  //   console.log("Authorization Header:", authHeader);
  //   console.log("Token:", token);
  if (!token) {
    return res
      .status(401)
      .send({ error: true, message: "Unauthorized access" });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    // console.log("Decoded Token:", decodedToken);
    req.tokenEmail = decodedToken.email; // Store the email in the request object
    next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    return res.status(403).send({ error: true, message: "Forbidden access" });
  }
};

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
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const usersCollection = client.db("diu-lnf").collection("users");

    // user api's

    // check if user profile complete
    app.get("/user/profile-status", verifyFirebaseToken, async (req, res) => {
      const email = req.tokenEmail;
      const query = { email: email };
      const user = await usersCollection.findOne(query);

      if (!user) {
        return res.send({
          exists: false,
          isComplete: false,
          message: "User not found",
        });
      }

      // Check if all required fields are present nd not empty
      const requiredFields = ["name", "universityId", "phone", "department"];
      const isComplete = requiredFields.every(
        (field) => user[field] && user[field].toString().trim() !== ""
      );

      res.send({
        exists: true,
        isComplete: isComplete,
        user: user,
        missingFields: requiredFields.filter(
          (field) => !user[field] || user[field].toString().trim() === ""
        ),
      });
    });

    // get user profile by email
    app.get("/user/profile", verifyFirebaseToken, async (req, res) => {
      try {
        const email = req.tokenEmail;
        const user = await usersCollection.findOne({ email: email });

        if (user) {
          res.send(user);
        } else {
          res.status(404).send({
            error: true,
            message: "User profile not found",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).send({
          error: true,
          message: "Failed to fetch profile",
        });
      }
    });

    // create or update user profile
    app.post("/user/profile", verifyFirebaseToken, async (req, res) => {
      try {
        const email = req.tokenEmail;
        const { name, universityId, phone, department } = req.body;

        // Validate required fields
        if (!name || !universityId || !phone || !department) {
          return res.status(400).send({
            error: true,
            message: "All fields are required",
          });
        }

        const userProfile = {
          email,
          name,
          universityId,
          phone,
          department,
          role: "user",
          updatedAt: new Date(),
          createdAt: new Date(),
        };

        // Upsert user profile
        const result = await usersCollection.replaceOne(
          { email: email },
          userProfile,
          { upsert: true }
        );

        res.send({
          success: true,
          message: "Profile updated successfully",
          result,
        });
      } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).send({
          error: true,
          message: "Failed to update profile",
        });
      }
    });

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
