import React from "react";
import { Block } from "../api";
import TextBlock from "./TextBlock";
import ImageBlock from "./ImageBlock";

interface BlockRendererProps {
  block: Block;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block }) => {
  switch (block.type) {
    case "text":
      return (
        <TextBlock
          id={block.id}
          content={block.content}
          textStyle={block.textStyle}
        />
      );
    case "image":
      return (
        <ImageBlock
          id={block.id}
          url={block.url}
          imageWidth={block.imageWidth}
          imageHeight={block.imageHeight}
        />
      );
    default:
      return null;
  }
};

export default BlockRenderer;
