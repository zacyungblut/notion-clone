import { Router } from "express";
import {
  getAllPages,
  getPageById,
  createPage,
  updatePage,
  deletePage,
  addBlockToPage,
  updateBlockInPage,
  deleteBlockFromPage,
  moveBlockInPage,
  getAllActions,
  getActionsByPageId,
  undoAction,
  redoAction,
} from "../controllers/pageController";

const router = Router();

router.get("/pages", getAllPages);
router.get("/pages/:id", getPageById);
router.post("/pages", createPage);
router.put("/pages/:id", updatePage);
router.delete("/pages/:id", deletePage);
router.post("/pages/:pageId/blocks", addBlockToPage);
router.put("/pages/:pageId/blocks/:blockId", updateBlockInPage);
router.delete("/pages/:pageId/blocks/:blockId", deleteBlockFromPage);
router.post("/pages/:pageId/blocks/:blockId/move", moveBlockInPage);
router.get("/actions", getAllActions);
router.get("/actions/:pageId", getActionsByPageId);
router.post("/pages/:pageId/undo", undoAction);
router.post("/pages/:pageId/redo", redoAction);
export default router;
