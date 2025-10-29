import React from "react";

interface TextBlockProps {
  id: string;
  content?: string;
  textStyle?: "h1" | "h2" | "h3" | "p";
}

const TextBlock: React.FC<TextBlockProps> = ({ id, content, textStyle }) => {
  const getTextStyleClasses = () => {
    switch (textStyle) {
      case "h1":
        return "text-4xl font-bold text-zinc-900 dark:text-zinc-50";
      case "h2":
        return "text-3xl font-semibold text-zinc-800 dark:text-zinc-100";
      case "h3":
        return "text-2xl font-medium text-zinc-800 dark:text-zinc-100";
      case "p":
        return "text-base text-zinc-700 dark:text-zinc-300 leading-7";
      default:
        return "text-base text-zinc-700 dark:text-zinc-300";
    }
  };

  const renderContent = () => {
    const className = getTextStyleClasses();
    const text = content || "Empty text block";

    switch (textStyle) {
      case "h1":
        return <h1 className={className}>{text}</h1>;
      case "h2":
        return <h2 className={className}>{text}</h2>;
      case "h3":
        return <h3 className={className}>{text}</h3>;
      case "p":
      default:
        return <p className={className}>{text}</p>;
    }
  };

  return <div className="w-full py-1">{renderContent()}</div>;
};

export default TextBlock;
