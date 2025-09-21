import { useState } from "react";
import { MdTitle } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";
import { auth } from "../lib/auth";
import { NOTE_COLORS } from "../constants/notes.constants";
import { apiService } from "../lib/api";

interface FormData {
  title: string;
  notes: string;
}

const AddNotesModal = ({
  setToggle,
}: {
  setToggle: (value: boolean) => void;
}) => {
  const [form, setForm] = useState<FormData>({
    title: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!auth.isAuthenticated()) {
      setError("Please log in to create notes.");
      setIsLoading(false);
      return;
    }

    try {
      await apiService.createNote({
        title: form.title,
        content: form.notes,
        color: NOTE_COLORS[Math.floor(Math.random() * 3)],
        date: new Date().toISOString(),
      });

      setToggle(false);
      // Trigger a refresh by reloading the page or using a callback
      window.location.reload();
    } catch (error) {
      console.error("Error creating note:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create note"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900 text-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-lg md:max-w-2xl border border-gray-800 relative flex flex-col"
      style={{
        maxHeight: "90vh",
        height: "calc(100vh - 2rem)",
      }}
    >
      {/* Close Button */}
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition cursor-pointer z-10"
        onClick={() => setToggle(false)}
        aria-label="Close modal"
        disabled={isLoading}
      >
        <IoMdClose size={24} />
      </button>

      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-center text-white pt-4 pb-2 px-4">
        Create a New Note
      </h2>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        className="flex flex-col flex-1 overflow-hidden px-4 pb-4"
        onSubmit={handleSubmit}
      >
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MdTitle className="text-gray-400" />
          </div>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition"
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex-1 min-h-0 overflow-hidden mb-4">
          <textarea
            name="notes"
            placeholder="Take notes here..."
            value={form.notes}
            onChange={handleChange}
            className="w-full h-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition resize-none"
            required
            disabled={isLoading}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-gray-700 text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
            onClick={() => setToggle(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddNotesModal;
