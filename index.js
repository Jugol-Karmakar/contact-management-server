const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p9knpsm.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    const contactCollection = client.db("mern_admin").collection("contacts");
    const addContactCollection = client
      .db("mern_admin")
      .collection("add_contacts");

    //   get all contacts details
    app.get("/contacts", async (req, res) => {
      const query = {};
      const cursor = contactCollection.find(query);
      const contacts = await cursor.toArray();
      res.send(contacts);
    });

    // add single contact
    app.post("/add-contact", async (req, res) => {
      const contact = req.body;
      const result = await contactCollection.insertOne(contact);
      res.send(result);
    });

    // delete a contact
    app.delete("/contacts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await contactCollection.deleteOne(query);
      res.send(result);
    });

    // a contact add to favourite
    app.patch("/contacts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { role: "favourite" },
      };
      const result = await contactCollection.updateOne(filter, updateDoc);
      console.log(result, filter, updateDoc);
      return res.send(result);
    });

    // update contact details
    app.put("/contacts/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: { user },
      };
      const result = await contactCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });

    // console.log("database connnected");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello contact management");
});

app.listen(port, () => {
  console.log(`contact managment app listening on port ${port}`);
});
