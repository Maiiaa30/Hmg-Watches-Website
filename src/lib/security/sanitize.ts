import DOMPurify from "isomorphic-dompurify";

/** Strip all HTML from user-submitted text fields. */
export function sanitizeText(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
}

/** Allow safe Markdown-rendered HTML (blog content). */
export function sanitizeMarkdownHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "h4",
      "ul", "ol", "li", "blockquote", "a", "code", "pre", "hr", "img",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel"],
    FORCE_BODY: true,
  });
}
