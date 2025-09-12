const express=require("express");
const fs= require("fs");
const path = require("path");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");


const app = express();
const PORT = 3000;

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));

liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });

app.use(connectLivereload()); 

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
const userFiles = path.join(__dirname, "user.json");
const noteFiles = path.join(__dirname, "notes.json")



app.get(["/notebook", "/notes"], (req, res) => {
    res.sendFile(path.join(__dirname, "public", "Notebook", "notes.html"));
});

app.get("/getNotes" , (req , res) => {
    if (fs.existsSync(noteFiles)) { 
        const data = fs.readFileSync(noteFiles);
        const notes= JSON.parse(data);
        res.json(notes);
    }

    else {res.json([])}
})

app.post("/delNote", (req , res) => {
    const id = req.body.id;
    let notes = [];

    if (fs.existsSync(noteFiles)) {
        const data = fs.readFileSync(noteFiles);
        notes = JSON.parse(data);

        notes = notes.filter( note => note.id !== id)

        fs.writeFileSync(noteFiles , JSON.stringify(notes, null , 2));
        res.status(201).json([]);
        console.log(`note ${id} has been deleted`)
    }
})

app.post("/editNote" , (req , res) => {
   const {nId, id , title , content , createTime} = req.body ;
    let notes = [];
    if (fs.existsSync(noteFiles)) {
        const data = fs.readFileSync(noteFiles);
        notes = JSON.parse(data)

        const newObj = {id: nId, title: title, content: content, createTime: createTime} ;
        const index = notes.findIndex(note => note.id ===id);
        if (index !== -1) { 
            notes[index] = newObj ;
        }

        fs.writeFileSync(noteFiles, JSON.stringify(notes , null , 2));
        res.status(200).json([]);
        console.log(`note ${id} has been edited`);
        console.log(newObj) ;
        
    }
})

app.post("/newNote", (req , res) => {
    const { title, content, createTime} = req.body ;
    let notes = [] ;

    if (fs.existsSync(noteFiles)) {
        const data = fs.readFileSync(noteFiles);
        notes = JSON.parse(data) ;

    }

    const newNote = { id: notes.length + 1 , title , content , createTime}; 
    notes.push(newNote) ;

    fs.writeFileSync(noteFiles, JSON.stringify(notes, null, 2));

    res.status(201).json(newNote);
    console.log(JSON.stringify(newNote));


})


app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}!`) ;
})