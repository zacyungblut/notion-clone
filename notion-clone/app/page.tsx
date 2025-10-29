"use client";

import { useEffect, useState } from "react";
import { api, Page, Block } from "../api";
import BlockRenderer from "../components/BlockRenderer";
import BlockWrapper from "../components/BlockWrapper";

export default function Home() {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleUndo = async () => {
    if (!page) return;

    try {
      const updatedPage = await api.undo(page.id);
      if (updatedPage) {
        setPage(updatedPage);
      } else {
        alert("Nothing to undo");
      }
    } catch (error) {
      console.error("Failed to undo:", error);
      alert("Failed to undo. Please try again.");
    }
  };

  const handleRedo = async () => {
    if (!page) return;

    try {
      const updatedPage = await api.redo(page.id);
      if (updatedPage) {
        setPage(updatedPage);
      } else {
        alert("Nothing to redo");
      }
    } catch (error) {
      console.error("Failed to redo:", error);
      alert("Failed to redo. Please try again.");
    }
  };

  useEffect(() => {
    async function fetchPages() {
      try {
        setLoading(true);
        const fetchedPages = await api.getAllPages();

        // Automatically load the first page
        if (fetchedPages.length > 0) {
          setPage(fetchedPages[0]);
        }
      } catch (err) {
        setError(
          "Failed to fetch pages. Make sure the backend is running on localhost:3000"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPages();
  }, []);

  const handleAddBlock = async (
    afterBlockId: string,
    type: "text" | "image",
    textStyle?: "h1" | "h2" | "h3" | "p",
    imageUrl?: string,
    textContent?: string
  ) => {
    if (!page) return;

    // Create the new block object
    const newBlock: Omit<Block, "id"> = {
      type,
      textStyle: type === "text" ? textStyle : undefined,
      content: type === "text" ? textContent : undefined,
      url: type === "image" ? imageUrl : undefined,
      imageWidth: type === "image" ? 800 : undefined,
      imageHeight: type === "image" ? 600 : undefined,
    };

    try {
      // Call the API to add the block
      const updatedPage = await api.addBlockToPage(
        page.id,
        newBlock,
        afterBlockId
      );

      if (updatedPage) {
        // Update the local state with the new page data
        setPage(updatedPage);
      }
    } catch (error) {
      console.error("Failed to add block:", error);
      alert("Failed to add block. Please try again.");
    }
  };

  const handleEditBlock = async (blockId: string, updates: Partial<Block>) => {
    if (!page) return;

    try {
      // Call the API to update the block
      const updatedPage = await api.updateBlockInPage(
        page.id,
        blockId,
        updates
      );

      if (updatedPage) {
        // Update the local state with the new page data
        setPage(updatedPage);
      }
    } catch (error) {
      console.error("Failed to update block:", error);
      alert("Failed to update block. Please try again.");
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!page) return;

    try {
      // Call the API to delete the block
      const updatedPage = await api.deleteBlockFromPage(page.id, blockId);

      if (updatedPage) {
        // Update the local state with the new page data
        setPage(updatedPage);
      }
    } catch (error) {
      console.error("Failed to delete block:", error);
      alert("Failed to delete block. Please try again.");
    }
  };

  const handleMoveBlock = async (blockId: string, direction: "up" | "down") => {
    if (!page) return;

    try {
      // Call the API to move the block
      const updatedPage = await api.moveBlockInPage(
        page.id,
        blockId,
        direction
      );

      if (updatedPage) {
        // Update the local state with the new page data
        setPage(updatedPage);
      }
    } catch (error) {
      console.error("Failed to move block:", error);
      alert("Failed to move block. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="text-lg text-zinc-600 dark:text-zinc-400">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            Error
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-8 py-12 pl-20">
          {page ? (
            <>
              <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
                {page.title}
              </h1>
              <div className="space-y-2">
                {page.blocks.length === 0 ? (
                  <p className="text-zinc-500 dark:text-zinc-400">
                    No blocks in this page
                  </p>
                ) : (
                  page.blocks.map((block, index) => (
                    <BlockWrapper
                      key={block.id}
                      block={block}
                      isFirst={index === 0}
                      isLast={index === page.blocks.length - 1}
                      onAddBlock={(type, textStyle, imageUrl, textContent) =>
                        handleAddBlock(
                          block.id,
                          type,
                          textStyle,
                          imageUrl,
                          textContent
                        )
                      }
                      onEditBlock={handleEditBlock}
                      onDeleteBlock={handleDeleteBlock}
                      onMoveBlock={handleMoveBlock}>
                      <BlockRenderer block={block} />
                    </BlockWrapper>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-zinc-500 dark:text-zinc-400">
                No pages available
              </p>
            </div>
          )}
        </div>
      </main>
      {/* Undo/Redo Controls */}
      <div className="fixed bottom-6 left-6 flex gap-2">
        <button
          onClick={handleUndo}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          title="Undo (Ctrl+Z)">
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
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
          <span className="text-sm font-medium">Undo</span>
        </button>
      </div>

      <div className="fixed bottom-6 right-6 flex gap-2">
        <button
          onClick={handleRedo}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          title="Redo (Ctrl+Shift+Z)">
          <span className="text-sm font-medium">Redo</span>
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
              d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
