import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Zap, TrendingUp, Search, X, Mic } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useArticles } from "@/hooks/useArticles";

const MobileNav = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { data: articles = [] } = useArticles();

    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    const navItems = [
        { label: "Home", path: "/", icon: Home },
        { label: "Latest", path: "/latest", icon: Zap },
        { label: "Popular", path: "/popular", icon: TrendingUp },
    ];

    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    const filteredResults = searchQuery.length > 1
        ? articles.filter(a =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.ecosystem.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 6)
        : [];

    return (
        <div className="fixed bottom-4 left-0 right-0 z-[100] px-6 md:hidden">
            <div className="flex flex-col gap-4 max-w-[420px] mx-auto">

                {/* Search Results Overlay */}
                {searchOpen && searchQuery.length > 1 && (
                    <div className="bg-white/90 backdrop-blur-2xl border border-white/20 rounded-[28px] shadow-2xl mb-2 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="p-2 space-y-1">
                            {filteredResults.length > 0 ? (
                                filteredResults.map(a => (
                                    <button
                                        key={a.id}
                                        onClick={() => {
                                            navigate(`/article/${a.id}`);
                                            setSearchOpen(false);
                                            setSearchQuery("");
                                        }}
                                        className="w-full text-left p-3 hover:bg-black/5 active:bg-black/10 transition-colors rounded-2xl group"
                                    >
                                        <p className="text-sm font-bold text-foreground line-clamp-1 group-active:scale-[0.98] transition-transform">{a.title}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-bold">{a.category} · {a.ecosystem}</p>
                                    </button>
                                ))
                            ) : (
                                <div className="p-6 text-center text-muted-foreground text-sm font-medium">No articles found</div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3">
                    {searchOpen ? (
                        <div className="flex-1 flex items-center bg-white/70 backdrop-blur-2xl border border-white/20 rounded-[32px] shadow-2xl transition-all duration-300 animate-in zoom-in-95 overflow-hidden pr-4">
                            <div className="p-3.5 text-muted-foreground">
                                <Search className="w-5 h-5 opacity-40" />
                            </div>
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-sm font-medium py-3 text-foreground placeholder:text-muted-foreground/50"
                            />
                            <Mic className="w-5 h-5 text-muted-foreground/40 mr-2" />
                            <button
                                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                                className="bg-black/5 p-1.5 rounded-full hover:bg-black/10 active:bg-black/20"
                            >
                                <X className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Main Navigation Pill */}
                            <div className="flex-1 bg-white/70 backdrop-blur-2xl border border-white/20 rounded-[32px] shadow-2xl py-1.5 px-1.5">
                                <nav className="flex items-center justify-between">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.path;
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.label}
                                                to={item.path}
                                                className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-[26px] transition-all duration-300 ${isActive ? "bg-white/80 shadow-sm" : "hover:bg-white/30"
                                                    } no-underline`}
                                            >
                                                <div className={isActive ? "text-primary bg-primary/10 p-1.5 rounded-full" : "text-muted-foreground"}>
                                                    <Icon className={`w-5 h-5 ${isActive ? "scale-110" : "scale-100"}`} />
                                                </div>
                                                <span className={`text-[9px] font-bold uppercase ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                                                    {item.label}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Toggle Search Button */}
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="w-14 h-14 bg-white/70 backdrop-blur-2xl border border-white/20 rounded-full shadow-2xl flex items-center justify-center text-foreground hover:bg-white transition-all duration-300 active:scale-90"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MobileNav;
