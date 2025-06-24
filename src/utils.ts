import { CSSProperties } from "react";
import { StylesType, initRendererProps } from "./types";
import { RendererObject } from "marked";
import { styles } from "./styles";

function escapeQuotes(value: unknown) {
  if (typeof value === "string" && value.includes('"')) {
    return value.replace(/"/g, "&#x27;");
  }
  return value;
}

export function camelToKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export function parseCssInJsToInlineCss(
  cssProperties: CSSProperties | undefined
): string {
  if (!cssProperties) return "";

  const numericalCssProperties = [
    "width",
    "height",
    "margin",
    "marginTop",
    "marginRight",
    "marginBottom",
    "marginLeft",
    "padding",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "borderWidth",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "outlineWidth",
    "top",
    "right",
    "bottom",
    "left",
    "fontSize",
    "lineHeight",
    "letterSpacing",
    "wordSpacing",
    "maxWidth",
    "minWidth",
    "maxHeight",
    "minHeight",
    "borderRadius",
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderBottomLeftRadius",
    "borderBottomRightRadius",
    "textIndent",
    "gridColumnGap",
    "gridRowGap",
    "gridGap",
    "translateX",
    "translateY",
  ];

  return Object.entries(cssProperties)
    .map(([property, value]) => {
      if (
        typeof value === "number" &&
        numericalCssProperties.includes(property)
      ) {
        return `${camelToKebabCase(property)}:${value}px`;
      } else {
        const escapedValue = escapeQuotes(value);
        return `${camelToKebabCase(property)}:${escapedValue}`;
      }
    })
    .join(";");
}

export const initRenderer = ({
  customStyles,
}: initRendererProps): RendererObject => {
  const finalStyles = { ...styles, ...customStyles };

  return {
    blockquote({ tokens }) {
      const text = this.parser.parse(tokens);

      return `<blockquote${
        parseCssInJsToInlineCss(finalStyles.blockQuote) !== ""
          ? ` style="${parseCssInJsToInlineCss(finalStyles.blockQuote)}"`
          : ""
      }>\n${text}</blockquote>\n`;
    },
    br() {
      return `<br${
        parseCssInJsToInlineCss(finalStyles.br) !== ""
          ? ` style="${parseCssInJsToInlineCss(finalStyles.br)}"`
          : ""
      } />`;
    },
    // TODO: Support all options
    code({ text }) {
      text = text.replace(/\n$/, "") + "\n";

      return `<pre${
        parseCssInJsToInlineCss(finalStyles.codeBlock) !== ""
          ? ` style="${parseCssInJsToInlineCss(finalStyles.codeBlock)}"`
          : ""
      }><code>${text}</code></pre>\n`;
    },
    codespan({ text }) {
      return `<code${
        parseCssInJsToInlineCss(finalStyles.codeInline) !== ""
          ? ` style="${parseCssInJsToInlineCss(finalStyles.codeInline)}"`
          : ""
      }>${text}</code>`;
    },
    del({ tokens }) {
      const text = this.parser.parseInline(tokens);

      return `<del${
        parseCssInJsToInlineCss(finalStyles.strikethrough) !== ""
          ? ` style="${parseCssInJsToInlineCss(finalStyles.strikethrough)}"`
          : ""
      }>${text}</del>`;
    },
    em({ tokens }) {
      const text = this.parser.parseInline(tokens);

      return `<em${
        parseCssInJsToInlineCss(finalStyles.italic) !== ""
          ? ` style="${parseCssInJsToInlineCss(finalStyles.italic)}"`
          : ""
      }>${text}</em>`;
    },
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);

      return `<h${depth}${
        parseCssInJsToInlineCss(
          finalStyles[`h${depth}` as keyof StylesType]
        ) !== ""
          ? ` style="${parseCssInJsToInlineCss(
              finalStyles[`h${depth}` as keyof StylesType]
            )}"`
          : ""
      }>${text}</h${depth}>`;
    },
    hr() {
      return `<hr${
        parseCssInJsToInlineCss(finalStyles.hr) !== ""
          ? ` style="${parseCssInJsToInlineCss(finalStyles.hr)}"`
          : ""
      } />\n`;
    },
    // TODO: Captions?
    image({ href, text, title }) {
      return `<img src="${href}" alt="${text}"${title ? ` title="${title}"` : ""}${
        parseCssInJsToInlineCss(finalStyles.image) !== ""
          ? ` style="${parseCssInJsToInlineCss(finalStyles.image)}"`
          : ""
      }>`;
    },
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);

      return `<a href="${href}" target="_blank"${title ? ` title="${title}"` : ""}${
        parseCssInJsToInlineCss(finalStyles.link) !== ""
          ? ` style="${parseCssInJsToInlineCss(finalStyles.link)}"`
          : ""
      }>${text}</a>`;
    },
    listitem({ tokens }) {
      const text = this.parser.parseInline(tokens);

      return `<li${
        parseCssInJsToInlineCss(finalStyles.li) !== ""
          ? ` style="${parseCssInJsToInlineCss(finalStyles.li)}"`
          : ""
      }>${text}</li>\n`;
    },
    list({ items, ordered, start }) {
      const type = ordered ? "ol" : "ul";
      const startAt = ordered && start !== 1 ? ' start="' + start + '"' : "";
      const styles = parseCssInJsToInlineCss(
        finalStyles[ordered ? "ol" : "ul"]
      );

      return (
        "<" +
        type +
        startAt +
        `${styles !== "" ? ` style="${styles}"` : ""}>\n` +
        items.map((item) => this.listitem(item)).join("") +
        "</" +
        type +
        ">\n"
      );
    },
    paragraph({ tokens }) {
      const text = this.parser.parseInline(tokens);

      return `<p${
        parseCssInJsToInlineCss(finalStyles.p) !== ""
          ? ` style="${parseCssInJsToInlineCss(finalStyles.p)}"`
          : ""
      }>${text}</p>\n`;
    },
    strong({ tokens }) {
      const text = this.parser.parseInline(tokens);

      return `<strong${
        parseCssInJsToInlineCss(finalStyles.bold) !== ""
          ? ` style="${parseCssInJsToInlineCss(finalStyles.bold)}"`
          : ""
      }>${text}</strong>`;
    },
    table({ header, rows }) {
      const styleTable = parseCssInJsToInlineCss(finalStyles.table);
      const styleThead = parseCssInJsToInlineCss(finalStyles.thead);
      const styleTbody = parseCssInJsToInlineCss(finalStyles.tbody);

      const theadRow = this.tablerow({
        text: header.map((cell) => this.tablecell(cell)).join(""),
      });

      const tbodyRows = rows
        .map((row) =>
          this.tablerow({
            text: row.map((cell) => this.tablecell(cell)).join(""),
          })
        )
        .join("");

      const thead = `<thead${styleThead ? ` style="${styleThead}"` : ""}>\n${theadRow}</thead>`;
      const tbody = `<tbody${styleTbody ? ` style="${styleTbody}"` : ""}>${tbodyRows}</tbody>`;

      return `<table${styleTable ? ` style="${styleTable}"` : ""}>\n${thead}\n${tbody}</table>\n`;
    },
    tablecell({ tokens, align, header }) {
      const text = this.parser.parseInline(tokens);
      const type = header ? "th" : "td";
      const tag = align
        ? `<${type} align="${align}"${
            parseCssInJsToInlineCss(finalStyles.td) !== ""
              ? ` style="${parseCssInJsToInlineCss(finalStyles.td)}"`
              : ""
          }>`
        : `<${type}${
            parseCssInJsToInlineCss(finalStyles.td) !== ""
              ? ` style="${parseCssInJsToInlineCss(finalStyles.td)}"`
              : ""
          }>`;
      return tag + text + `</${type}>\n`;
    },
    tablerow({ text }) {
      return `<tr${
        parseCssInJsToInlineCss(finalStyles.tr) !== ""
          ? ` style="${parseCssInJsToInlineCss(finalStyles.tr)}"`
          : ""
      }>\n${text}</tr>\n`;
    },
  };
};
