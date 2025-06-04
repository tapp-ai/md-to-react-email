import { MarkdownParser } from "./parser";
import { parseMarkdownToJSXProps } from "./types";

export const parseMarkdownToJSX = ({
  markdown,
  customStyles,
  extensions,
}: parseMarkdownToJSXProps) => {
  const parser = new MarkdownParser({ customStyles });
  return parser.parse(markdown, extensions);
};
