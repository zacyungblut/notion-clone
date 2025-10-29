import React from "react";

interface AddImageFormProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const AddImageForm: React.FC<AddImageFormProps> = ({
  url,
  onUrlChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 p-4 min-w-[300px]">
      <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
        Add Image
      </div>
      <input
        type="text"
        placeholder="Paste image URL..."
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit();
          } else if (e.key === "Escape") {
            onCancel();
          }
        }}
        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        autoFocus
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors">
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={!url.trim()}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Add Image
        </button>
      </div>
    </div>
  );
};

export default AddImageForm;
