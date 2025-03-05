import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ApiKeysSidebar({
  isOpen,
  onClose,
  apiKeys,
  revealedKeys,
  onToggleVisibility,
  onCopyKey,
  onEditKey,
  onDeleteKey,
}) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-black/75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-dark-secondary shadow-xl">
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                          API Keys
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white dark:bg-dark-secondary text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative flex-1 px-4 sm:px-6">
                      <div className="space-y-4">
                        {apiKeys.map((apiKey) => (
                          <div
                            key={apiKey.id}
                            className="bg-gray-50 dark:bg-dark-primary rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                {apiKey.name}
                              </h3>
                              <span className="text-sm text-gray-500 dark:text-dark-text">
                                Usage: {apiKey.usage}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <code className="font-mono bg-white dark:bg-dark-secondary px-2 py-1 rounded flex-1 text-sm dark:text-dark-text">
                                {revealedKeys.has(apiKey.id)
                                  ? apiKey.key
                                  : apiKey.key.slice(0, 4) +
                                    "•••••••••••••••••••••••••••••"}
                              </code>
                              <button
                                onClick={() => onToggleVisibility(apiKey.id)}
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
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => onCopyKey(apiKey.key)}
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
                                onClick={() => onEditKey(apiKey)}
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
                                onClick={() => onDeleteKey(apiKey.id)}
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
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
