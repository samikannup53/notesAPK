import { useState, useEffect } from "react";
import { FileText, AlignLeft, Tag, Plus, Palette, Pencil } from "lucide-react";

const colorOptions = ["green", "blue", "red", "yellow", "purple", "gray"];

function NoteForm({ saveNote, editingNote, setEditingNote }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [color, setColor] = useState("green");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setDescription(editingNote.description);
      setTags(editingNote.tags?.join(", ") || "");
      setColor(editingNote.color || "blue");
    }
  }, [editingNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and Description are required.");
      return;
    }

    const tagArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    saveNote({
      id: editingNote?.id,
      title,
      description,
      tags: tagArray,
      color,
    });

    setTitle("");
    setDescription("");
    setTags("");
    setColor("green");
    setError("");
    setSuccess(true);
    setEditingNote(null);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm space-y-5"
    >
      {/* Feedback */}
      {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
      {success && (
        <div className="text-green-500 text-sm font-medium">✅ Note Saved!</div>
      )}

      {/* Title */}
      <div className="relative">
        <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="pl-10 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:text-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400 focus:outline-none transition"
        />
      </div>

      {/* Description */}
      <div className="relative">
        <AlignLeft className="absolute left-3 top-3 text-gray-400" size={18} />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="pl-10 w-full p-2 border rounded-md resize-none bg-gray-50 dark:bg-gray-800 dark:text-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400 focus:outline-none transition"
          rows={4}
        ></textarea>
      </div>

      {/* Tags */}
      <div className="relative">
        <Tag className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="pl-10 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:text-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400 focus:outline-none transition"
        />
      </div>

      {/* Color Picker */}
      <div>
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-700 dark:text-gray-200">
          <Palette size={18} /> Choose a label color:
        </div>
        <div className="flex gap-2">
          {colorOptions.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 ${
                color === c ? "ring-2 ring-offset-1 ring-gray-400 dark:ring-white" : ""
              } transition`}
              style={{ backgroundColor: getColor(c) }}
            />
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 dark:bg-yellow-500 text-white hover:bg-blue-700 dark:hover:bg-yellow-400 transition text-sm"
        >
          {editingNote ? (
            <>
              <Pencil size={16} /> Update Note
            </>
          ) : (
            <>
              <Plus size={16} /> Add Note
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function getColor(color) {
  const map = {
    green: "#43A047",
    blue: "#3B82F6",
    red: "#EF4444",
    yellow: "#F59E0B",
    purple: "#8B5CF6",
    gray: "#6B7280",
  };
  return map[color] || "#43A047";
}

export default NoteForm;
