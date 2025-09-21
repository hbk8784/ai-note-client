import { useState, useEffect } from "react";
import { truncateText } from "../helper/truncateText";
import NoteCard from "../components/NoteCard";
import { IoIosAddCircle } from "react-icons/io";
import AddNotesModal from "../modal/AddNotesModal";
import NavBar from "../components/NavBar";
import { motion } from "framer-motion";
import { apiService } from "../lib/api";
import { auth } from "../lib/auth";
import toast from "react-hot-toast";
import EditNotesModel from "../modal/EditNotesModal";
import SummaryModel from "../modal/SummaryModal";

interface Note {
  _id: string;
  title: string;
  content: string;
  color: string;
  date: string;
}

const NotesPage = () => {
  const [toggle, setToggle] = useState(false);
  const [editToggle, setEditToggle] = useState(false);
  const [summeryToggle, setSummeryToggle] = useState(false);
  const [summary, setSummery] = useState("");
  const [editInfo, setEditInfo] = useState({ id: "", notes: "", title: "" });
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Logging from edit info use effect", editInfo);
    console.log("this is notes", notes);
    if (editInfo.id) {
      setEditToggle(true);
    }
  }, [editInfo]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!auth.isAuthenticated()) {
        console.error("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const response = (await apiService.getNotes()) as {
          notes: Note[];
        };
        setNotes(response.notes || []);
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast.error("Failed to fetch notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [toggle, editToggle]);

  async function handleSummeryBtn(content: string): Promise<void> {
    try {
      const response = (await apiService.generateSummary(content)) as {
        summary: string;
      };
      setSummery(() => {
        setSummeryToggle(true);
        return response.summary;
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("Failed to generate summary");
    }
  }

  async function handleDelete(id: string): Promise<void> {
    const confirm = window.confirm("Are you sure you want to delete?");

    if (confirm) {
      try {
        await apiService.deleteNote(id);
        console.log("Deleted note");
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
        toast.success("Note deleted successfully");
      } catch (error) {
        console.error("Error deleting note:", error);
        toast.error("Failed to delete note");
      }
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black min-h-screen relative">
      {/* NavBar */}
      <NavBar />

      {/* Add New Notes Modal */}
      {toggle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center">
          <AddNotesModal setToggle={setToggle} />
        </div>
      )}

      {editToggle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center">
          <EditNotesModel
            setEditToggle={setEditToggle}
            id={editInfo.id}
            title={editInfo.title}
            notes={editInfo.notes}
          />
        </div>
      )}

      {summeryToggle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center">
          <SummaryModel setSummeryToggle={setSummeryToggle} content={summary} />
        </div>
      )}

      {/* Notes Grid */}
      <main className="p-4 mt-20 relative z-10">
        {loading ? (
          <div className="text-center text-emerald-400">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="text-center text-emerald-400">
            No notes yet. Create your first note!
          </div>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            {notes.map((note) => {
              const truncatedContent = truncateText(note.content, 30);
              const date = note.date.split("T")[0];
              return (
                <NoteCard
                  key={note._id}
                  id={note._id}
                  date={date}
                  truncatedContent={truncatedContent}
                  color={note.color}
                  title={note.title}
                  content={note.content}
                  handleSummeryBtn={handleSummeryBtn}
                  handleDelete={handleDelete}
                  setEditInfo={setEditInfo}
                />
              );
            })}
          </motion.section>
        )}
      </main>

      {/* Floating Add Note Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="fixed right-6 bottom-6 z-40 group"
      >
        <IoIosAddCircle
          size="52px"
          className="cursor-pointer text-emerald-400 group-hover:text-emerald-500 transition-all duration-300 drop-shadow-lg group-hover:drop-shadow-[0_0_15px_rgba(52,211,153,0.9)]"
          title="Add New Note"
          onClick={() => setToggle(true)}
        />
      </motion.div>
    </div>
  );
};

export default NotesPage;
