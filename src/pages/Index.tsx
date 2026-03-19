import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import { categories, institutionalHub, productsAndServices } from "@/data/mockData";
import { ArrowUpRight, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useArticles } from "@/hooks/useArticles";

const getBadgeColor = (text: string) => {
  if (!text) return "bg-rose-100 text-rose-800";
  const hash = text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    "bg-emerald-100 text-emerald-800",
    "bg-rose-100 text-rose-800",
    "bg-amber-100 text-amber-800",
    "bg-sky-100 text-sky-800",
    "bg-indigo-100 text-indigo-800",
  ];
  return colors[hash % colors.length];
};

const Index = () => {
  const { data: articles = [], isLoading } = useArticles();

  const featured = articles.length > 0 ? articles[0] : null;
  const mostViewed = [...articles].sort((a, b) => b.likes - a.likes).slice(0, 5);
  const trending = [...articles].sort((a, b) => parseInt(b.views) - parseInt(a.views)).slice(0, 6);
  const recentArticles = articles;

  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const [showAllInst, setShowAllInst] = useState(false);
  const [recentCurrentPage, setRecentCurrentPage] = useState(1);
  const trendingScrollRef = useRef<HTMLDivElement>(null);
  const RECENT_ITEMS_PER_PAGE = 9;
  const recentTotalPages = Math.ceil(recentArticles.length / RECENT_ITEMS_PER_PAGE);
  const paginatedRecent = recentArticles.slice((recentCurrentPage - 1) * RECENT_ITEMS_PER_PAGE, recentCurrentPage * RECENT_ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (recentTotalPages <= 7) {
      for (let i = 1; i <= recentTotalPages; i++) pages.push(i);
    } else {
      if (recentCurrentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', recentTotalPages);
      } else if (recentCurrentPage >= recentTotalPages - 3) {
        pages.push(1, '...', recentTotalPages - 4, recentTotalPages - 3, recentTotalPages - 2, recentTotalPages - 1, recentTotalPages);
      } else {
        pages.push(1, '...', recentCurrentPage - 1, recentCurrentPage, recentCurrentPage + 1, '...', recentTotalPages);
      }
    }
    return pages;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const getArticlesByEcosystem = (eco: string) =>
    articles.filter(a => a.ecosystem === eco);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[70vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!featured) return null;

  return (
    <Layout>
      {/* Hero */}
      <section className="container-blog section-spacing pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left: Featured Article */}
          <div className="lg:col-span-8">
            <h2 className="text-sm font-semibold text-muted-foreground mb-4">Featured article</h2>
            <Link to={`/article/${featured.id}`} className="group block w-full no-underline outline-none">
              <div
                ref={imageRef}
                className="relative rounded-[20px] overflow-hidden aspect-[4/3] bg-muted cursor-none"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay for text readability (gradient) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Top-right "NEW" badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-[#D4FF00] text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider">
                    New
                  </span>
                </div>

                {/* Bottom content: Tags & Title */}
                <div className="absolute bottom-8 left-8 pr-8 z-10">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {featured.category && (
                      <span className={`px-3 py-1.5 text-[12px] font-bold rounded-full shadow-sm ${getBadgeColor(featured.category)}`}>
                        {featured.category}
                      </span>
                    )}
                    {featured.ecosystem && (
                      <span className={`px-3 py-1.5 text-[12px] font-bold rounded-full shadow-sm ${getBadgeColor(featured.ecosystem)}`}>
                        {featured.ecosystem}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl text-white font-bold leading-tight group-hover:opacity-90 transition-opacity">
                    {featured.title}
                  </h1>
                </div>

                {/* Custom following cursor */}
                <div
                  className={`absolute pointer-events-none flex items-center justify-center w-20 h-20 bg-white/30 backdrop-blur-md rounded-full shadow-lg transition-opacity duration-300 z-20 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    left: mousePos.x,
                    top: mousePos.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <ArrowUpRight className="w-10 h-10 text-white drop-shadow-sm" />
                </div>
              </div>
            </Link>
          </div>

          {/* Right: Most Viewed */}
          <div className="lg:col-span-4 flex flex-col lg:border-l lg:border-border/80 lg:pl-10">
            <h2 className="text-sm font-semibold text-muted-foreground mb-4">Most viewed</h2>
            <div className="flex flex-col flex-1 gap-0">
              {mostViewed.map((a, index) => (
                <Link
                  key={a.id}
                  to={`/article/${a.id}`}
                  className="flex items-start gap-4 py-5 border-b border-border/60 last:border-0 group no-underline"
                >
                  <span className="text-5xl font-light text-muted-foreground/30 leading-none">{index + 1}</span>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="text-[17px] font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {a.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1.5">
                      {a.date} • {a.readTime}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Strip */}
      <section className="mt-6">
        <div className="container-blog py-10 border-t border-border/80">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Trending</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => trendingScrollRef.current?.scrollBy({ left: -420, behavior: "smooth" })}
                className="flex items-center justify-center w-8 h-8 bg-secondary hover:bg-secondary/70 rounded-full transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-foreground" />
              </button>
              <button
                onClick={() => trendingScrollRef.current?.scrollBy({ left: 420, behavior: "smooth" })}
                className="flex items-center justify-center w-8 h-8 bg-secondary hover:bg-secondary/70 rounded-full transition-colors"
              >
                <ArrowRight className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>
          <div ref={trendingScrollRef} className="flex overflow-x-auto gap-6 pb-6 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {trending.map((a) => (
              <div key={a.id} className="w-[85vw] sm:w-[350px] lg:w-[400px] snap-start shrink-0">
                <ArticleCard article={a} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse categories */}
      <section>
        <div className="container-blog py-12 border-t border-border/80">
          <h2 className="text-[24px] font-bold mb-12">Browse categories</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-12">
            {categories.map(c => {
              const style = {
                "Events": { bg: "bg-[#e0f2fe]", emoji: "🎪", rotate: "-rotate-6" },
                "Achievements": { bg: "bg-[#fce7f3]", emoji: "🏆", rotate: "rotate-6" },
                "Success Stories": { bg: "bg-[#fef3c7]", emoji: "🚀", rotate: "-rotate-12" },
                "Placements": { bg: "bg-[#dcfce7]", emoji: "💼", rotate: "rotate-12" },
                "Innovation": { bg: "bg-[#f3e8ff]", emoji: "💡", rotate: "-rotate-6" },
                "Student Life": { bg: "bg-[#ffedd5]", emoji: "🎓", rotate: "rotate-6" },
                "Industry Insights": { bg: "bg-[#e0e7ff]", emoji: "📊", rotate: "-rotate-12" }
              }[c] || { bg: "bg-gray-100", emoji: "📌", rotate: "rotate-0" };

              return (
                <Link
                  key={c}
                  to={`/latest?category=${encodeURIComponent(c)}`}
                  className={`group relative flex-1 min-w-[140px] max-w-[180px] flex items-end justify-center h-[90px] rounded-[20px] transition-transform hover:-translate-y-1 ${style.bg} no-underline`}
                >
                  {/* Sticker Emoji */}
                  <div className="absolute -top-8 flex items-center justify-center pointer-events-none">
                    <div
                      className={`text-[55px] transition-transform duration-300 group-hover:scale-110 ${style.rotate}`}
                      style={{ filter: "drop-shadow(0px 8px 8px rgba(0,0,0,0.15)) drop-shadow(0px 0px 2px white)" }}
                    >
                      {style.emoji}
                    </div>
                  </div>
                  <p className="font-bold text-[14px] text-zinc-900 pb-3">{c}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hubs & Services Highlights */}
      <section>
        <div className="container-blog py-10 border-t border-border/80">
          <h2 className="text-xl font-bold mb-8">Hubs & Services Highlights</h2>
          <div className="flex flex-col">
            {[...institutionalHub, ...productsAndServices].slice(0, showAllInst ? institutionalHub.length + productsAndServices.length : 1).map(eco => {
              const ecoArticles = getArticlesByEcosystem(eco);
              if (ecoArticles.length === 0) return null;
              return (
                <div key={eco} className="mb-10 pb-10 border-b border-border/80 last:border-0 last:pb-0 last:mb-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold">{eco}</h3>
                    <Link to={`/latest?ecosystem=${encodeURIComponent(eco)}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">More →</Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {ecoArticles.slice(0, 3).map(a => (
                      <ArticleCard key={a.id} article={a} variant="compact" hideEcosystemLabel />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="relative flex justify-center mt-10 mb-2">
            <div className="absolute inset-0 flex items-center pointer-events-none">
              <div className="w-full border-t border-border/80"></div>
            </div>
            <div className="relative bg-background px-4">
              <button
                onClick={() => setShowAllInst(!showAllInst)}
                className="px-6 py-2.5 bg-secondary text-secondary-foreground text-[13px] font-bold rounded-[20px] hover:bg-secondary/80 transition-colors"
              >
                {showAllInst ? "Show less" : "Show more"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Article List */}
      <section>
        <div className="container-blog py-10">
          <h2 className="text-xl font-bold mb-2">Latest Article</h2>
          <p className="metadata mb-8 text-muted-foreground">Recently uploaded articles</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedRecent.map(a => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>

          {recentTotalPages > 1 && (
            <div className="flex items-center w-full mt-10">
              <button
                onClick={() => setRecentCurrentPage(p => Math.max(1, p - 1))}
                disabled={recentCurrentPage === 1}
                className="flex items-center justify-center p-2 hover:bg-secondary rounded-full transition-colors disabled:opacity-30 group"
              >
                <ArrowLeft className="w-[18px] h-[18px] text-foreground" />
              </button>
              <div className="flex-1 h-[1px] bg-border mx-4"></div>
              <button
                onClick={() => setRecentCurrentPage(p => Math.min(recentTotalPages, p + 1))}
                disabled={recentCurrentPage === recentTotalPages}
                className="flex items-center justify-center p-2 hover:bg-secondary rounded-full transition-colors disabled:opacity-30 group mr-8"
              >
                <ArrowRight className="w-[18px] h-[18px] text-foreground" />
              </button>
              <div className="flex items-center gap-5 text-[14px] font-bold">
                {getPageNumbers().map((pageNum, idx) => (
                  <button
                    key={idx}
                    onClick={() => typeof pageNum === "number" && setRecentCurrentPage(pageNum)}
                    disabled={typeof pageNum !== "number"}
                    className={`transition-colors ${pageNum === recentCurrentPage
                      ? "text-foreground"
                      : typeof pageNum === "number"
                        ? "text-muted-foreground hover:text-foreground"
                        : "text-muted-foreground cursor-default"
                      }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
