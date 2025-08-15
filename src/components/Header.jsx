import { Trash2, Moon, Sun, Laptop, ChevronDown } from "lucide-react";
import logo from "../assets/logo.png";
import { useState, useEffect } from "react";

function Header({ dark, setDark, clearNotes, search, setSearch }) {
  const [themeMenu, setThemeMenu] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "system"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
      setDark(false);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      document.documentElement.classList.toggle("dark", prefersDark);
      setDark(prefersDark);
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between p-4 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} className="w-10 mt-2" alt="Logo" />
          <h1 className="text-2xl font-semibold text-gray-600 dark:text-white">
            notesAPK
          </h1>
        </div>

        {/* Search */}
        <div className="flex-1 md:flex-none w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400 transition"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-end">
          {/* Clear Notes */}
          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear ALL notes? ")) {
                clearNotes();
              }
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 text-sm transition"
          >
            <Trash2 size={16} />
            Clear
          </button>

          {/* Theme Selector */}
          <div className="relative">
            <button
              onClick={() => setThemeMenu(!themeMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 text-sm transition"
            >
              {theme === "dark" ? (
                <Moon size={16} />
              ) : theme === "light" ? (
                <Sun size={16} />
              ) : (
                <Laptop size={16} />
              )}
              Theme <ChevronDown size={14} />
            </button>

            {themeMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-md z-50">
                {["system", "light", "dark"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setTheme(option);
                      setThemeMenu(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 w-full text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                      theme === option
                        ? "font-medium bg-gray-100 dark:bg-gray-700"
                        : ""
                    }`}
                  >
                    {option === "system" && <Laptop size={14} />}
                    {option === "light" && <Sun size={14} />}
                    {option === "dark" && <Moon size={14} />}
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
