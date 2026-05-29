"use client";

import React from "react";

/**
 * Lightweight Markdown renderer for chat messages.
 * Handles: bold, italic, inline code, links, bullet/numbered lists, and paragraphs.
 */

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Process bold, italic, code, and links in a single pass
  const pattern =
    /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|(\[(.+?)\]\((.+?)\))/g;

  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    // Plain text before this match
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }

    if (match[1]) {
      // **bold**
      parts.push(<strong key={match.index}>{match[2]}</strong>);
    } else if (match[3]) {
      // *italic*
      parts.push(<em key={match.index}>{match[4]}</em>);
    } else if (match[5]) {
      // `code`
      parts.push(
        <code
          key={match.index}
          className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-[0.82em] font-mono"
        >
          {match[6]}
        </code>,
      );
    } else if (match[7]) {
      // [text](url)
      parts.push(
        <a
          key={match.index}
          href={match[9]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-600 dark:text-cyan-400 underline"
        >
          {match[8]}
        </a>,
      );
    }

    last = match.index + match[0].length;
  }

  // Remaining text
  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts.length > 0 ? parts : [text];
}

function ChatMarkdown({ content }: { content: string }) {
  if (!content?.trim()) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";

    // Empty line → paragraph break
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Bullet list item: "- " or "* " or "• "
    const bulletMatch = line.match(/^(\s*)[\-*•]\s+(.+)/);
    if (bulletMatch) {
      const listItems: string[] = [];
      const indent = bulletMatch[1]?.length ?? 0;
      while (i < lines.length) {
        const current = lines[i] ?? "";
        const cm = current.match(/^(\s*)[\-*•]\s+(.+)/);
        if (cm && (cm[1]?.length ?? 0) === indent) {
          listItems.push(cm[2] ?? "");
          i++;
        } else {
          break;
        }
      }
      elements.push(
        <ul
          key={i}
          className="list-disc pl-5 my-1 space-y-0.5 text-sm leading-relaxed"
        >
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // Numbered list item: "1. " or "1) "
    const numMatch = line.match(/^(\s*)\d+[.)]\s+(.+)/);
    if (numMatch) {
      const listItems: string[] = [];
      while (i < lines.length) {
        const current = lines[i] ?? "";
        const nm = current.match(/^\s*\d+[.)]\s+(.+)/);
        if (nm) {
          listItems.push(nm[1] ?? "");
          i++;
        } else {
          break;
        }
      }
      elements.push(
        <ol
          key={i}
          className="list-decimal pl-5 my-1 space-y-0.5 text-sm leading-relaxed"
        >
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    // Heading: "## " or "### "
    const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1]?.length ?? 2;
      const text = headingMatch[2] ?? "";
      const Tag = level === 1 ? "h3" : level === 2 ? "h4" : "h5";
      const cls =
        level === 1
          ? "text-base font-semibold mt-3 mb-1"
          : level === 2
            ? "text-sm font-semibold mt-2 mb-0.5"
            : "text-sm font-medium mt-1 mb-0.5";
      elements.push(
        React.createElement(Tag, { key: i, className: cls }, renderInline(text)),
      );
      i++;
      continue;
    }

    // Code block: ``` ... ```
    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++; // skip opening ```
      while (i < lines.length && !(lines[i] ?? "").startsWith("```")) {
        codeLines.push(lines[i] ?? "");
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <pre
          key={i}
          className="my-2 p-3 rounded-lg bg-zinc-800 dark:bg-zinc-950 text-zinc-100 text-xs font-mono overflow-x-auto"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    // Regular paragraph (collect consecutive non-empty, non-special lines)
    const paragraphLines: string[] = [];
    while (i < lines.length) {
      const current = lines[i] ?? "";
      if (current.trim() === "") break;
      if (
        current.match(/^(\s*)[\-*•]\s+/) ||
        current.match(/^\s*\d+[.)]\s+/) ||
        current.match(/^(#{1,3})\s+/) ||
        current.startsWith("```")
      ) {
        break;
      }
      paragraphLines.push(current);
      i++;
    }
    if (paragraphLines.length > 0) {
      elements.push(
        <p key={i} className="text-sm leading-relaxed my-0.5">
          {renderInline(paragraphLines.join("\n"))}
        </p>,
      );
    }
  }

  return <div className="chat-markdown">{elements}</div>;
}

export { ChatMarkdown };
