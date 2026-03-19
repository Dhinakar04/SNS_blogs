import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, X, ChevronDown } from "lucide-react";
import { categories, institutionalHub, productsAndServices } from "@/data/mockData";
import { useArticles } from "@/hooks/useArticles";

const Header = () => {
  const { data: articles = [] } = useArticles();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [catOpen, setCatOpen] = useState(false);
  const [instOpen, setInstOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navLink = (path: string) =>
    `px-3 py-2 text-sm font-medium transition-colors ${pathname === path
      ? "text-foreground font-bold"
      : "text-muted-foreground hover:text-foreground"
    }`;

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const filteredResults = searchQuery.length > 1
    ? articles.filter(a =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.ecosystem.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-50 h-16 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container-blog h-full flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/sns-logo.png" alt="SNS Groups" className="h-[44px] object-contain" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <Link to="/" className={navLink("/")}>Home</Link>

          <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${pathname === "/latest" ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
              }`}>
              Categories <ChevronDown className="w-3 h-3" />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 bg-background border border-border rounded-md shadow-sm py-2 min-w-[200px]">
                {categories.map(c => (
                  <Link key={c} to={`/latest?category=${encodeURIComponent(c)}`} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                    {c}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="relative" onMouseEnter={() => setInstOpen(true)} onMouseLeave={() => setInstOpen(false)}>
            <button className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${instOpen ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}>
              Institutional Hub <ChevronDown className="w-3 h-3" />
            </button>
            {instOpen && (
              <div className="absolute top-full left-0 bg-background border border-border rounded-md shadow-sm py-2 min-w-[220px]">
                {institutionalHub.map(h => (
                  <Link key={h} to={`/latest?ecosystem=${encodeURIComponent(h)}`} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                    {h}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="relative" onMouseEnter={() => setProdOpen(true)} onMouseLeave={() => setProdOpen(false)}>
            <button className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${prodOpen ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}>
              Products & Services <ChevronDown className="w-3 h-3" />
            </button>
            {prodOpen && (
              <div className="absolute top-full left-0 bg-background border border-border rounded-md shadow-sm py-2 min-w-[220px]">
                {productsAndServices.map(p => (
                  <Link key={p} to={`/latest?ecosystem=${encodeURIComponent(p)}`} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/latest" className={navLink("/latest")}>Latest</Link>
          <Link to="/popular" className={navLink("/popular")}>Popular</Link>
        </nav>

        <div className="flex items-center gap-2 relative">
          <div className="flex items-center">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`transition-all duration-300 ease-out bg-secondary border border-border rounded-md text-sm px-3 py-1.5 outline-none focus:ring-1 focus:ring-ring ${searchOpen ? "w-64 opacity-100" : "w-0 opacity-0 px-0 border-0"
                }`}
            />
            <button
              onClick={() => { setSearchOpen(!searchOpen); setSearchQuery(""); }}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>
          </div>

          {searchOpen && filteredResults.length > 0 && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-background border border-border rounded-md shadow-sm py-2 max-h-80 overflow-y-auto">
              {filteredResults.map(a => (
                <button
                  key={a.id}
                  onClick={() => { navigate(`/article/${a.id}`); setSearchOpen(false); setSearchQuery(""); }}
                  className="w-full text-left px-4 py-3 hover:bg-secondary transition-colors"
                >
                  <p className="text-sm font-medium text-foreground line-clamp-1">{a.title}</p>
                  <p className="metadata mt-1">{a.category} · {a.ecosystem}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
