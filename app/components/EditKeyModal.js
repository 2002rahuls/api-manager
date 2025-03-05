import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function EditKeyModal({ isOpen, onClose, onSave, apiKey }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    if (name) {
      onSave(name);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 dark:bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-dark-secondary p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4"
                >
                  Edit API Key Name
                </Dialog.Title>
                <form onSubmit={handleSubmit}>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      defaultValue={apiKey?.name}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-muted rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-dark-primary dark:text-white"
                      placeholder="Enter new name"
                      autoComplete="off"
                    />
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-text bg-gray-100 dark:bg-dark-muted border border-transparent rounded-md hover:bg-gray-200 dark:hover:bg-dark-muted/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 dark:bg-dark-accent border border-transparent rounded-md hover:bg-purple-700 dark:hover:bg-dark-accent/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
