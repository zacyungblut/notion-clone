import fs from "fs";
import path from "path";
import { Block, Database, Page } from "../types";

const DB_PATH = path.join(__dirname, "../../data/database.json");

export class DatabaseService {
  private readDatabase(): Database {
    try {
      const data = fs.readFileSync(DB_PATH, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      // If file doesn't exist, return empty database
      return { pages: [] };
    }
  }

  private writeDatabase(data: Database): void {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  }

  getAllPages(): Page[] {
    const db = this.readDatabase();
    return db.pages;
  }

  getPageById(id: string): Page | undefined {
    const db = this.readDatabase();
    return db.pages.find((page) => page.id === id);
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
  // ... existing code ...

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

    // Update the block with new data
    page.blocks[blockIndex] = {
      ...page.blocks[blockIndex],
      ...updates,
    };

    page.updatedAt = new Date().toISOString();
    this.writeDatabase(db);
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

    // Remove the block
    page.blocks.splice(blockIndex, 1);

    page.updatedAt = new Date().toISOString();
    this.writeDatabase(db);
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

    // Swap blocks
    const temp = page.blocks[blockIndex];
    page.blocks[blockIndex] = page.blocks[newIndex];
    page.blocks[newIndex] = temp;

    page.updatedAt = new Date().toISOString();
    this.writeDatabase(db);
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
