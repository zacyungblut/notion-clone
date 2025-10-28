import fs from "fs";
import path from "path";
import { Block, Database, Page, Action } from "../types";

const DB_PATH = path.join(__dirname, "../../data/database.json");

export class DatabaseService {
  private readDatabase(): Database {
    try {
      const data = fs.readFileSync(DB_PATH, "utf-8");
      const db = JSON.parse(data);
      // Ensure actions array exists for backwards compatibility
      if (!db.actions) {
        db.actions = [];
      }
      return db;
    } catch (error) {
      // If file doesn't exist, return empty database
      return { pages: [], actions: [] };
    }
  }

  private writeDatabase(data: Database): void {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  }

  private recordAction(action: Omit<Action, "id" | "timestamp">): void {
    const db = this.readDatabase();
    const newAction: Action = {
      id: `action-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...action,
    };
    db.actions.push(newAction);
    this.writeDatabase(db);
  }

  getAllPages(): Page[] {
    const db = this.readDatabase();
    return db.pages;
  }

  getPageById(id: string): Page | undefined {
    const db = this.readDatabase();
    return db.pages.find((page) => page.id === id);
  }

  getAllActions(): Action[] {
    const db = this.readDatabase();
    return db.actions;
  }

  getActionsByPageId(pageId: string): Action[] {
    const db = this.readDatabase();
    return db.actions.filter((action) => action.pageId === pageId);
  }

  undoLastAction(pageId: string): { page: Page | null; action: Action | null } {
    const db = this.readDatabase();
    const pageIndex = db.pages.findIndex((page) => page.id === pageId);

    if (pageIndex === -1) {
      return { page: null, action: null };
    }

    // Find the last non-undone action for this page
    const actions = db.actions
      .filter((a) => a.pageId === pageId && !a.undone)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

    if (actions.length === 0) {
      return { page: null, action: null };
    }

    const actionToUndo = actions[0];
    const page = db.pages[pageIndex];

    // Reverse the action based on type
    switch (actionToUndo.type) {
      case "add":
        // Remove the block that was added
        const addIndex = page.blocks.findIndex(
          (b) => b.id === actionToUndo.blockId
        );
        if (addIndex !== -1) {
          page.blocks.splice(addIndex, 1);
        }
        break;

      case "delete":
        // Re-add the block that was deleted
        if (actionToUndo.beforeState) {
          // Try to find where it was (if we have metadata about position)
          page.blocks.push(actionToUndo.beforeState);
        }
        break;

      case "edit":
        // Restore the previous state
        if (actionToUndo.beforeState) {
          const editIndex = page.blocks.findIndex(
            (b) => b.id === actionToUndo.blockId
          );
          if (editIndex !== -1) {
            page.blocks[editIndex] = { ...actionToUndo.beforeState };
          }
        }
        break;

      case "move":
        // Reverse the move
        if (
          actionToUndo.metadata?.fromIndex !== undefined &&
          actionToUndo.metadata?.toIndex !== undefined
        ) {
          const currentIndex = actionToUndo.metadata.toIndex;
          const originalIndex = actionToUndo.metadata.fromIndex;
          if (currentIndex < page.blocks.length) {
            const temp = page.blocks[currentIndex];
            page.blocks[currentIndex] = page.blocks[originalIndex];
            page.blocks[originalIndex] = temp;
          }
        }
        break;
    }

    // Mark action as undone
    const actionIndex = db.actions.findIndex((a) => a.id === actionToUndo.id);
    if (actionIndex !== -1) {
      db.actions[actionIndex].undone = true;
    }

    page.updatedAt = new Date().toISOString();
    this.writeDatabase(db);

    return { page, action: actionToUndo };
  }

  redoLastAction(pageId: string): { page: Page | null; action: Action | null } {
    const db = this.readDatabase();
    const pageIndex = db.pages.findIndex((page) => page.id === pageId);

    if (pageIndex === -1) {
      return { page: null, action: null };
    }

    // Find the last undone action for this page
    const actions = db.actions
      .filter((a) => a.pageId === pageId && a.undone === true)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

    if (actions.length === 0) {
      return { page: null, action: null };
    }

    const actionToRedo = actions[0];
    const page = db.pages[pageIndex];

    // Reapply the action based on type
    switch (actionToRedo.type) {
      case "add":
        // Re-add the block
        if (actionToRedo.afterState) {
          if (actionToRedo.metadata?.afterBlockId) {
            const afterIndex = page.blocks.findIndex(
              (b) => b.id === actionToRedo.metadata!.afterBlockId
            );
            if (afterIndex !== -1) {
              page.blocks.splice(afterIndex + 1, 0, actionToRedo.afterState);
            } else {
              page.blocks.push(actionToRedo.afterState);
            }
          } else {
            page.blocks.push(actionToRedo.afterState);
          }
        }
        break;

      case "delete":
        // Re-delete the block
        const deleteIndex = page.blocks.findIndex(
          (b) => b.id === actionToRedo.blockId
        );
        if (deleteIndex !== -1) {
          page.blocks.splice(deleteIndex, 1);
        }
        break;

      case "edit":
        // Reapply the edit
        if (actionToRedo.afterState) {
          const editIndex = page.blocks.findIndex(
            (b) => b.id === actionToRedo.blockId
          );
          if (editIndex !== -1) {
            page.blocks[editIndex] = { ...actionToRedo.afterState };
          }
        }
        break;

      case "move":
        // Reapply the move
        if (
          actionToRedo.metadata?.fromIndex !== undefined &&
          actionToRedo.metadata?.toIndex !== undefined
        ) {
          const fromIndex = actionToRedo.metadata.fromIndex;
          const toIndex = actionToRedo.metadata.toIndex;
          if (fromIndex < page.blocks.length) {
            const temp = page.blocks[fromIndex];
            page.blocks[fromIndex] = page.blocks[toIndex];
            page.blocks[toIndex] = temp;
          }
        }
        break;
    }

    // Mark action as not undone
    const actionIndex = db.actions.findIndex((a) => a.id === actionToRedo.id);
    if (actionIndex !== -1) {
      db.actions[actionIndex].undone = false;
    }

    page.updatedAt = new Date().toISOString();
    this.writeDatabase(db);

    return { page, action: actionToRedo };
  }

  createPage(page: Page): Page {
    const db = this.readDatabase();
    db.pages.push(page);
    this.writeDatabase(db);
    return page;
  }

  updatePage(id: string, updatedPage: Partial<Page>): Page | null {
    const db = this.readDatabase();
    const index = db.pages.findIndex((page) => page.id === id);

    if (index === -1) {
      return null;
    }

    db.pages[index] = {
      ...db.pages[index],
      ...updatedPage,
      updatedAt: new Date().toISOString(),
    };
    this.writeDatabase(db);
    return db.pages[index];
  }

  addBlockToPage(
    pageId: string,
    block: Block,
    afterBlockId?: string
  ): Page | null {
    const db = this.readDatabase();
    const pageIndex = db.pages.findIndex((page) => page.id === pageId);

    if (pageIndex === -1) {
      return null;
    }

    const page = db.pages[pageIndex];

    if (afterBlockId) {
      // Insert block after the specified block
      const blockIndex = page.blocks.findIndex((b) => b.id === afterBlockId);
      if (blockIndex !== -1) {
        page.blocks.splice(blockIndex + 1, 0, block);
      } else {
        // If block not found, add to end
        page.blocks.push(block);
      }
    } else {
      // Add to end if no afterBlockId specified
      page.blocks.push(block);
    }

    page.updatedAt = new Date().toISOString();
    this.writeDatabase(db);

    // Record action
    this.recordAction({
      type: "add",
      pageId,
      blockId: block.id,
      beforeState: null,
      afterState: block,
      metadata: { afterBlockId },
    });

    return page;
  }

  updateBlockInPage(
    pageId: string,
    blockId: string,
    updates: Partial<Block>
  ): Page | null {
    const db = this.readDatabase();
    const pageIndex = db.pages.findIndex((page) => page.id === pageId);

    if (pageIndex === -1) {
      return null;
    }

    const page = db.pages[pageIndex];
    const blockIndex = page.blocks.findIndex((b) => b.id === blockId);

    if (blockIndex === -1) {
      return null;
    }

    // Save before state for undo
    const beforeState = { ...page.blocks[blockIndex] };

    // Update the block with new data
    page.blocks[blockIndex] = {
      ...page.blocks[blockIndex],
      ...updates,
    };

    const afterState = { ...page.blocks[blockIndex] };

    page.updatedAt = new Date().toISOString();
    this.writeDatabase(db);

    // Record action
    this.recordAction({
      type: "edit",
      pageId,
      blockId,
      beforeState,
      afterState,
    });

    return page;
  }

  deleteBlockFromPage(pageId: string, blockId: string): Page | null {
    const db = this.readDatabase();
    const pageIndex = db.pages.findIndex((page) => page.id === pageId);

    if (pageIndex === -1) {
      return null;
    }

    const page = db.pages[pageIndex];
    const blockIndex = page.blocks.findIndex((b) => b.id === blockId);

    if (blockIndex === -1) {
      return null;
    }

    // Save before state for undo
    const beforeState = { ...page.blocks[blockIndex] };

    // Remove the block
    page.blocks.splice(blockIndex, 1);

    page.updatedAt = new Date().toISOString();
    this.writeDatabase(db);

    // Record action
    this.recordAction({
      type: "delete",
      pageId,
      blockId,
      beforeState,
      afterState: null,
    });

    return page;
  }

  moveBlockInPage(
    pageId: string,
    blockId: string,
    direction: "up" | "down"
  ): Page | null {
    const db = this.readDatabase();
    const pageIndex = db.pages.findIndex((page) => page.id === pageId);

    if (pageIndex === -1) {
      return null;
    }

    const page = db.pages[pageIndex];
    const blockIndex = page.blocks.findIndex((b) => b.id === blockId);

    if (blockIndex === -1) {
      return null;
    }

    // Calculate new index based on direction
    const newIndex = direction === "up" ? blockIndex - 1 : blockIndex + 1;

    // Check if move is valid
    if (newIndex < 0 || newIndex >= page.blocks.length) {
      return null; // Can't move beyond boundaries
    }

    // Save before state
    const beforeState = { ...page.blocks[blockIndex] };

    // Swap blocks
    const temp = page.blocks[blockIndex];
    page.blocks[blockIndex] = page.blocks[newIndex];
    page.blocks[newIndex] = temp;

    page.updatedAt = new Date().toISOString();
    this.writeDatabase(db);

    // Record action
    this.recordAction({
      type: "move",
      pageId,
      blockId,
      beforeState,
      afterState: beforeState, // Block itself doesn't change, just position
      metadata: {
        direction,
        fromIndex: blockIndex,
        toIndex: newIndex,
      },
    });

    return page;
  }

  deletePage(id: string): boolean {
    const db = this.readDatabase();
    const initialLength = db.pages.length;
    db.pages = db.pages.filter((page) => page.id !== id);

    if (db.pages.length < initialLength) {
      this.writeDatabase(db);
      return true;
    }

    return false;
  }
}
