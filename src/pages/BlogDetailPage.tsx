import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import AISummaryBlock from "@/components/AISummaryBlock";
import { Heart, Share2, Linkedin, Twitter, MessageCircle, Link as LinkIcon, ArrowLeft, Loader2 } from "lucide-react";
import { useArticles } from "@/hooks/useArticles";

const getInstituionColor = (text: string) => {
  const map: Record<string, string> = {
    "Engineering": "#FECC00",
    "Technology": "#E31E24",
    "Arts": "#B0CB1F",
    "Nursing": "#E5097F",
    "Pharmacy": "#058D7A",
    "School": "#EF7F1A",
    "Physiotherapy": "#9298CB",
    "Allied Health Science": "#00A0E3",
    "B.Ed": "#009846",
    "Square": "#064ee3",
    "SNS Square": "#064ee3",
    "iHub": "#FECC00",
    "SNS iHub": "#FECC00"
  };
  return map[text] || "rgba(255,255,255,0.2)";
};

const getBadgeColor = (text: string) => {
  const map: Record<string, string> = {
    "Events": "bg-blue-100 text-blue-700",
    "Achievements": "bg-pink-100 text-pink-700",
    "Success Stories": "bg-yellow-100 text-yellow-700",
    "Placements": "bg-green-100 text-green-700",
    "Innovation": "bg-purple-100 text-purple-700",
    "Student Life": "bg-orange-100 text-orange-700",
    "Industry Insights": "bg-indigo-100 text-indigo-700"
  };
  return map[text] || "bg-gray-100 text-gray-700";
};

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: articles = [], isLoading } = useArticles();

  const article = articles.find(a => a.id === id);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (article && id) {
      // Load user status
      const userLiked = localStorage.getItem(`sns_liked_${id}`) === "true";
      setLiked(userLiked);

      // Load count from storage or article data
      const storedCount = localStorage.getItem(`sns_like_count_${id}`);
      if (storedCount !== null) {
        setLikeCount(parseInt(storedCount, 10));
      } else {
        setLikeCount(article.likes);
      }
    }
  }, [article, id]);

  const toggleLike = () => {
    if (!id) return;
    const newLikedStatus = !liked;
    const newCount = newLikedStatus ? likeCount + 1 : likeCount - 1;

    setLiked(newLikedStatus);
    setLikeCount(newCount);

    localStorage.setItem(`sns_liked_${id}`, newLikedStatus.toString());
    localStorage.setItem(`sns_like_count_${id}`, newCount.toString());
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[70vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container-blog section-spacing text-center">
          <h1 className="text-2xl font-bold">Article not found</h1>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">Go home</Link>
        </div>
      </Layout>
    );
  }

  const related = articles.filter(a => a.id !== article.id && (a.category === article.category || a.ecosystem === article.ecosystem)).slice(0, 3);

  const content = article.content || `${article.excerpt}\n\nThis is a placeholder for the full article content. In a production environment, this would contain the complete article text with rich formatting, images, and embedded media.\n\n## Key Developments\n\nThe ${article.ecosystem} ecosystem continues to push boundaries in ${article.category.toLowerCase()}, setting new standards for institutional excellence.\n\n## Looking Ahead\n\nAs we move further into 2026, the initiatives described here will continue to evolve, creating lasting impact across the entire SNS Ecosystem.`;

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = article.title;
    const links: Record<string, string> = {
      linkedin: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
    };
    if (links[platform]) window.open(links[platform], "_blank");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      {/* Back button */}
      <div className="container-blog pt-6 pb-2">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      {/* Hero */}
      <div className="relative w-full aspect-video md:aspect-[21/9] max-h-[500px] overflow-hidden">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container-blog">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-block px-3 py-1.5 text-[10px] md:text-[11px] font-bold rounded-full border border-black/5 uppercase tracking-widest shadow-sm ${getBadgeColor(article.category)}`}>
                {article.category}
              </span>
              <span
                className="inline-block px-3 py-1 text-[10px] md:text-[11px] font-bold rounded-full backdrop-blur-md border border-white/20 uppercase tracking-widest shadow-sm"
                style={{
                  backgroundColor: getInstituionColor(article.ecosystem),
                  color: ["Engineering", "Arts", "School", "Physiotherapy", "iHub", "SNS iHub"].includes(article.ecosystem) ? "#000" : "#fff"
                }}
              >
                {article.ecosystem}
              </span>
            </div>
            <h1 className="text-2xl md:text-5xl font-bold text-white max-w-4xl leading-[1.2] drop-shadow-md">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 mt-3">
              <p className="text-xs md:text-base font-medium text-white/90 drop-shadow-sm">
                {article.author} · {article.date} · {article.readTime} read
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-blog py-6 md:py-12">
        <div className="flex gap-12 relative">
          {/* Share sidebar */}
          <aside className="hidden lg:block w-12 shrink-0">
            <div className="sticky top-20 flex flex-col items-center gap-4">
              <p className="metadata">Share</p>
              <button onClick={() => handleShare("linkedin")} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Linkedin className="w-4 h-4" /></button>
              <button onClick={() => handleShare("twitter")} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Twitter className="w-4 h-4" /></button>
              <button onClick={() => handleShare("whatsapp")} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><MessageCircle className="w-4 h-4" /></button>
              <button onClick={handleCopyLink} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><LinkIcon className="w-4 h-4" /></button>
              <div className="w-6 border-t border-border/60 my-1" />
              <button
                onClick={toggleLike}
                className={`flex flex-col items-center gap-1 p-2 transition-colors ${liked ? "text-rose-500" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-rose-500" : ""}`} />
                <span className="text-[11px] font-semibold">{likeCount}</span>
              </button>
            </div>
          </aside>

          {/* Main content */}
          <article className="flex-1 min-w-0 max-w-3xl">
            <AISummaryBlock
              articleTitle={article.title}
              articleExcerpt={article.excerpt}
              articleUrl={window.location.href}
            />

            {/* Article body */}
            <div className="prose-custom">
              {content.split("\n\n").map((para, i) => {
                if (para.startsWith("## ")) {
                  return <h2 key={i} className="mt-10 mb-4">{para.replace("## ", "")}</h2>;
                }
                return <p key={i} className="text-base text-foreground/90 leading-[1.7] mb-4">{para}</p>;
              })}
            </div>

            {/* Bottom bar */}
            <div className="flex items-center mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">{copied ? "Link copied!" : ""}</p>
            </div>
          </article>
        </div>

        {/* Mobile floating action bar */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-3 bg-secondary/80 backdrop-blur-xl border border-white/20 p-2 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all active:scale-90 ${liked ? "bg-rose-50 text-rose-500" : "hover:bg-rose-50/5 text-muted-foreground"}`}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-rose-500" : ""}`} />
            <span className="text-sm font-bold">{likeCount}</span>
          </button>
          <div className="w-[1px] h-6 bg-border/40" />
          <button
            onClick={() => handleShare("whatsapp")}
            className="p-2.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleCopyLink}
            className="p-2.5 text-muted-foreground hover:text-foreground transition-colors pr-4"
          >
            <LinkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border">
            <h2 className="text-xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {related.map(a => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default BlogDetailPage;
