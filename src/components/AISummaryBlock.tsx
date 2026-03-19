import { Sparkles, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

interface AISummaryBlockProps {
  articleTitle: string;
  articleExcerpt: string;
  articleUrl: string;
  articleContent: string;
}

const AISummaryBlock = ({ articleTitle, articleExcerpt, articleUrl, articleContent }: AISummaryBlockProps) => {
  const [copied, setCopied] = useState(false);
  const prompt = `Act as a professional article analyst.

Task:
Analyze and summarize the following article (URL provided for citation).

Requirements:
- Give a short summary (3–4 lines)
- List key insights in bullet points
- Extract important facts or numbers
- Provide a one-line conclusion

Article URL:
${articleUrl}

Article Content:
Title: ${articleTitle}
${articleContent}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ai-summary">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-muted-foreground" />
        <p className="metadata">Summarize this article</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <a
          href={`https://chat.openai.com/?q=${encodeURIComponent(prompt)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-[12px] text-sm font-medium text-foreground hover:bg-background transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Open in ChatGPT
        </a>
        <a
          href={`https://claude.ai/new?q=${encodeURIComponent(prompt)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-[12px] text-sm font-medium text-foreground hover:bg-background transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Open in Claude
        </a>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-[12px] text-sm font-medium text-foreground hover:bg-background transition-colors"
        >
          <Copy className="w-3.5 h-3.5" /> {copied ? "Copied!" : "Copy Prompt"}
        </button>
      </div>
    </div>
  );
};

export default AISummaryBlock;
