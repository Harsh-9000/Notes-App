import { useEffect, useState } from "react";
import AddEditNotes from "../components/AddEditNotes";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import Modal from 'react-modal';
import { MdAdd } from 'react-icons/md';
import axios from 'axios';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import Pagination from "../components/Pagination";
import Toast from "../components/Toast";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [showToastMessage, setShowTestMessage] = useState({
    isShown: false,
    message: "",
    type: "add"
  })
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false)
  const [showCursor, setShowCursor] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');

  const [text] = useTypewriter({
    words: ["no notes"],
    loop: 1,
  });

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const handleShowToast = (message, type) => {
    setShowTestMessage({
      isShown: true,
      message,
      type
    })
  }

  const handleCloseToast = () => {
    setShowTestMessage({
      isShown: false,
      message: "",
    })
  }

  const getAllNotes = async (page = 1) => {
    try {
      const response = await axios.get("get-all-notes", {
        params: { page, limit: 6 },
      });

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.", error);
    }
  };

  const deleteNote = async (data) => {
    try {
      const response = await axios.delete("/delete-note/" + data._id);

      if (response.data && !response.data.error) {
        handleShowToast("Note Deleted Successfully", "delete")
        getAllNotes();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.log("An unexpected error occurred. Please try again.", error);
      }
    }
  };

  const onSearchNote = async (searchQuery, page = 1) => {
    setQuery(searchQuery);
    try {
      const response = await axios.get("/search-notes", {
        params: { query: searchQuery, page, limit: 6 },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateIsPinned = async (noteData) => {
    try {
      const response = await axios.put("/update-note-pinned/" + noteData._id, {
        isPinned: !noteData.isPinned
      });

      if (response.data && response.data.note) {
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleClearSearch = () => {
    setIsSearch(false);
    setQuery('');
    getAllNotes();
  };

  const handlePageChange = (page) => {
    if (isSearch) {
      onSearchNote(query, page);
    } else {
      getAllNotes(page);
    }
  };

  useEffect(() => {
    getAllNotes();
    return () => { };
  }, []);

  useEffect(() => {
    if (text === "no notes") {
      setShowCursor(false);
    }
  }, [text]);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />

      <div className="container mx-auto flex-1 px-4">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {allNotes.map((note, index) => (
              <NoteCard
                key={`${note._id}-${note.title}-${note.content}-${note.updatedOn}`}
                title={note.title}
                date={note.updatedOn}
                content={note.content}
                isPinned={note.isPinned}
                onEdit={() => handleEdit(note)}
                onDelete={() => { deleteNote(note) }}
                onPinNote={() => updateIsPinned(note)}
                animationDelay={index * 100}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center" style={{ minHeight: 'calc(100vh - 90px)' }}>
            <div className="text-retroWhite text-2xl uppercase" style={{ textShadow: '0px 2px 14px rgba(255, 255, 255, 0.7)' }}>
              {isSearch ? "No Results" : text}
              {showCursor && <Cursor cursorStyle='_' cursorBlinking={true} />}
            </div>
          </div>
        )}


        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      <button
        className="w-14 h-14 flex items-center justify-center rounded-2xl bg-black hover:bg-retroWhite text-white hover:text-black fixed right-6 bottom-10 sm:right-4 sm:bottom-8"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px]" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
          content: {
            backgroundColor: "black",
            border: "2px solid rgba(255, 255, 255, 0.7)",
            maxWidth: "70%",
            maxHeight: "50%",
            overflowY: "auto",
            margin: "auto",
            marginTop: "27vh",
            padding: "20px",
            boxShadow: '0px 2px 6px rgba(255, 255, 255, 0.7)'
          }
        }}
        contentLabel=""
        className="lg:w-[40%] md:w-[60%] sm:w-[70%] max-h-3/4 bg-black border-2 mx-auto p-5 overflow-auto"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
          getAllNotes={getAllNotes}
          handleShowToast={handleShowToast}
        />
      </Modal>

      <Toast
        isShown={showToastMessage.isShown}
        message={showToastMessage.message}
        type={showToastMessage.type}
        onClose={handleCloseToast}
      />
    </div>
  );
}

export default Home;

