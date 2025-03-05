export default function EmptyState({ searchTerm, filter }) {
  return (
    <div className="text-center py-12">
      <div className="mb-4">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 dark:text-dark-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No API keys found
      </h3>
      <p className="text-gray-500 dark:text-dark-text max-w-sm mx-auto">
        {searchTerm
          ? `No API keys found matching "${searchTerm}". Try adjusting your search term.`
          : filter !== "all"
          ? `No API keys match the selected filter "${filter}". Try selecting a different filter.`
          : "No API keys found. Create your first API key to get started."}
      </p>
    </div>
  );
}
