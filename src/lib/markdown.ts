import { marked } from "marked";
import { sanitizeMarkdownHtml } from "@/lib/security/sanitize";

marked.setOptions({ gfm: true, breaks: true });

/** Convert Markdown to sanitized HTML for safe rendering. */
export function renderMarkdown(md: string): string {
  const html = marked.parse(md, { async: false }) as string;
  return sanitizeMarkdownHtml(html);
}
