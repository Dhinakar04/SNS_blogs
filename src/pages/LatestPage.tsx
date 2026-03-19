import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import { categories, institutionalHub, productsAndServices } from "@/data/mockData";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useArticles } from "@/hooks/useArticles";

const LatestPage = () => {
  const { data: allArticles = [], isLoading } = useArticles();
  const [searchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [selectedEcosystem, setSelectedEcosystem] = useState(searchParams.get("ecosystem") || "All");
  const [sort, setSort] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "All");
    setSelectedEcosystem(searchParams.get("ecosystem") || "All");
    setCurrentPage(1);
  }, [searchParams]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[70vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  let articles = [...allArticles];

  if (selectedCategory !== "All") {
    articles = articles.filter(a => a.category === selectedCategory);
  }
  if (selectedEcosystem !== "All") {
    articles = articles.filter(a => a.ecosystem === selectedEcosystem);
  }
  if (sort === "Oldest") {
    articles = [...articles].reverse();
  }

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const paginatedArticles = articles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <Layout>
      <div className="container-blog section-spacing">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl">Latest Articles</h1>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-4 pr-10 py-2 border border-border rounded-[20px] text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
          </div>
          <div className="relative">
            <select
              value={selectedEcosystem}
              onChange={e => { setSelectedEcosystem(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-4 pr-10 py-2 border border-border rounded-[20px] text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="All">All Hubs & Services</option>
              <optgroup label="Institutional Hub">
                {institutionalHub.map(h => <option key={h} value={h}>{h}</option>)}
              </optgroup>
              <optgroup label="Products & Services">
                {productsAndServices.map(p => <option key={p} value={p}>{p}</option>)}
              </optgroup>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
          </div>
          <div className="relative">
            <select
              value={sort}
              onChange={e => { setSort(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-4 pr-10 py-2 border border-border rounded-[20px] text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option>Newest</option>
              <option>Oldest</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
          </div>
        </div>

        {articles.length === 0 ? (
          <p className="text-muted-foreground">No articles found for the selected filters.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedArticles.map(a => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center w-full mt-16 pt-4 pb-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center p-2 hover:bg-secondary rounded-full transition-colors disabled:opacity-30 group"
                >
                  <ArrowLeft className="w-[18px] h-[18px] text-foreground" />
                </button>
                <div className="flex-1 h-[1px] bg-border mx-4"></div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center p-2 hover:bg-secondary rounded-full transition-colors disabled:opacity-30 group mr-8"
                >
                  <ArrowRight className="w-[18px] h-[18px] text-foreground" />
                </button>
                <div className="flex items-center gap-5 text-[14px] font-bold">
                  {getPageNumbers().map((pageNum, idx) => (
                    <button
                      key={idx}
                      onClick={() => typeof pageNum === "number" && setCurrentPage(pageNum)}
                      disabled={typeof pageNum !== "number"}
                      className={`transition-colors ${pageNum === currentPage
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
          </>
        )}
      </div>
    </Layout>
  );
};

export default LatestPage;
