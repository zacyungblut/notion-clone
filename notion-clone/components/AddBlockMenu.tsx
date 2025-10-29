import React from "react";

interface AddBlockMenuProps {
  onSelectText: (style: "h1" | "h2" | "h3" | "p") => void;
  onSelectImage: () => void;
}

const AddBlockMenu: React.FC<AddBlockMenuProps> = ({
  onSelectText,
  onSelectImage,
}) => {
  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 py-1 min-w-[200px]">
      <div className="px-3 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-700">
        Basic blocks
      </div>

      {/* Text Option */}
      <button
        onClick={() => onSelectText("p")}
        className="w-full px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
        <span className="text-lg">T</span>
        <span>Text</span>
      </button>

      {/* H1 Option */}
      <button
        onClick={() => onSelectText("h1")}
        className="w-full px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
        <span className="text-lg font-bold">H1</span>
        <span>Heading 1</span>
        <span className="ml-auto text-xs text-zinc-400">#</span>
      </button>

      {/* H2 Option */}
      <button
        onClick={() => onSelectText("h2")}
        className="w-full px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
        <span className="text-lg font-semibold">H2</span>
        <span>Heading 2</span>
        <span className="ml-auto text-xs text-zinc-400">##</span>
      </button>

      {/* H3 Option */}
      <button
        onClick={() => onSelectText("h3")}
        className="w-full px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
        <span className="text-lg font-medium">H3</span>
        <span>Heading 3</span>
        <span className="ml-auto text-xs text-zinc-400">###</span>
      </button>

      {/* Image Option */}
      <button
        onClick={onSelectImage}
        className="w-full px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>Image</span>
      </button>
    </div>
  );
};

export default AddBlockMenu;
