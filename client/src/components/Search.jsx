// src/components/Search.jsx
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    if (onSearch) onSearch(query); // call parent handler
    setQuery(""); // clear input
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden w-72"
    >
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 px-4 py-2 text-gray-800 placeholder-gray-400 
                   focus:outline-none focus:ring-0 focus:border-gray-400"
      />
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 p-2 flex items-center justify-center rounded-r-lg"
      >
        <FaSearch size={16} className="text-white" />
      </button>
    </form>
  );
};

export default Search;
