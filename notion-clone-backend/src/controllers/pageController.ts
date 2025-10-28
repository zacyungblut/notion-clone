import { Request, Response } from "express";
import { DatabaseService } from "../models/database";
import { Page, Block } from "../types";

const dbService = new DatabaseService();

export const getAllPages = (req: Request, res: Response): void => {
  try {
    const pages = dbService.getAllPages();
    res.json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch pages" });
  }
};

export const getPageById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const page = dbService.getPageById(id);

    if (!page) {
      res.status(404).json({ success: false, error: "Page not found" });
      return;
    }

    res.json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch page" });
  }
};

export const createPage = (req: Request, res: Response): void => {
  try {
    const { title, blocks } = req.body;

    if (!title) {
      res.status(400).json({ success: false, error: "Title is required" });
      return;
    }

    const newPage: Page = {
      id: Date.now().toString(),
      title,
      blocks: blocks || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const createdPage = dbService.createPage(newPage);
    res.status(201).json({ success: true, data: createdPage });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create page" });
  }
};

export const updatePage = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedPage = dbService.updatePage(id, updates);

    if (!updatedPage) {
      res.status(404).json({ success: false, error: "Page not found" });
      return;
    }

    res.json({ success: true, data: updatedPage });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update page" });
  }
};

export const deletePage = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = dbService.deletePage(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: "Page not found" });
      return;
    }

    res.json({ success: true, message: "Page deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete page" });
  }
};

// ... existing code ...

export const addBlockToPage = (req: Request, res: Response): void => {
  try {
    const { pageId } = req.params;
    const { block, afterBlockId } = req.body;

    if (!block || !block.type) {
      res
        .status(400)
        .json({ success: false, error: "Valid block is required" });
      return;
    }

    // Generate ID for the new block if not provided
    const newBlock: Block = {
      id: block.id || `block-${Date.now()}`,
      type: block.type,
      textStyle: block.textStyle,
      content: block.content,
      url: block.url,
      imageWidth: block.imageWidth,
      imageHeight: block.imageHeight,
    };

    const updatedPage = dbService.addBlockToPage(
      pageId,
      newBlock,
      afterBlockId
    );

    if (!updatedPage) {
      res.status(404).json({ success: false, error: "Page not found" });
      return;
    }

    res.json({ success: true, data: updatedPage });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to add block" });
  }
};

export const updateBlockInPage = (req: Request, res: Response): void => {
  try {
    const { pageId, blockId } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      res.status(400).json({ success: false, error: "No updates provided" });
      return;
    }

    const updatedPage = dbService.updateBlockInPage(pageId, blockId, updates);

    if (!updatedPage) {
      res
        .status(404)
        .json({ success: false, error: "Page or block not found" });
      return;
    }

    res.json({ success: true, data: updatedPage });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update block" });
  }
};

export const deleteBlockFromPage = (req: Request, res: Response): void => {
  try {
    const { pageId, blockId } = req.params;

    const updatedPage = dbService.deleteBlockFromPage(pageId, blockId);

    if (!updatedPage) {
      res
        .status(404)
        .json({ success: false, error: "Page or block not found" });
      return;
    }

    res.json({ success: true, data: updatedPage });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete block" });
  }
};

export const moveBlockInPage = (req: Request, res: Response): void => {
  try {
    const { pageId, blockId } = req.params;
    const { direction } = req.body;

    if (!direction || (direction !== "up" && direction !== "down")) {
      res.status(400).json({
        success: false,
        error: 'Direction must be "up" or "down"',
      });
      return;
    }

    const updatedPage = dbService.moveBlockInPage(pageId, blockId, direction);

    if (!updatedPage) {
      res.status(404).json({
        success: false,
        error: "Page or block not found, or move not possible",
      });
      return;
    }

    res.json({ success: true, data: updatedPage });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to move block" });
  }
};

export const getAllActions = (req: Request, res: Response): void => {
  try {
    const actions = dbService.getAllActions();
    res.json({ success: true, data: actions });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch actions" });
  }
};

export const getActionsByPageId = (req: Request, res: Response): void => {
  try {
    const { pageId } = req.params;
    const actions = dbService.getActionsByPageId(pageId);
    res.json({ success: true, data: actions });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch actions" });
  }
};

export const undoAction = (req: Request, res: Response): void => {
  try {
    const { pageId } = req.params;
    const result = dbService.undoLastAction(pageId);

    if (!result.page || !result.action) {
      res.status(404).json({
        success: false,
        error: "No actions to undo or page not found",
      });
      return;
    }

    res.json({
      success: true,
      data: result.page,
      action: result.action,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to undo action" });
  }
};

export const redoAction = (req: Request, res: Response): void => {
  try {
    const { pageId } = req.params;
    const result = dbService.redoLastAction(pageId);

    if (!result.page || !result.action) {
      res.status(404).json({
        success: false,
        error: "No actions to redo or page not found",
      });
      return;
    }

    res.json({
      success: true,
      data: result.page,
      action: result.action,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to redo action" });
  }
};
