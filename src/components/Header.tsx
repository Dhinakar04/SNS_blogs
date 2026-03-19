import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, X, ChevronDown, Menu } from "lucide-react";
import { categories, institutionalHub, productsAndServices } from "@/data/mockData";
import { useArticles } from "@/hooks/useArticles";

const Header = () => {
  const { data: articles = [] } = useArticles();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [catOpen, setCatOpen] = useState(false);
  const [instOpen, setInstOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [mobileInstOpen, setMobileInstOpen] = useState(false);
  const [mobileProdOpen, setMobileProdOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navLink = (path: string) =>
    `px-2 xl:px-3 py-2 text-sm font-medium transition-colors ${pathname === path
      ? "text-foreground font-bold"
      : "text-muted-foreground hover:text-foreground"
    }`;

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const filteredResults = searchQuery.length > 1
    ? articles.filter(a =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.ecosystem.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5)
    : [];

  return (
    <>
      <header className="sticky top-0 z-50 h-16 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container-blog h-full flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/sns-logo.png" alt="SNS Groups" className="h-[44px] object-contain" />
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5 min-w-0">
            <Link to="/" className={navLink("/")}>Home</Link>

            <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
              <button className={`px-2 xl:px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${pathname === "/latest" ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
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
              <button className={`px-2 xl:px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${instOpen ? "text-foreground" : "text-muted-foreground hover:text-foreground"
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
              <button className={`px-2 xl:px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${prodOpen ? "text-foreground" : "text-muted-foreground hover:text-foreground"
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
          </nav >

          <div className="flex items-center gap-2 relative">
            <div className="hidden lg:flex items-center">
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

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Search Results (Desktop) */}
          {
            searchOpen && filteredResults.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-background border border-border rounded-md shadow-sm py-2 max-h-80 overflow-y-auto overflow-x-hidden">
                {filteredResults.map(a => (
                  <button
                    key={a.id}
                    onClick={() => { navigate(`/article/${a.id}`); setSearchOpen(false); setSearchQuery(""); }}
                    className="w-full text-left px-4 py-3 hover:bg-secondary transition-colors"
                  >
                    <p className="text-sm font-medium text-foreground line-clamp-1">{a.title}</p>
                    <p className="metadata mt-1">{a.category} · {a.ecosystem}</p>
                  </button>
                ))
                }
              </div >
            )}
        </div >
      </header >

      {/* Mobile Menu Overlay */}
      {
        menuOpen && (
          <div className="fixed inset-0 top-16 bg-background/90 backdrop-blur-md z-[110] overflow-y-auto lg:hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="container-blog py-8 flex flex-col gap-6">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="text-xl font-bold px-4 py-2 hover:bg-secondary rounded-lg transition-colors"
              >
                Home
              </Link>

              {/* Categories Accordion */}
              <div className="flex flex-col">
                <button
                  onClick={() => setMobileCatOpen(!mobileCatOpen)}
                  className="flex items-center justify-between text-xl font-bold px-4 py-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  Categories <ChevronDown className={`w-5 h-5 transition-transform ${mobileCatOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileCatOpen && (
                  <div className="px-8 flex flex-col gap-3 py-4 bg-secondary/30 rounded-lg mt-2 mx-4">
                    {categories.map(c => (
                      <Link
                        key={c}
                        to={`/latest?category=${encodeURIComponent(c)}`}
                        onClick={() => setMenuOpen(false)}
                        className="text-base text-muted-foreground hover:text-foreground"
                      >
                        {c}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Institutional Hub Accordion */}
              <div className="flex flex-col">
                <button
                  onClick={() => setMobileInstOpen(!mobileInstOpen)}
                  className="flex items-center justify-between text-xl font-bold px-4 py-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  Institutional Hub <ChevronDown className={`w-5 h-5 transition-transform ${mobileInstOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileInstOpen && (
                  <div className="px-8 flex flex-col gap-3 py-4 bg-secondary/30 rounded-lg mt-2 mx-4">
                    {institutionalHub.map(h => (
                      <Link
                        key={h}
                        to={`/latest?ecosystem=${encodeURIComponent(h)}`}
                        onClick={() => setMenuOpen(false)}
                        className="text-base text-muted-foreground hover:text-foreground"
                      >
                        {h}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Products & Services Accordion */}
              <div className="flex flex-col">
                <button
                  onClick={() => setMobileProdOpen(!mobileProdOpen)}
                  className="flex items-center justify-between text-xl font-bold px-4 py-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  Products & Services <ChevronDown className={`w-5 h-5 transition-transform ${mobileProdOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileProdOpen && (
                  <div className="px-8 flex flex-col gap-3 py-4 bg-secondary/30 rounded-lg mt-2 mx-4">
                    {productsAndServices.map(p => (
                      <Link
                        key={p}
                        to={`/latest?ecosystem=${encodeURIComponent(p)}`}
                        onClick={() => setMenuOpen(false)}
                        className="text-base text-muted-foreground hover:text-foreground"
                      >
                        {p}
                      </Link>
                    ))}
                  </div>
                )
                }
              </div >

              <Link
                to="/latest"
                onClick={() => setMenuOpen(false)}
                className="text-xl font-bold px-4 py-2 hover:bg-secondary rounded-lg transition-colors"
              >
                Latest
              </Link>
              <Link
                to="/popular"
                onClick={() => setMenuOpen(false)}
                className="text-xl font-bold px-4 py-2 hover:bg-secondary rounded-lg transition-colors"
              >
                Popular
              </Link>
            </div >
          </div >
        )}
    </>
  );
};

export default Header;
