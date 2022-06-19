const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

const PORT = process.env.PORT || 3001;

const app = express();

const readFile = util.promisify(fs.readFile);

const writeFile = (db, notes) =>
  fs.writeFile(db, JSON.stringify(notes),
  () => console.info(`Data written to ${db}`)
  );
  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Get request for saved notes
app.get("/api/notes", (req, res) =>
    readFile("./db/db.json")
    
    .then((data) => 
        res.json(JSON.parse(data))
));

//Post request for new notes
app.post("/api/notes", (req, res) => {
    const newNote = req.body
    readFile("./db/db.json")
    
    .then((data)=>{
        newNote.id = Math.random();
        const noteStored = JSON.parse(data);
        noteStored.push(newNote)
        return noteStored
    })
    .then((data) => {
        writeFile("./db/db.json", data)
        res.json('Note added')
    })
});


// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//Wild card get route
//Wildcard get route
app.get("*", (req,res)=>
  res.sendFile(path.join(__dirname,'/public/index.html'))
)

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);