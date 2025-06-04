import { marked, MarkedExtension, Renderer } from "marked";
import { StylesType } from "./types";
import { initRenderer } from "./utils";

export class MarkdownParser {
  private readonly renderer: Renderer;

  constructor({ customStyles }: { customStyles?: StylesType }) {
    this.renderer = initRenderer({ customStyles });
  }

  parse(markdown: string, extensions: MarkedExtension[] = []) {
    marked.use(...extensions);
    return marked.parse(markdown, { renderer: this.renderer });
  }
}
