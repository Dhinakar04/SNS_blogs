import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useState, useRef } from "react";
import type { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact" | "horizontal";
  hideEcosystemLabel?: boolean;
}

const getBadgeColor = (text: string) => {
  if (!text) return "bg-rose-100 text-rose-800";
  const hash = text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    "bg-emerald-100 text-emerald-800", // Green
    "bg-rose-100 text-rose-800", // Pink
    "bg-amber-100 text-amber-800", // Orange
    "bg-sky-100 text-sky-800", // Blue
    "bg-indigo-100 text-indigo-800", // Purple
  ];
  return colors[hash % colors.length];
};

const ArticleCard = ({ article, hideEcosystemLabel }: ArticleCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <Link to={`/article/${article.id}`} className="group flex flex-col w-full outline-none no-underline bg-background">
      {/* Image Container with Custom Cursor */}
      <div
        ref={imageRef}
        className="relative w-full aspect-[1.5/1] bg-muted mb-4 cursor-none rounded-[20px] overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top-left labels (pills) */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 pr-16 z-10">
          {article.category && (
            <span className={`px-3 py-1.5 text-[12px] font-bold rounded-full shadow-sm ${getBadgeColor(article.category)}`}>
              {article.category}
            </span>
          )}
        </div>

        {/* Top-right "cutout" for min read time */}
        <div className="absolute top-0 right-0 bg-background text-foreground min-w-[47px] h-[26px] text-[12px] font-bold rounded-bl-[16px] z-10 transition-colors flex items-center justify-center px-1">
          {/* Top-Left Inverted Curve */}
          <svg className="absolute top-0 right-full w-4 h-4 text-background" viewBox="0 0 20 20" fill="currentColor">
            <path d="M20 20V0H0c11.046 0 20 8.954 20 20z" />
          </svg>

          {article.readTime}

          {/* Bottom-Right Inverted Curve */}
          <svg className="absolute -bottom-4 right-0 w-4 h-4 text-background" viewBox="0 0 20 20" fill="currentColor">
            <path d="M20 20V0H0c11.046 0 20 8.954 20 20z" />
          </svg>
        </div>

        {/* Custom following cursor */}
        <div
          className={`absolute pointer-events-none flex items-center justify-center w-16 h-16 bg-white/40 backdrop-blur-md rounded-full shadow-lg transition-opacity duration-300 z-20 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
          style={{
            left: mousePos.x,
            top: mousePos.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <ArrowUpRight className="w-8 h-8 text-white drop-shadow-sm" />
        </div>
      </div>

      {/* Details underneath the image */}
      <div className="flex flex-col px-1">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[12px] text-muted-foreground font-bold uppercase">{article.date}</p>
          {!hideEcosystemLabel && article.ecosystem && (
            <span className="inline-block px-4 py-1.5 bg-secondary text-secondary-foreground text-[12px] font-bold rounded-[20px]">
              {article.ecosystem}
            </span>
          )}
        </div>
        <h3 className="text-[16px] font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {article.title}
        </h3>
        <p className="text-[14px] text-muted-foreground/80 line-clamp-2 leading-relaxed">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
};

export default ArticleCard;
