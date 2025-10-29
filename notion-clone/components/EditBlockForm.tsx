import React from "react";
import { Block } from "../api";

interface EditBlockFormProps {
  block: Block;
  editContent: string;
  editStyle: "h1" | "h2" | "h3" | "p";
  editImageUrl: string;
  editImageWidth: number;
  editImageHeight: number;
  onContentChange: (content: string) => void;
  onStyleChange: (style: "h1" | "h2" | "h3" | "p") => void;
  onImageUrlChange: (url: string) => void;
  onImageWidthChange: (width: number) => void;
  onImageHeightChange: (height: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const EditBlockForm: React.FC<EditBlockFormProps> = ({
  block,
  editContent,
  editStyle,
  editImageUrl,
  editImageWidth,
  editImageHeight,
  onContentChange,
  onStyleChange,
  onImageUrlChange,
  onImageWidthChange,
  onImageHeightChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 p-4 min-w-[350px]">
      <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
        Edit {block.type === "text" ? "Text" : "Image"} Block
      </div>

      {block.type === "text" ? (
        <>
          {/* Style Selector */}
          <div className="mb-3">
            <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2">
              Text Style
            </label>
            <select
              value={editStyle}
              onChange={(e) =>
                onStyleChange(e.target.value as "h1" | "h2" | "h3" | "p")
              }
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="p">Text</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
            </select>
          </div>

          {/* Content Editor */}
          <div className="mb-3">
            <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2">
              Content
            </label>
            <textarea
              placeholder="Edit your content..."
              value={editContent}
              onChange={(e) => onContentChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  onSubmit();
                } else if (e.key === "Escape") {
                  onCancel();
                }
              }}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
              autoFocus
            />
          </div>
        </>
      ) : (
        <>
          {/* Image URL Editor */}
          <div className="mb-3">
            <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2">
              Image URL
            </label>
            <input
              type="text"
              placeholder="Paste image URL..."
              value={editImageUrl}
              onChange={(e) => onImageUrlChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSubmit();
                } else if (e.key === "Escape") {
                  onCancel();
                }
              }}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Image Dimensions */}
          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2">
                Width (px)
              </label>
              <input
                type="number"
                placeholder="Width"
                value={editImageWidth}
                onChange={(e) => onImageWidthChange(Number(e.target.value))}
                min="50"
                max="2000"
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2">
                Height (px)
              </label>
              <input
                type="number"
                placeholder="Height"
                value={editImageHeight}
                onChange={(e) => onImageHeightChange(Number(e.target.value))}
                min="50"
                max="2000"
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </>
      )}

      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors">
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={
            block.type === "text" ? !editContent.trim() : !editImageUrl.trim()
          }
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditBlockForm;
