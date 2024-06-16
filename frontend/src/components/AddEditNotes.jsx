import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MdClose } from 'react-icons/md';

const AddEditNotes = ({ noteData, type, getAllNotes, onClose, handleShowToast }) => {
    const [title, setTitle] = useState(noteData?.title || "");
    const [content, setContent] = useState(noteData?.content || "");
    const [error, setError] = useState("");
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.height = "auto";
            contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
        }
    }, [content]);

    const addNewNote = async () => {
        try {
            const response = await axios.post("/add-note", {
                title,
                content
            });

            if (response.data && response.data.note) {
                handleShowToast("Note Added Successfully")
                getAllNotes();
                onClose();
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
        }
    };

    const editNote = async () => {
        try {
            const response = await axios.put("/edit-note/" + noteData._id, {
                title,
                content
            });

            if (response.data && response.data.note) {
                handleShowToast("Note Updated Successfully")
                getAllNotes();
                onClose();
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
        }
    };

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
            editNote();
        } else {
            addNewNote();
        }
    };

    return (
        <div className="relative max-h-full overflow-hidden">
            <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3" onClick={onClose}>
                <MdClose className="text-xl text-slate-400 hover:text-retroWhite" />
            </button>

            <div className="flex flex-col gap-2 mt-7 relative">
                <label className="text-xl text-retroWhite absolute -top-3 left-6 bg-black px-1 uppercase" style={{ textShadow: '0px 2px 14px rgba(255, 255, 255, 0.7)' }}>Title</label>
                <input
                    type="text"
                    className="text-2xl text-retroWhite outline-none px-2 py-4 bg-black w-full border-2"
                    style={{ textShadow: '0px 2px 14px rgba(255, 255, 255, 0.7)', boxShadow: '0px 2px 5px rgba(255, 255, 255, 0.7)' }}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />
            </div>

            <div className="flex flex-col gap-2 mt-7 relative" style={{ textShadow: '0px 2px 14px rgba(255, 255, 255, 0.7)' }}>
                <label className="text-xl text-retroWhite absolute -top-3 left-6 bg-black px-1 uppercase">Content</label>
                <textarea
                    ref={contentRef}
                    className="text-md text-retroWhite outline-none bg-black px-2 py-4 border-2"
                    style={{
                        height: "auto",
                        overflowY: "hidden",
                        resize: "none",
                        textShadow: '0px 2px 14px rgba(255, 255, 255, 0.7)',
                        boxShadow: '0px 2px 5px rgba(255, 255, 255, 0.7)'
                    }}
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                />
            </div>

            {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

            <button
                className="w-full text-sm bg-black border-2 text-retroWhite rounded my-1 hover:bg-retroWhite hover:text-black font-medium mt-5 p-3"
                onClick={handleAddNote}
            >
                {type === "edit" ? 'Update' : 'Add'}
            </button>
        </div>
    );
}

export default AddEditNotes;
