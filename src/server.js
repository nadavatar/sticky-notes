const express = require("express");
const mongo = require("mongodb").MongoClient;
const app = express();

let stickyNotes = [];

//mongodb get all sticky notes
const mongoUrl = "mongodb://localhost:27017";
mongo.connect(mongoUrl, { useNewUrlParser: true }, async function(
  err,
  connection
) {
  if (err) {
    console.error(err);
  } else {
    console.log("Succesfully connected to the database");
    const db = connection.db("stickyNotes");
    const stickyNotesCollection = db.collection("stickyNotes");
    stickyNotes = await stickyNotesCollection.find({}).toArray();
  }
  connection.close();
});

console.log(stickyNotes);

app.use(express.static("./src/public"));

app.get("/sticky-notes", (req, res) => {
  console.log("Got a request for sticky notes");
  res.json(stickyNotes);
});

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
