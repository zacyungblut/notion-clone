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
  beforeState?: Block | null; // null for add operations
  afterState?: Block | null; // null for delete operations
  metadata?: {
    direction?: "up" | "down"; // for move operations
    afterBlockId?: string; // for add operations
    fromIndex?: number; // for move operations
    toIndex?: number; // for move operations
  };
  undone?: boolean;
}

export interface Database {
  pages: Page[];
  actions: Action[];
}
