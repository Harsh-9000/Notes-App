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

        note.updatedOn = new Date().getTime();

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
    const { title, content, isPinned } = req.body;

    if (!title && !content) {
        return res.status(400).json({ error: true, message: "No changes provided" });
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

        if (isPinned) {
            note.isPinned = isPinned;
        }

        note.updatedOn = new Date().getTime();

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});


app.get("/get-all-notes", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    try {
        const notes = await Note.find()
            .sort({ isPinned: -1, updatedOn: -1 })
            .skip(skip)
            .limit(limit);
        const totalNotes = await Note.countDocuments();

        return res.json({
            error: false,
            notes,
            totalPages: Math.ceil(totalNotes / limit),
            currentPage: page,
            message: "All notes retrieved successfully"
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});

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

app.put("/update-note-pinned/:noteId", async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;

    try {
        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note pinned successfully"
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
})

app.get("/search-notes", async (req, res) => {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    if (!query) {
        return res.status(400).json({
            error: true,
            message: "Search query is required."
        });
    }

    try {
        const matchingNotes = await Note.find({
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } }
            ]
        })
            .skip(skip)
            .limit(limit);

        const totalNotes = await Note.countDocuments({
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } }
            ]
        });

        return res.json({
            error: false,
            notes: matchingNotes,
            totalPages: Math.ceil(totalNotes / limit),
            currentPage: page,
            message: "Notes matching the search query retrieved successfully"
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});

app.listen(8000)
console.log("Server running at http://localhost:8000");