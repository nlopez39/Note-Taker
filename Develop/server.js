// Import Express.js
const express = require("express");
const path = require("path");
const fs = require("fs");
// Initialize an instance of Express.js
const app = express();
// Helper method for generating unique ids
const uuid = require("./helpers/uuid");

// Specify on which port the Express.js server will run
const PORT = 3001;

//static middleware pointing to the public folder
app.use(express.static("public"));
//requre the middleware for json body
app.use(express.json());
//create express.js routes for default '/' and other routes
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);
//make a get request to send the notes
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);
//this get request is to get the notes and read the db.json file and back the parsed JSON data
app.get("/api/notes", (req, res) => {
  //this just needs to read the db.json file
  fs.readFile(
    "/Users/nellylopez/bootcamp/homework/homework-11/Note-Taker/Develop/db/db.json",
    "utf8",
    (err, data) => {
      var jsonData = JSON.parse(data);
      console.log(jsonData);
      //respond with json data
      res.json(jsonData);
    }
  );

  //post request to add a review
  app.post("/api/notes", (req, res) => {
    //destructuer the note that was received
    const { title, text } = req.body;
    //if all the required properties are present
    if (text && title) {
      //create an object that will save a new note
      const newNote = {
        title,
        text,
        note_id: uuid(),
      };

      //obtain the existing notes
      fs.readFile(
        "/Users/nellylopez/bootcamp/homework/homework-11/Note-Taker/Develop/db/db.json",
        "utf8",
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            //convert string into JSON object
            const parsedNotes = JSON.parse(data);
            //makes it parsedNotes.title and parsedNotes.text
            //add a new note to the object you created earlier
            parsedNotes.push(newNote);

            //write updated review back to the file
            fs.writeFile(
              "/Users/nellylopez/bootcamp/homework/homework-11/Note-Taker/Develop/db/db.json",
              JSON.stringify(parsedNotes, null, 4),
              (writeErr) =>
                writeErr
                  ? console.error(writeErr)
                  : console.log("Successfully updated notes")
            );
          }
        }
      );

      const response = {
        status: "success",
        body: newNote,
      };

      res.json(response);
    } else {
      res.json("Error in posting new note");
    }
  });
});

//listen method is responsible for listening for incoming connections on the specfied port
app.listen(PORT, () =>
  console.log(`App is listening at http://localhost:${PORT}`)
);
