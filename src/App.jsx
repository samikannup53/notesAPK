import React, { useEffect, useState } from "react";
import NoteForm from "./components/NoteForm";
import NoteCard from "./components/NoteCard";
import Header from "./components/Header";
import { Eye, Pin, Archive, Trash2, Search } from "lucide-react";

function App() {
  const [notes, setNotes] = useState(() => {
    return JSON.parse(localStorage.getItem("notes")) || [];
  });
  const [search, setSearch] = useState("");
  const [view, setView] = useState("all");
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const updateNote = (idOrUpdater, updatedFields) => {
    setNotes((prev) => {
      let updated;

      if (typeof idOrUpdater === "function") {
        // Functional update like delete forever
        updated = idOrUpdater(prev);
      } else {
        // Normal update by ID
        updated = prev.map((note) =>
          note.id === idOrUpdater ? { ...note, ...updatedFields } : note
        );
      }

      localStorage.setItem("notes", JSON.stringify(updated));
      return updated;
    });
  };

  const saveNote = (note) => {
    if (note.id) {
      updateNote(note.id, note);
    } else {
      const newNote = {
        ...note,
        id: Date.now(),
        pinned: false,
        archived: false,
        trashed: false,
      };
      setNotes((prev) => [newNote, ...prev]);
      localStorage.setItem("notes", JSON.stringify([newNote, ...notes]));
    }
    setEditingNote(null);
  };

  const clearNotes = () => {
    setNotes([]);
    localStorage.removeItem("notes");
  };

  // Filter notes based on view
  const filteredNotes = notes
    .filter((note) => {
      if (view === "trash") return note.trashed;
      if (view === "archived") return note.archived && !note.trashed;
      if (view === "pinned")
        return note.pinned && !note.archived && !note.trashed;
      return !note.trashed && !note.archived; // "all" view
    })
    .filter((note) => {
      const term = search.trim().toLowerCase();
      if (!term) return true; // No search → keep all in current view
      return (
        (note.title || "").toLowerCase().includes(term) ||
        (note.description || "").toLowerCase().includes(term)
      );
    })
    .sort((a, b) => b.pinned - a.pinned);

  const noResults = filteredNotes.length === 0 && search.trim() !== "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white transition-colors duration-300">
      <Header
        dark={dark}
        setDark={setDark}
        clearNotes={clearNotes}
        search={search}
        setSearch={setSearch}
      />

      <main className="p-4 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Sidebar / Form */}
        <div className="lg:w-1/3 w-full sticky top-24 z-10">
          <NoteForm
            saveNote={saveNote}
            editingNote={editingNote}
            setEditingNote={setEditingNote}
          />

          {/* Views */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { name: "all", icon: <Eye size={16} /> },
              { name: "pinned", icon: <Pin size={16} /> },
              { name: "archived", icon: <Archive size={16} /> },
              { name: "trash", icon: <Trash2 size={16} /> },
            ].map((v) => (
              <button
                key={v.name}
                onClick={() => setView(v.name)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full transition capitalize text-sm font-medium ${
                  view === v.name
                    ? "bg-blue-600 dark:bg-blue-500 text-white shadow"
                    : "bg-blue-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-blue-200 dark:hover:bg-gray-700"
                }`}
              >
                {v.icon} {v.name}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        <div className="lg:w-2/3 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[75vh] p-2 bg-gray-100 dark:bg-gray-800 rounded-lg custom-scroll border border-gray-200 dark:border-yellow-400">
          {filteredNotes.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center mt-16 text-center text-gray-500 dark:text-gray-400">
              {noResults ? (
                <>
                  <Search className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
                  <h3 className="text-lg font-semibold mb-1">
                    No results found
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Try adjusting your search terms.
                  </p>
                </>
              ) : (
                <>
                  {view === "all" && (
                    <>
                      <Eye className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
                      <h3 className="text-lg font-semibold mb-1">
                        No notes found
                      </h3>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        You don't have any notes yet. Start by adding a new
                        note!
                      </p>
                    </>
                  )}
                  {view === "pinned" && (
                    <>
                      <Pin className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
                      <h3 className="text-lg font-semibold mb-1">
                        No pinned notes
                      </h3>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Pin important notes to see them here.
                      </p>
                    </>
                  )}
                  {view === "archived" && (
                    <>
                      <Archive className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
                      <h3 className="text-lg font-semibold mb-1">
                        Nothing archived
                      </h3>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Archived notes will appear here.
                      </p>
                    </>
                  )}
                  {view === "trash" && (
                    <>
                      <Trash2 className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
                      <h3 className="text-lg font-semibold mb-1">
                        Trash is empty
                      </h3>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Deleted notes will appear here.
                      </p>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                updateNote={updateNote}
                setEditingNote={setEditingNote}
                view={view}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
