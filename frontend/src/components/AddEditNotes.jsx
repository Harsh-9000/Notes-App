import { useState } from "react"
import axios from "axios"
import { MdClose } from 'react-icons/md'
import { toast } from 'react-toastify';

const AddEditNotes = ({ noteData, type, getAllNotes, onClose }) => {
    const [title, setTitle] = useState(noteData?.title || "");
    const [content, setContent] = useState(noteData?.content || "");
    const [error, setError] = useState([]);

    const addNewNote = async () => {
        try {
            const response = await axios.post("/add-note", {
                title,
                content
            });

            if (response.data && response.data.note) {
                getAllNotes();
                onClose();
                toast.success("Note added successfully!");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message)
            }
        }
    }

    const editNote = async () => {
        try {
            const response = await axios.put("/edit-note/" + noteData._id, {
                title,
                content
            });

            if (response.data && response.data.note) {
                getAllNotes();
                onClose();
                toast.success("Note updated successfully!");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message)
            }
        }
    }

    const handleAddNote = () => {
        if (!title) {
            setError("Please enter the title");
            return;
        }

        if (!content) {
            setError("Please enter the content");
            return;
        }

        setError("");

        if (type === 'edit') {
            editNote()
        } else {
            addNewNote()
        }
    }

    return (
        <div className="relative">
            <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50" onClick={onClose}>
                <MdClose className="text-xl text-slate-400" />
            </button>

            <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400">Title</label>
                <input
                    type="text"
                    className="text-2xl text-slate-950 outline-none"
                    placeholder="Title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />
            </div>

            <div className="flex flex-col gap-2 mt-4">
                <label className="text-xs text-slate-400">Content</label>
                <textarea
                    type="text"
                    className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
                    placeholder="Content"
                    rows={10}
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                />
            </div>

            {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

            <button
                className="w-full text-sm bg-primary text-white rounded my-1 hover:bg-yellow-500 font-medium mt-5 p-3"
                onClick={handleAddNote}
            >
                {type === "edit" ? 'Update' : 'Add'}
            </button>
        </div>
    )
}

export default AddEditNotes