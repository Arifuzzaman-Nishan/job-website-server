const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const port = 5000;

const app = express();
dotenv.config();

// client and server connect
app.use(cors());

// request parser
app.use(express.json());

// database connection

const uri = `mongodb+srv://nishan:${process.env.PASSWORD}@cluster0.kot7w.mongodb.net/job-website?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  // collection
  const jobPostCollection = client.db("job-website").collection("jobPost");
  const employerCollection = client.db("job-website").collection("employer");
  const employerPaymentCollection = client
    .db("job-website")
    .collection("employerPayment");
  const adminCollection = client.db("job-website").collection("admin");
  const jobSeekerCollection = client.db("job-website").collection("jobseeker");
  const applyJob = client.db("job-website").collection("applyjob");

  app.post("/employer", (req, res) => {
    const empolyerData = req.body;

    // all employer account list
    employerCollection.insertOne(empolyerData).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  // for jobseeker
  app.post("/jobseeker", (req, res) => {
    const jobSeekerData = req.body;

    jobSeekerCollection.insertOne(jobSeekerData).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  // for succesfully payment completed
  app.post("/employerPayment", (req, res) => {
    const payment = req.body;

    employerPaymentCollection.insertOne(payment).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  // for job posting api
  app.post("/jobPost", (req, res) => {
    const jobPost = req.body;

    jobPostCollection.insertOne(jobPost).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  // for admin checking collection
  app.post("/isAdmin", (req, res) => {
    // console.log(req.body);
    adminCollection
      .find({ admin: req.body.email })
      .toArray((err, documents) => {
        res.send(documents.length > 0);
      });
  });

  // for employer checking collection
  app.post("/isEmployer", (req, res) => {
    // console.log(req.body);
    employerCollection
      .find({ email: req.body.email })
      .toArray((err, documents) => {
        res.send(documents.length > 0);
      });
  });

  // for jobseeker checking collection
  app.post("/isJobseeker", (req, res) => {
    // console.log(req.body);
    jobSeekerCollection
      .find({ email: req.body.email })
      .toArray((err, documents) => {
        res.send(documents.length > 0);
      });
  });

  // get allpost
  app.get("/allPost", (req, res) => {
    jobPostCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });

  // admin update the job post status
  // update
  app.patch("/update/:id", (req, res) => {
    console.log(req.body);
    jobPostCollection
      .updateOne(
        { _id: ObjectID(req.params.id) },
        {
          $set: {
            status: req.body.status,
          },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });

  // get all success post
  app.get("/sucessPost", (req, res) => {
    jobPostCollection.find({ status: "done" }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // apply job
  app.post("/applyjob", (req, res) => {
    const jobData = req.body;

    applyJob.insertOne(jobData).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  console.log("db connected");
  // perform actions on the collection object
  // client.close();
});

// routing setup

// create server
app.listen(process.env.PORT || port, () => {
  console.log(`successfully connect with port ${process.env.PORT}`);
});
