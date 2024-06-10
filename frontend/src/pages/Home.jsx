import { useEffect, useState } from "react"
import AddEditNotes from "../components/AddEditNotes"
import Navbar from "../components/Navbar"
import NoteCard from "../components/NoteCard"
import Modal from 'react-modal'
import { MdAdd } from 'react-icons/md'
import axios from 'axios'
import { toast } from 'react-toastify';

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  })
  const [allNotes, setAllNotes] = useState([]);

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" })
  }

  const getAllNotes = async () => {
    try {
      const response = await axios.get("get-all-notes");

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.log("An unexpected error occured. PLease try again.", error);
    }
  }

  const deleteNote = async (data) => {
    try {
      const response = await axios.delete("/delete-note/" + data._id);

      if (response.data && !response.data.error) {
        getAllNotes();
        toast.success("Note deleted successfully!");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.log("An unexpected error occured. PLease try again.", error);
      }
    }
  }

  useEffect(() => {
    getAllNotes()
    return () => { }
  }, [])

  return (
    <>
      <Navbar />

      <div className="container mx-auto">
        {allNotes.length > 0 ? <div className="grid grid-cols-3 gap-4 mt-8">
          {allNotes.map((note, index) => (
            <NoteCard
              key={note._id}
              title={note.title}
              date={note.createdOn}
              content={note.content}
              onEdit={() => handleEdit(note)}
              onDelete={() => { deleteNote(note) }}
            />
          ))}
        </div> : (
          <div className="flex justify-center items-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
            <div className="text-slate-500">No Notes</div>
          </div>
        )}
      </div>

      <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-yellow-500 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </>
  )
}

export default Home