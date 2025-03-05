"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import CreateKeyModal from "./components/CreateKeyModal";
import EditKeyModal from "./components/EditKeyModal";
import ThemeToggle from "./components/ThemeToggle";
import SearchAndFilter from "./components/SearchAndFilter";
import EmptyState from "./components/EmptyState";
import UsageAnalytics from "./components/UsageAnalytics";
import ApiKeysSidebar from "./components/ApiKeysSidebar";
import { supabase } from "../lib/supabase";
//function to fetch api keys from supabase
export default function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [revealedKeys, setRevealedKeys] = useState(new Set());
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      toast.error("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (data) => {
    try {
      const newKey = {
        name: data.name,
        key: `stem-${Math.random().toString(36).substr(2, 15)}${Math.random()
          .toString(36)
          .substr(2, 15)}`,
        usage: 0,
        monthly_limit: data.monthlyLimit,
      };

      const { data: insertedKey, error } = await supabase
        .from("api_keys")
        .insert([newKey])
        .select()
        .single();

      if (error) throw error;

      setApiKeys([insertedKey, ...apiKeys]);
      toast.success(
        `API key "${data.name}" created ${
          data.monthlyLimit ? `with ${data.monthlyLimit} monthly limit` : ""
        }`,
        {
          style: {
            background: "#10B981",
            color: "#FFFFFF",
          },
          iconTheme: {
            primary: "#FFFFFF",
            secondary: "#10B981",
          },
          duration: 4000,
        }
      );
    } catch (error) {
      console.error("Error creating API key:", error);
      toast.error("Failed to create API key");
    }
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard", {
      icon: "📋",
      style: {
        background: "#10B981",
        color: "#FFFFFF",
      },
    });
  };

  const handleDeleteKey = async (id) => {
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span>Are you sure you want to delete this API key?</span>
          <button
            onClick={async () => {
              try {
                const { error } = await supabase
                  .from("api_keys")
                  .delete()
                  .eq("id", id);

                if (error) throw error;

                setApiKeys(apiKeys.filter((key) => key.id !== id));
                toast.dismiss(t.id);
                toast.error("API key deleted", {
                  style: {
                    background: "#EF4444",
                    color: "#FFFFFF",
                  },
                  iconTheme: {
                    primary: "#FFFFFF",
                    secondary: "#EF4444",
                  },
                });
              } catch (error) {
                console.error("Error deleting API key:", error);
                toast.error("Failed to delete API key");
              }
            }}
            className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      ),
      {
        duration: 5000,
        style: {
          background: "#FFFFFF",
          padding: "16px",
          color: "#1F2937",
        },
      }
    );
  };

  const handleToggleVisibility = (id) => {
    const isCurrentlyRevealed = revealedKeys.has(id);

    setRevealedKeys((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlyRevealed) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });

    toast(!isCurrentlyRevealed ? "API key revealed" : "API key hidden", {
      icon: "👁️",
      style: {
        background: "#10B981",
        color: "#FFFFFF",
      },
    });
  };

  const handleEditKey = (apiKey) => {
    setEditingKey(apiKey);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (newName) => {
    try {
      const { error } = await supabase
        .from("api_keys")
        .update({ name: newName })
        .eq("id", editingKey.id);

      if (error) throw error;

      setApiKeys((keys) =>
        keys.map((k) => (k.id === editingKey.id ? { ...k, name: newName } : k))
      );

      setIsEditModalOpen(false);
      setEditingKey(null);

      toast.success("API key name updated", {
        style: {
          background: "#10B981",
          color: "#FFFFFF",
        },
      });
    } catch (error) {
      console.error("Error updating API key:", error);
      toast.error("Failed to update API key");
    }
  };

  // Helper function to get masked key
  const getMaskedKey = (key) => {
    const prefix = key.slice(0, 4); // Keep first 4 characters
    const rest = key.slice(4).replace(/[^-]/g, "•"); // Mask the rest, preserving hyphens
    return prefix + rest;
  };

  // Add this new function to filter API keys
  const getFilteredKeys = () => {
    return apiKeys.filter((key) => {
      // Search term filter
      const matchesSearch = key.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Category filter
      let matchesFilter = true;
      switch (activeFilter) {
        case "with_limit":
          matchesFilter = key.monthly_limit !== null;
          break;
        case "no_limit":
          matchesFilter = key.monthly_limit === null;
          break;
        case "high_usage":
          matchesFilter = key.usage > 1000;
          break;
        case "low_usage":
          matchesFilter = key.usage <= 1000;
          break;
        default:
          matchesFilter = true;
      }

      return matchesSearch && matchesFilter;
    });
  };

  // Add these handlers for search and filter
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-primary transition-colors">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Overview
            </h1>
            <span className="px-2 py-1 text-sm font-medium text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded-full">
              Operational
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-text bg-gray-100 dark:bg-dark-muted rounded-lg hover:bg-gray-200 dark:hover:bg-dark-muted/80 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              View All Keys
            </button>
            <ThemeToggle />
            <a
              href="https://github.com"
              className="text-gray-600 dark:text-dark-text hover:text-gray-900 dark:hover:text-white"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              className="text-gray-600 dark:text-dark-text hover:text-gray-900 dark:hover:text-white"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-amber-500 dark:from-purple-800 dark:to-amber-700 rounded-xl mb-8 text-white">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-white/80 text-sm font-medium mb-1">
                  CURRENT PLAN
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Researcher
                </h2>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-white/90">API Limit</span>
                </div>
              </div>
              <button className="text-sm bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors">
                Manage Plan
              </button>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: "2.4%" }}
              />
            </div>
            <div className="text-sm text-white/90 mt-2">24/1,000 Requests</div>
          </div>
        </div>

        <UsageAnalytics apiKeys={apiKeys} />

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              API Keys
            </h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-black dark:bg-dark-accent text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-dark-accent/90 transition-colors inline-flex items-center"
            >
              <span className="mr-2">+</span>
              Create new key
            </button>
          </div>
          <p className="text-gray-600 dark:text-dark-text mb-4">
            The key is used to authenticate your requests to the Research API.
            To learn more, see the documentation page.
          </p>

          <SearchAndFilter
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="overflow-x-auto">
          {getFilteredKeys().length > 0 ? (
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-muted">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-dark-text">
                    NAME
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-dark-text">
                    USAGE
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-dark-text">
                    KEY
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-dark-text">
                    OPTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {getFilteredKeys().map((apiKey) => (
                  <tr
                    key={apiKey.id}
                    className="border-b border-gray-100 dark:border-dark-muted"
                  >
                    <td className="py-3 px-4 dark:text-dark-text">
                      {apiKey.name}
                    </td>
                    <td className="py-3 px-4 dark:text-dark-text">
                      {apiKey.usage}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <code className="font-mono bg-gray-100 dark:bg-dark-secondary px-2 py-1 rounded flex-1 dark:text-dark-text">
                          {revealedKeys.has(apiKey.id)
                            ? apiKey.key
                            : getMaskedKey(apiKey.key)}
                        </code>
                        <button
                          onClick={() => handleToggleVisibility(apiKey.id)}
                          className="p-1.5 text-gray-500 dark:text-dark-text hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-muted rounded transition-colors"
                        >
                          {revealedKeys.has(apiKey.id) ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              className="h-4 w-4"
                            >
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              className="h-4 w-4"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleCopyKey(apiKey.key)}
                          className="p-1.5 text-gray-500 dark:text-dark-text hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-muted rounded transition-colors"
                          title="Copy to clipboard"
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
                        <button
                          onClick={() => handleEditKey(apiKey)}
                          className="p-1.5 text-gray-500 dark:text-dark-text hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-muted rounded transition-colors"
                          title="Edit API Key"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteKey(apiKey.id)}
                          className="p-1.5 text-gray-500 dark:text-dark-text hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-muted rounded transition-colors"
                          title="Delete API Key"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState searchTerm={searchTerm} filter={activeFilter} />
          )}
        </div>

        <CreateKeyModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateKey}
        />

        <EditKeyModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingKey(null);
          }}
          onSave={handleSaveEdit}
          apiKey={editingKey}
        />

        <ApiKeysSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          apiKeys={apiKeys}
          revealedKeys={revealedKeys}
          onToggleVisibility={handleToggleVisibility}
          onCopyKey={handleCopyKey}
          onEditKey={handleEditKey}
          onDeleteKey={handleDeleteKey}
        />
      </div>
    </div>
  );
}
