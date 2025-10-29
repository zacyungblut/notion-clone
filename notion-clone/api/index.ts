export interface Block {
  id: string;
  type: "text" | "image";
  textStyle?: "h1" | "h2" | "h3" | "p";
  url?: string;
  imageWidth?: number;
  imageHeight?: number;
  content?: string;
}

export interface Page {
  id: string;
  title: string;
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
}

export interface Action {
  id: string;
  type: "add" | "edit" | "delete" | "move";
  timestamp: string;
  pageId: string;
  blockId?: string;
  beforeState?: Block | null;
  afterState?: Block | null;
  undone?: boolean; // Track if action has been undone
  metadata?: {
    direction?: "up" | "down";
    afterBlockId?: string;
    fromIndex?: number;
    toIndex?: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const API_BASE_URL = "http://localhost:3000/api";

export const api = {
  async getAllPages(): Promise<Page[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/pages`);
      const result: ApiResponse<Page[]> = await response.json();
      return result.data || [];
    } catch (error) {
      console.error("Failed to fetch pages:", error);
      return [];
    }
  },

  async getPageById(id: string): Promise<Page | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/${id}`);
      const result: ApiResponse<Page> = await response.json();
      return result.data || null;
    } catch (error) {
      console.error(`Failed to fetch page ${id}:`, error);
      return null;
    }
  },

  async createPage(
    page: Omit<Page, "id" | "createdAt" | "updatedAt">
  ): Promise<Page | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/pages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(page),
      });
      const result: ApiResponse<Page> = await response.json();
      return result.data || null;
    } catch (error) {
      console.error("Failed to create page:", error);
      return null;
    }
  },

  async updatePage(id: string, updates: Partial<Page>): Promise<Page | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      const result: ApiResponse<Page> = await response.json();
      return result.data || null;
    } catch (error) {
      console.error(`Failed to update page ${id}:`, error);
      return null;
    }
  },

  async deletePage(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/${id}`, {
        method: "DELETE",
      });
      const result: ApiResponse<unknown> = await response.json();
      return result.success;
    } catch (error) {
      console.error(`Failed to delete page ${id}:`, error);
      return false;
    }
  },

  async addBlockToPage(
    pageId: string,
    block: Omit<Block, "id">,
    afterBlockId?: string
  ): Promise<Page | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/${pageId}/blocks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ block, afterBlockId }),
      });
      const result: ApiResponse<Page> = await response.json();
      return result.data || null;
    } catch (error) {
      console.error(`Failed to add block to page ${pageId}:`, error);
      return null;
    }
  },
  async updateBlockInPage(
    pageId: string,
    blockId: string,
    updates: Partial<Block>
  ): Promise<Page | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/pages/${pageId}/blocks/${blockId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        }
      );
      const result: ApiResponse<Page> = await response.json();
      return result.data || null;
    } catch (error) {
      console.error(
        `Failed to update block ${blockId} in page ${pageId}:`,
        error
      );
      return null;
    }
  },

  async deleteBlockFromPage(
    pageId: string,
    blockId: string
  ): Promise<Page | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/pages/${pageId}/blocks/${blockId}`,
        {
          method: "DELETE",
        }
      );
      const result: ApiResponse<Page> = await response.json();
      return result.data || null;
    } catch (error) {
      console.error(
        `Failed to delete block ${blockId} from page ${pageId}:`,
        error
      );
      return null;
    }
  },
  async moveBlockInPage(
    pageId: string,
    blockId: string,
    direction: "up" | "down"
  ): Promise<Page | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/pages/${pageId}/blocks/${blockId}/move`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ direction }),
        }
      );
      const result: ApiResponse<Page> = await response.json();
      return result.data || null;
    } catch (error) {
      console.error(
        `Failed to move block ${blockId} in page ${pageId}:`,
        error
      );
      return null;
    }
  },
  async undo(pageId: string): Promise<Page | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/${pageId}/undo`, {
        method: "POST",
      });
      const result: ApiResponse<Page> = await response.json();
      return result.data || null;
    } catch (error) {
      console.error(`Failed to undo action for page ${pageId}:`, error);
      return null;
    }
  },

  async redo(pageId: string): Promise<Page | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/${pageId}/redo`, {
        method: "POST",
      });
      const result: ApiResponse<Page> = await response.json();
      return result.data || null;
    } catch (error) {
      console.error(`Failed to redo action for page ${pageId}:`, error);
      return null;
    }
  },
};
