import { FaRegUser } from "react-icons/fa";
import { auth } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const NavBar = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function checkClicked(e: MouseEvent) {
      if (logoRef.current && !logoRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("click", checkClicked);
    return () => document.removeEventListener("click", checkClicked);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <header className="bg-gray-900 px-6 py-4 shadow-md flex items-center justify-between text-emerald-400">
      <div className="text-xl font-semibold">AI NoteBook</div>

      <div className="relative" ref={logoRef}>
        <div
          className="w-10 h-10 rounded-full cursor-pointer border-2 border-emerald-400 flex justify-center items-center"
          onClick={handleToggle}
        >
          <FaRegUser />
        </div>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-32 text-gray-800 shadow-lg rounded-sm transition-opacity duration-200 z-50">
            <button
              className="block w-full text-left px-4 py-2 bg-white rounded-sm disabled:opacity-50"
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
