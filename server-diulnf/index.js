require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;

const router = express.Router();
const cloudinary = require("./cloudinary");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
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
    const lostItemsCollection = client.db("diu-lnf").collection("lostItems");
    const foundItemsCollection = client.db("diu-lnf").collection("foundItems");
    const counterCollection = client.db("diu-lnf").collection("counters");
    const adminCollection = client.db("diu-lnf").collection("admins");

    async function getNextLostSequenceValue(sequenceName) {
      try {
        const sequenceDocument = await counterCollection.findOneAndUpdate(
          { _id: sequenceName },
          { $inc: { sequence_value: 1 } },
          { returnDocument: "after", upsert: true }
        );

        console.log("Sequence document result:", sequenceDocument);

        if (sequenceDocument && sequenceDocument.sequence_value) {
          return sequenceDocument.sequence_value;
        } else if (
          sequenceDocument &&
          sequenceDocument.value &&
          sequenceDocument.value.sequence_value
        ) {
          return sequenceDocument.value.sequence_value;
        } else {
          console.error(
            "No sequence document or value found. Full response:",
            sequenceDocument
          );
          throw new Error("Failed to get sequence value");
        }
      } catch (error) {
        console.error("Error in getNextLostSequenceValue:", error);
        throw error;
      }
    }

    async function getNextFoundSequenceValue(sequenceName) {
      try {
        const sequenceDocument = await counterCollection.findOneAndUpdate(
          { _id: sequenceName },
          { $inc: { sequence_value: 1 } },
          { returnDocument: "after", upsert: true }
        );

        // console.log("Sequence document result:", sequenceDocument);

        if (sequenceDocument && sequenceDocument.sequence_value) {
          return sequenceDocument.sequence_value;
        } else if (
          sequenceDocument &&
          sequenceDocument.value &&
          sequenceDocument.value.sequence_value
        ) {
          return sequenceDocument.value.sequence_value;
        } else {
          console.error(
            "No sequence document or value found. Full response:",
            sequenceDocument
          );
          throw new Error("Failed to get sequence value");
        }
      } catch (error) {
        console.error("Error in getNextFoundSequenceValue:", error);
        throw error;
      }
    }

    // cloudinary post
    app.post("/upload", upload.single("image"), async (req, res) => {
      try {
        const file = req.file;
        if (!file) {
          return res
            .status(400)
            .send({ error: true, message: "No file uploaded" });
        }

        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "lostItems",
            transformation: [
              { width: 500, crop: "scale" },
              { quality: "auto" },
              { fetch_format: "webp" },
            ],
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return res
                .status(500)
                .send({ error: true, message: "Upload failed" });
            }
            res.send({
              success: true,
              message: "File uploaded successfully",
              url: result.secure_url,
            });
          }
        );

        stream.end(file.buffer);
      } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).send({ error: true, message: "Internal server error" });
      }
    });

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

    // submit a lost item report
    app.post("/lost-reports", verifyFirebaseToken, async (req, res) => {
      try {
        const email = req.tokenEmail;
        const {
          itemName,
          color,
          item_description,
          lost_date,
          lost_time,
          lost_location,
          imageUrl,
        } = req.body;

        // Validate required fields
        if (!itemName || !item_description || !lost_date || !lost_location) {
          return res.status(400).send({
            error: true,
            message:
              "Item name, description, lost date, and location are required",
          });
        }

        // Get user details
        const user = await usersCollection.findOne({ email: email });

        if (!user) {
          return res.status(404).send({
            error: true,
            message: "User not found",
          });
        }

        // Generate unique report ID using sequence counter
        const sequenceNumber = await getNextLostSequenceValue("lostlnf");
        const reportId = `LST${sequenceNumber.toString().padStart(6, "0")}`;

        // Create lost report object
        const lostReport = {
          reportId,
          itemName: itemName.trim(),
          description: item_description.trim(),
          color: color ? color.trim() : null,
          lost_location: lost_location.trim(),
          lost_date: new Date(lost_date),
          lost_time: lost_time || null,
          imageUrl: imageUrl || null,
          reportedBy: user._id,
          status: "open",
          statusUpdatedAt: new Date(),
          createdAt: new Date(),
        };

        // console.log("Lost report object to insert:", lostReport);

        // Insert the report
        const result = await lostItemsCollection.insertOne(lostReport);

        if (result.insertedId) {
          res.send({
            success: true,
            message: "Lost item report submitted successfully",
            reportId: reportId,
          });
        } else {
          res.status(500).send({
            error: true,
            message: "Failed to submit report",
          });
        }
      } catch (error) {
        console.error("Error submitting lost report:", error);
        res.status(500).send({
          error: true,
          message: "Internal server error",
          details: error.message,
        });
      }
    });

    // submit a found item report
    app.post("/found-reports", verifyFirebaseToken, async (req, res) => {
      try {
        const email = req.tokenEmail;
        const {
          itemName,
          color,
          item_description,
          found_date,
          found_time,
          found_location,
          imageUrl,
        } = req.body;

        // Validate required fields
        if (!itemName || !item_description || !found_date || !found_location) {
          return res.status(400).send({
            error: true,
            message:
              "Item name, description, found date, and location are required",
          });
        }

        // Get user details
        const user = await usersCollection.findOne({ email: email });

        if (!user) {
          return res.status(404).send({
            error: true,
            message: "User not found",
          });
        }

        // Generate unique report ID using sequence counter
        const sequenceNumber = await getNextFoundSequenceValue("foundlnf");
        const reportId = `FND${sequenceNumber.toString().padStart(6, "0")}`;

        // Create found report object
        const foundReport = {
          reportId,
          itemName: itemName.trim(),
          description: item_description.trim(),
          color: color ? color.trim() : null,
          found_location: found_location.trim(),
          found_date: new Date(found_date),
          found_time: found_time || null,
          imageUrl: imageUrl || null,
          reportedBy: user._id,
          status: "reported",
          statusUpdatedAt: new Date(),
          createdAt: new Date(),
        };

        // console.log("Found report object to insert:", foundReport);

        // Insert the report
        const result = await foundItemsCollection.insertOne(foundReport);

        if (result.insertedId) {
          res.send({
            success: true,
            message: "Found item report submitted successfully",
            reportId: reportId,
          });
        } else {
          res.status(500).send({
            error: true,
            message: "Failed to submit report",
          });
        }
      } catch (error) {
        console.error("Error submitting found report:", error);
        res.status(500).send({
          error: true,
          message: "Internal server error",
          details: error.message,
        });
      }
    });

    // get all lost item report where status is open and along with user details
    app.get("/lost-reports/open", async (req, res) => {
      try {
        const reports = await lostItemsCollection.aggregate([
          { $match: { status: "open" } },
          {
            $lookup: {
              from: "users",
              localField: "reportedBy",
              foreignField: "_id",
              as: "reportedByUser",
            },
          },
          { $unwind: "$reportedByUser" },
          {
            $project: {
              _id: 1,
              reportId: 1,
              itemName: 1,
              description: 1,
              color: 1,
              lost_location: 1,
              lost_date: 1,
              lost_time: 1,
              imageUrl: 1,
              reportedBy: 1,
              status: 1,
              statusUpdatedAt: 1,
              createdAt: 1,
              "reportedByUser.name": 1,
              "reportedByUser.email": 1,
              "reportedByUser.universityId": 1,
              "reportedByUser.phone": 1,
              "reportedByUser.department": 1,
            },
          },
        ]).toArray();

        res.send(reports);
      } catch (error) {
        console.error("Error fetching open lost reports:", error);
        res.status(500).send({
          error: true,
          message: "Failed to fetch open lost reports",
        });
      }
    });

    // admin api's

    // add admin
    app.post("/admins", verifyFirebaseToken, async (req, res) => {
      try {
        const { name, email, universityId, phone } = req.body;

        // Validate required fields
        if (!name || !email || !universityId || !phone) {
          return res.status(400).send({
            error: true,
            message: "Name, email, phone, and university ID are required",
          });
        }

        // Check if admin already exists
        const existingAdmin = await adminCollection.findOne({ email: email });
        if (existingAdmin) {
          return res.status(409).send({
            error: true,
            message: "Admin with this email already exists",
          });
        }

        const adminData = {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          role: "admin",
          universityId: universityId.trim(),
          createdAt: new Date().toISOString(),
        };

        // Insert the admin
        const result = await adminCollection.insertOne(adminData);

        if (result.insertedId) {
          res.send({
            success: true,
            message: "Admin added successfully",
            adminId: result.insertedId,
          });
        } else {
          res.status(500).send({
            error: true,
            message: "Failed to add admin",
          });
        }
      } catch (error) {
        console.error("Error adding admin:", error);
        res.status(500).send({
          error: true,
          message: "Internal server error",
          details: error.message,
        });
      }
    });

    // get all admins
    app.get("/admins", verifyFirebaseToken, async (req, res) => {
      try {
        const admins = await adminCollection.find({}).toArray();
        res.send(admins);
      } catch (error) {
        console.error("Error fetching admins:", error);
        res.status(500).send({
          error: true,
          message: "Failed to fetch admins",
        });
      }
    });

    // get admin by email
    app.get("/admins/:email", verifyFirebaseToken, async (req, res) => {
      try {
        const email = req.params.email;
        const adminData = await adminCollection.findOne({
          email: email.toLowerCase(),
        });
        if (adminData) {
          res.send(adminData);
        } else {
          res.status(404).send({
            error: true,
            message: "Admin not found",
          });
        }
      } catch (error) {
        console.error("Error fetching admin:", error);
        res.status(500).send({
          error: true,
          message: "Failed to fetch admin",
        });
      }
    });

    // update admin
    app.put("/admins/:email", verifyFirebaseToken, async (req, res) => {
      try {
        const email = req.params.email;
        const { name, universityId, phone } = req.body;

        // Validate required fields
        if (!name || !universityId || !phone) {
          return res.status(400).send({
            error: true,
            message: "Name and university ID are required",
          });
        }

        const updatedAdmin = {
          name: name.trim(),
          universityId: universityId.trim(),
          phone: phone.trim(),
          updatedAt: new Date(),
        };

        const result = await adminCollection.updateOne(
          { email: email.toLowerCase() },
          { $set: updatedAdmin }
        );

        if (result.modifiedCount > 0) {
          res.send({
            success: true,
            message: "Admin updated successfully",
          });
        } else {
          res.status(404).send({
            error: true,
            message: "Admin not found or no changes made",
          });
        }
      } catch (error) {
        console.error("Error updating admin:", error);
        res.status(500).send({
          error: true,
          message: "Failed to update admin",
        });
      }
    });

    // delete admin
    app.delete("/admins/:email", verifyFirebaseToken, async (req, res) => {
      try {
        const email = req.params.email;
        const result = await adminCollection.deleteOne({
          email: email.toLowerCase(),
        });
        if (result.deletedCount > 0) {
          res.send({
            success: true,
            message: "Admin deleted successfully",
          });
        } else {
          res.status(404).send({
            error: true,
            message: "Admin not found",
          });
        }
      } catch (error) {
        console.error("Error deleting admin:", error);
        res.status(500).send({
          error: true,
          message: "Failed to delete admin",
        });
      }
    });

    app.get("/test", async (req, res) => {
      res.send("Test route is working");
    });

    // Test environment variables
    app.get("/test-env", async (req, res) => {
      res.send({
        cloudinary_configured: {
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "SET" : "NOT_SET",
          api_key: process.env.CLOUDINARY_API_KEY ? "SET" : "NOT_SET",
          api_secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT_SET",
        },
      });
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
