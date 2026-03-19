import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Heart, Loader2 } from "lucide-react";
import { useArticles } from "@/hooks/useArticles";

const tabs = ["Today", "This Week", "This Month"];

const TrendingPage = () => {
  const { data: articles = [], isLoading } = useArticles();
  const [activeTab, setActiveTab] = useState("This Week");

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[70vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const filteredArticles = articles.filter(a => {
    const articleDate = new Date(a.date);
    if (isNaN(articleDate.getTime())) return true; // Keep if date is invalid

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - articleDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (activeTab === "Today") return diffDays <= 1;
    if (activeTab === "This Week") return diffDays <= 7;
    if (activeTab === "This Month") return diffDays <= 30;
    return true;
  });

  const trending = [...filteredArticles].sort((a, b) => {
    const viewsA = parseInt(a.views.replace(/[^0-9]/g, '')) || 0;
    const viewsB = parseInt(b.views.replace(/[^0-9]/g, '')) || 0;
    return viewsB - viewsA;
  });

  return (
    <Layout>
      <div className="container-blog section-spacing">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <p className="metadata mb-2">⚡ Trending</p>
            <h1 className="text-3xl md:text-4xl">What's Trending</h1>
          </div>

          <div className="flex gap-1 mb-10 border-b border-border">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col">
            {trending.length === 0 ? (
              <p className="text-muted-foreground text-center py-20">No trending articles found for this period.</p>
            ) : (
              trending.map((a, i) => (
                <Link
                  key={a.id}
                  to={`/article/${a.id}`}
                  className="flex items-start gap-6 md:gap-8 py-8 border-b border-border group"
                >
                  <span className="text-4xl font-bold text-border tabular-nums leading-none pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block px-2 py-0.5 bg-secondary text-muted-foreground text-[11px] font-medium rounded-[20px]">{a.category}</span>
                      <span className="inline-block px-2 py-0.5 bg-secondary text-muted-foreground text-[11px] font-medium rounded-[20px]">{a.ecosystem}</span>
                    </div>
                    <h3 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors">{a.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{a.excerpt}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <p className="metadata">{a.date} · {a.readTime} read · {a.views} views</p>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Heart className="w-3 h-3" />
                        <span className="text-xs">{a.likes}</span>
                      </span>
                    </div>
                  </div>
                  <div className="article-card-image w-24 h-24 flex-shrink-0 hidden sm:block">
                    <img src={a.image} alt={a.title} className="w-24 h-24 object-cover rounded-lg" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrendingPage;
