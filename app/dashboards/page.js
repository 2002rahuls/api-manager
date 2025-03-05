"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState("");

  const createApiKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name");
      return;
    }

    const newKey = {
      id: Date.now(),
      name: newKeyName,
      key: `ak_${Math.random().toString(36).substring(2, 11)}`,
      created: new Date().toISOString(),
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    toast.success("API key created successfully");
  };

  const updateKeyName = (id, newName) => {
    if (!newName.trim()) {
      toast.error("Please enter a key name");
      return;
    }

    setApiKeys(
      apiKeys.map((key) => (key.id === id ? { ...key, name: newName } : key))
    );
    toast.success("API key name updated");
  };

  const deleteApiKey = (id) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
    toast.success("API key deleted");
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("API key copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy API key");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          API Key Management
        </h1>

        {/* Create New Key Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Create New API Key
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Enter key name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={createApiKey}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Key
            </button>
          </div>
        </div>

        {/* API Keys List */}
        {apiKeys.map((key) => (
          <div key={key.id} className="bg-white rounded-lg shadow-sm p-6 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {key.name}
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-gray-600">API Key:</span>
                  <code className="text-gray-800 font-mono">{key.key}</code>
                  <button
                    onClick={() => copyToClipboard(key.key)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newName = prompt("Enter new name", key.name);
                    if (newName) updateKeyName(key.id, newName);
                  }}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete this API key?")
                    ) {
                      deleteApiKey(key.id);
                    }
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {apiKeys.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No API keys found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
