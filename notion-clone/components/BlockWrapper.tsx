"use client";

import React, { useState } from "react";
import { Block } from "../api";
import AddBlockMenu from "./AddBlockMenu";
import AddTextForm from "./AddTextForm";
import AddImageForm from "./AddImageForm";
import EditBlockForm from "./EditBlockForm";

interface BlockWrapperProps {
  block: Block;
  children: React.ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
  onAddBlock?: (
    type: "text" | "image",
    textStyle?: "h1" | "h2" | "h3" | "p",
    imageUrl?: string,
    textContent?: string
  ) => void;
  onEditBlock?: (blockId: string, updates: Partial<Block>) => void;
  onDeleteBlock?: (blockId: string) => void;
  onMoveBlock?: (blockId: string, direction: "up" | "down") => void;
}

const BlockWrapper: React.FC<BlockWrapperProps> = ({
  block,
  children,
  isFirst = false,
  isLast = false,
  onAddBlock,
  onEditBlock,
  onDeleteBlock,
  onMoveBlock,
}) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [selectedTextStyle, setSelectedTextStyle] = useState<
    "h1" | "h2" | "h3" | "p" | null
  >(null);
  const [imageUrl, setImageUrl] = useState("");
  const [textContent, setTextContent] = useState("");

  // Edit state
  const [editContent, setEditContent] = useState("");
  const [editStyle, setEditStyle] = useState<"h1" | "h2" | "h3" | "p">("p");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editImageWidth, setEditImageWidth] = useState(800);
  const [editImageHeight, setEditImageHeight] = useState(600);

  const handleSelectTextBlock = (textStyle: "h1" | "h2" | "h3" | "p") => {
    setSelectedTextStyle(textStyle);
    setShowTextInput(true);
  };

  const handleDeleteBlock = () => {
    const blockType = block.type === "text" ? "text" : "image";
    const blockPreview =
      block.type === "text"
        ? block.content?.substring(0, 50) || "this text block"
        : "this image block";

    const confirmed = window.confirm(
      `Are you sure you want to delete ${blockPreview}?`
    );

    if (confirmed && onDeleteBlock) {
      onDeleteBlock(block.id);
    }
  };

  const handleAddTextBlock = () => {
    if (selectedTextStyle && textContent.trim()) {
      console.log(
        `Adding ${selectedTextStyle} block with content: ${textContent}`
      );
      if (onAddBlock) {
        onAddBlock("text", selectedTextStyle, undefined, textContent);
      }
      setTextContent("");
      setSelectedTextStyle(null);
      setShowTextInput(false);
      setShowAddMenu(false);
    }
  };

  const handleCancelTextInput = () => {
    setTextContent("");
    setSelectedTextStyle(null);
    setShowTextInput(false);
  };

  const handleSelectImage = () => {
    setShowImageUrlInput(true);
  };

  const handleAddImageBlock = () => {
    if (imageUrl.trim()) {
      console.log(`Adding image block with URL: ${imageUrl}`);
      if (onAddBlock) {
        onAddBlock("image", undefined, imageUrl);
      }
      setImageUrl("");
      setShowImageUrlInput(false);
      setShowAddMenu(false);
    }
  };

  const handleCancelImageInput = () => {
    setImageUrl("");
    setShowImageUrlInput(false);
  };

  const handleOpenEditMenu = () => {
    // Pre-populate the edit form with current block data
    if (block.type === "text") {
      setEditContent(block.content || "");
      setEditStyle(block.textStyle || "p");
    } else if (block.type === "image") {
      setEditImageUrl(block.url || "");
      setEditImageWidth(block.imageWidth || 800);
      setEditImageHeight(block.imageHeight || 600);
    }
    setShowEditMenu(true);
  };

  const handleSaveEdit = () => {
    if (block.type === "text") {
      console.log(
        `Saving text block edit: ${editContent} with style ${editStyle}`
      );
      if (onEditBlock) {
        onEditBlock(block.id, {
          content: editContent,
          textStyle: editStyle,
        });
      }
    } else if (block.type === "image") {
      console.log(
        `Saving image block edit: ${editImageUrl} (${editImageWidth}x${editImageHeight})`
      );
      if (onEditBlock) {
        onEditBlock(block.id, {
          url: editImageUrl,
          imageWidth: editImageWidth,
          imageHeight: editImageHeight,
        });
      }
    }
    setShowEditMenu(false);
  };

  const handleCancelEdit = () => {
    setEditContent("");
    setEditStyle("p");
    setEditImageUrl("");
    setEditImageWidth(800);
    setEditImageHeight(600);
    setShowEditMenu(false);
  };

  const handleMoveUp = () => {
    if (!isFirst && onMoveBlock) {
      onMoveBlock(block.id, "up");
    }
  };

  const handleMoveDown = () => {
    if (!isLast && onMoveBlock) {
      onMoveBlock(block.id, "down");
    }
  };

  return (
    <div className="relative group">
      {/* Block Content */}
      {children}

      {/* Hover Controls */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 bg-white dark:bg-zinc-800 rounded-lg p-1 shadow-lg border border-zinc-200 dark:border-zinc-700">
        {/* Plus Icon - Add block below */}
        <button
          className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
          title="Add block below"
          onClick={() => setShowAddMenu(!showAddMenu)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-zinc-600 dark:text-zinc-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>

        {/* Pencil Icon - Edit block */}
        <button
          className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
          title="Edit block"
          onClick={handleOpenEditMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-zinc-600 dark:text-zinc-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>

        {/* Trash Icon - Delete block */}
        <button
          className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
          title="Delete block"
          onClick={handleDeleteBlock}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-zinc-600 dark:text-zinc-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>

        {/* Up Arrow - Move block up */}
        <button
          className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
          title="Move up"
          onClick={handleMoveUp}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-zinc-600 dark:text-zinc-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>

        {/* Down Arrow - Move block down */}
        <button
          className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
          title="Move down"
          onClick={handleMoveDown}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-zinc-600 dark:text-zinc-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Add Block Type Menu */}
      {showAddMenu && !showImageUrlInput && !showTextInput && (
        <AddBlockMenu
          onSelectText={handleSelectTextBlock}
          onSelectImage={handleSelectImage}
        />
      )}

      {/* Text Content Input Form */}
      {showTextInput && selectedTextStyle && (
        <AddTextForm
          textStyle={selectedTextStyle}
          content={textContent}
          onContentChange={setTextContent}
          onSubmit={handleAddTextBlock}
          onCancel={handleCancelTextInput}
        />
      )}

      {/* Image URL Input Form */}
      {showImageUrlInput && (
        <AddImageForm
          url={imageUrl}
          onUrlChange={setImageUrl}
          onSubmit={handleAddImageBlock}
          onCancel={handleCancelImageInput}
        />
      )}

      {/* Edit Block Form */}
      {showEditMenu && (
        <EditBlockForm
          block={block}
          editContent={editContent}
          editStyle={editStyle}
          editImageUrl={editImageUrl}
          editImageWidth={editImageWidth}
          editImageHeight={editImageHeight}
          onContentChange={setEditContent}
          onStyleChange={setEditStyle}
          onImageUrlChange={setEditImageUrl}
          onImageWidthChange={setEditImageWidth}
          onImageHeightChange={setEditImageHeight}
          onSubmit={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default BlockWrapper;
