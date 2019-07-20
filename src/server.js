const express = require("express");
const app = express();
//Mongodb settings
const mongo = require("mongodb").MongoClient;
const mongoUrl = "mongodb://localhost:27017/";


let stickyNotes = [{
  content: "Some sticky note",
  id: 1
}, {
  content: "Another sticky note",
  id: 2
}];

app.use(express.static("./src/public"));

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

app.get("/sticky-notes", (req, res) => {
  console.log("Got a request for sticky notes");
  res.json(stickyNotes);
});

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});