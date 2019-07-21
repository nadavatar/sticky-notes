const express = require("express");
const app = express();
app.use(express.json())
//Mongodb settings
const mongo = require("mongodb").MongoClient;
const mongoUrl = "mongodb://localhost:27017/";


let stickyNotes = [];

app.use(express.static("./src/public"));

//gets the sticky notes from the server
function getStickyNotesFromMongo() {
  mongo.connect(mongoUrl, function (err, client) {
    if (err) throw err;

    const db = client.db("stickyNotes");
    db.collection("stickyNotes").find({}).toArray(function (err, result) {
      if (err) throw err;

      result.forEach((document) => {
        delete document["_id"];
        stickyNotes.push(document);
      })

      client.close();
    })
  })
}

//adds a sticky note to the server
function addStickyNoteToServer(id, content) {
  mongo.connect(mongoUrl, function (err, client) {
    if (err) throw err;

    const db = client.db("stickyNotes");
    const document = {
      content: content,
      id: id
    };
    db.collection("stickyNotes").insertOne(document, function (err, res) {
      if (err) throw err;
      console.log(`document number ${id} was added to the db!`);
      client.close();
    })


  })
  getStickyNotesFromMongo();
}

//get the sticky notes from mongodb when the application starts
getStickyNotesFromMongo();

//call from the frontend to get the sticky notes from the db
app.get("/getStickyNotes", (req, res) => {
  console.log("Got a request for sticky notes");
  res.json(stickyNotes);
});

app.post("/addStickyNote", (req, res) => {
  console.log("Got a request to add a sticky note");

  const mongoDocument = req.body;
  const id = mongoDocument.id;
  const content = mongoDocument.content;

  addStickyNoteToServer(id, content);
})

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});