import { useState } from "react";

export default function SearchAndFilter({ onSearch, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    onFilterChange(value);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilter("all");
    onSearch("");
    onFilterChange("all");
  };

  return (
    <div className="flex flex-wrap gap-4 items-center mb-4">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by key name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-muted rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-dark-primary dark:text-white"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-dark-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <select
        value={filter}
        onChange={handleFilterChange}
        className="px-4 py-2 border border-gray-300 dark:border-dark-muted rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-dark-primary dark:text-white"
      >
        <option value="all">All Keys</option>
        <option value="with_limit">With Usage Limit</option>
        <option value="no_limit">No Usage Limit</option>
        <option value="high_usage">High Usage</option>
        <option value="low_usage">Low Usage</option>
      </select>

      {(searchTerm || filter !== "all") && (
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 text-sm text-gray-600 dark:text-dark-text hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Clear filters
        </button>
      )}
    </div>
  );
}
