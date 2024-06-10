const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Note = require('./models/Note')

dotenv.config();

mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => {
        console.log('Connected to Database Successfully')
    })
    .catch((error) => {
        console.log('Database Connection Error: ' + error)
    })

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: "*"
    })
)

app.get("/", (req, res) => {
    res.send("test")
})

app.post("/add-note", async (req, res) => {
    const { title, content } = req.body;

    if (!title) {
        return res.status(400).json({ error: true, message: "Title is required" })
    }

    if (!content) {
        return res.status(400).json({ error: true, message: "Content is required" })
    }

    try {
        const note = new Note({
            title,
            content
        })

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully"
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})

app.put("/edit-note/:noteId", async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content } = req.body;

    if (!title && !content) {
        return res.status(400).json({ error: true, message: "No changes provided" })
    }

    try {
        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (title) {
            note.title = title;
        }

        if (content) {
            note.content = content;
        }

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully"
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})

app.get("/get-all-notes", async (req, res) => {
    try {
        const notes = await Note.find();

        return res.json({
            error: false,
            notes,
            message: "All notes retrieved successully"
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})

app.delete("/delete-note/:noteId", async (req, res) => {
    const noteId = req.params.noteId;

    try {
        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        await Note.deleteOne({ _id: noteId })

        return res.json({
            error: false,
            message: "Note deleted successully"
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})

app.listen(8000)
console.log("Server running at http://localhost:8000");