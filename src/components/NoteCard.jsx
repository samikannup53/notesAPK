import { useState } from "react";
import {
  Pin,
  PinOff,
  Archive,
  ArchiveRestore,
  Trash2,
  Undo2,
  XCircle,
  Pencil,
  Tag,
} from "lucide-react";

const colorMap = {
  green: "#43A047",
  blue: "#3B82F6",
  red: "#EF4444",
  yellow: "#F59E0B",
  purple: "#8B5CF6",
  gray: "#6B7280",
};

function NoteCard({ note, updateNote, setEditingNote, view }) {
  const [showModal, setShowModal] = useState(false);

  const toggleField = (field) => updateNote(note.id, { [field]: !note[field] });
  const handleDeleteForever = () => {
    updateNote((prev) => prev.filter((n) => n.id !== note.id));
  };
  const handleRestore = () => updateNote(note.id, { trashed: false });
  const handleArchive = () => updateNote(note.id, { archived: !note.archived });

  const getButtons = () => {
    switch (view) {
      case "all":
      case "pinned":
        return [
          {
            icon: <Pencil size={16} />,
            action: () => setEditingNote(note),
            tooltip: "Edit",
          },
          {
            icon: <Trash2 size={16} />,
            action: () => toggleField("trashed"),
            tooltip: "Delete",
          },
          {
            icon: <Archive size={16} />,
            action: handleArchive,
            tooltip: "Archive",
          },
        ];
      case "archived":
        return [
          {
            icon: <ArchiveRestore size={16} />,
            action: handleArchive,
            tooltip: "Unarchive",
          },
          {
            icon: <Trash2 size={16} />,
            action: () => toggleField("trashed"),
            tooltip: "Delete",
          },
        ];
      case "trash":
        return [
          {
            icon: <Undo2 size={16} />,
            action: handleRestore,
            tooltip: "Restore",
          },
          {
            icon: <XCircle size={16} />,
            action: handleDeleteForever,
            tooltip: "Delete Forever",
          },
        ];
      default:
        return [];
    }
  };

  const renderTags = (tags, max = 2) => {
    if (!tags || tags.length === 0) return null;
    const visibleTags = tags.slice(0, max);
    const remaining = tags.length - visibleTags.length;
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {visibleTags.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-md text-white"
            style={{ backgroundColor: colorMap[note.color] || "#3B82F6" }}
          >
            <Tag size={12} /> {t}
          </span>
        ))}
        {remaining > 0 && (
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-gray-400 text-white">
            +{remaining}
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className="relative bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition cursor-pointer"
        style={{ width: "260px", height: "160px" }}
        onClick={() => setShowModal(true)}
      >
        {/* Title + Pin */}
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-800 dark:text-white truncate">
            {note.title}
          </h2>
          {view !== "trash" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleField("pinned");
              }}
              title={note.pinned ? "Unpin" : "Pin"}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
            >
              {note.pinned ? <PinOff size={16} /> : <Pin size={16} />}
            </button>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-200 text-sm mt-2 line-clamp-2">
          {note.description}
        </p>

        {/* Tags */}
        {renderTags(note.tags, 2)}

        {/* CTA Buttons */}
        <div className="flex justify-end gap-2 mt-3">
          {getButtons().map((btn, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                btn.action();
              }}
              title={btn.tooltip}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
            >
              {btn.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col transform transition-transform duration-300 scale-95 hover:scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                {note.title}
              </h2>
              {/* Pin button */}
              {view !== "trash" && (
                <button
                  onClick={() => toggleField("pinned")}
                  title={note.pinned ? "Unpin" : "Pin"}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  {note.pinned ? <PinOff size={20} /> : <Pin size={20} />}
                </button>
              )}
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4 overflow-y-auto flex-1 space-y-4">
              {/* Description */}
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                {note.description}
              </p>

              {/* Tags */}
              {note.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((t, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 text-xs px-3 py-1 rounded-full text-white font-medium"
                      style={{
                        backgroundColor: colorMap[note.color] || "#3B82F6",
                      }}
                    >
                      <Tag size={14} /> {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              {/* Icon Buttons (same as card) */}
              <div className="flex gap-2">
                {getButtons().map((btn, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      btn.action();
                      if (btn.tooltip === "Edit") setShowModal(false); // close modal on edit
                    }}
                    title={btn.tooltip}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    {btn.icon}
                  </button>
                ))}
              </div>

              {/* Close button at bottom-right */}
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-red-500 font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NoteCard;
