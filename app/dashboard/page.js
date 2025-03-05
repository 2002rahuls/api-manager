"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import CreateKeyModal from "../components/CreateKeyModal";

export default function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState(new Set());
  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: "test",
      key: "ak_••••••••••",
      actualKey: "ak_ra2qgqz1p",
      usage: 0,
    },
    {
      id: 2,
      name: "tmp1",
      key: "tvly-•••••••••••••••••••••••••••••",
      actualKey: "tvly-987654321zyxwvutsrqponmlkjih",
      monthlyLimit: 1000,
      usage: 0,
    },
    {
      id: 3,
      name: "my-cool-api-key",
      key: "tvly-•••••••••••••••••••••••••••••",
      actualKey: "tvly-abcdef123456789ghijklmnopqrst",
      monthlyLimit: 1000,
      usage: 0,
    },
    {
      id: 4,
      name: "hello",
      key: "tvly-•••••••••••••••••••••••••••••",
      actualKey: "tvly-hello123456789abcdefghijklmno",
      monthlyLimit: 1000,
      usage: 0,
    },
    {
      id: 5,
      name: "cursor",
      key: "tvly-•••••••••••••••••••••••••••••",
      actualKey: "tvly-cursor123456789abcdefghijklmn",
      monthlyLimit: 1000,
      usage: 0,
    },
  ]);

  const handleCreateKey = (data) => {
    const newKey = {
      id: Date.now(),
      name: data.name,
      key: "ak_••••••••••",
      actualKey: `ak_${Math.random().toString(36).substr(2, 8)}`,
      usage: 0,
    };
    setApiKeys([...apiKeys, newKey]);
    toast.success("API key created successfully");
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  const handleDeleteKey = (id) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
    toast.success("API key deleted successfully");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <span className="status-badge operational">Operational</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            className="text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a
            href="https://twitter.com"
            className="text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a
            href="mailto:support@example.com"
            className="text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </a>
        </div>
      </div>

      <div className="plan-card mb-8">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-white/80 text-sm font-medium mb-1">
                CURRENT PLAN
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Researcher</h2>
              <div className="flex items-center gap-1">
                <span className="text-sm text-white/90">API Limit</span>
              </div>
            </div>
            <button className="text-sm bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors">
              Manage Plan
            </button>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: "2.4%" }} />
          </div>
          <div className="text-sm text-white/90 mt-2">24/1,000 Requests</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary inline-flex items-center"
          >
            <span className="mr-2">+</span>
            Create new key
          </button>
        </div>
        <p className="text-gray-600">
          The key is used to authenticate your requests to the Research API. To
          learn more, see the documentation page.
        </p>
      </div>

      <div className="api-keys-table">
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>USAGE</th>
              <th>KEY</th>
              <th className="text-right">OPTIONS</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((apiKey) => (
              <tr key={apiKey.id}>
                <td>{apiKey.name}</td>
                <td>{apiKey.usage}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <code className="api-key flex-1">
                      {revealedKeys.has(apiKey.id)
                        ? apiKey.actualKey
                        : apiKey.key}
                    </code>
                    <button
                      onClick={() => {
                        setRevealedKeys((prev) => {
                          const newSet = new Set(prev);
                          if (newSet.has(apiKey.id)) {
                            newSet.delete(apiKey.id);
                          } else {
                            newSet.add(apiKey.id);
                          }
                          return newSet;
                        });
                      }}
                      className="action-button"
                      title={
                        revealedKeys.has(apiKey.id)
                          ? "Hide API Key"
                          : "Show API Key"
                      }
                    >
                      {revealedKeys.has(apiKey.id) ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          className="h-4 w-4"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
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
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() =>
                        handleCopyKey(
                          revealedKeys.has(apiKey.id)
                            ? apiKey.actualKey
                            : apiKey.key
                        )
                      }
                      className="action-button"
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
                    <button className="action-button" title="Edit API Key">
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
                      className="action-button"
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
      </div>

      <CreateKeyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateKey}
      />
    </div>
  );
}
