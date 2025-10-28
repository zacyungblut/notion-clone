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

export interface Database {
  pages: Page[];
}
