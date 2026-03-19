import { Link, useLocation } from "react-router-dom";
import { Home, Zap, Flame, TrendingUp, Search } from "lucide-react";

const MobileNav = () => {
    const { pathname } = useLocation();

    const navItems = [
        { label: "Home", path: "/", icon: Home },
        { label: "Latest", path: "/latest", icon: Zap },
        { label: "Popular", path: "/popular", icon: TrendingUp },
        { label: "Trending", path: "/trending", icon: Flame },
        { label: "Search", path: "#", icon: Search }, // Generic search placeholder
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-[420px] md:hidden">
            <div className="bg-[#1a1a1a] backdrop-blur-xl border border-white/5 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] px-3 py-3 underline-none">
                <nav className="flex items-center justify-between px-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={`flex flex-col items-center gap-1.5 px-3 py-1 transition-all duration-300 relative group no-underline`}
                            >
                                <div
                                    className={`transition-all duration-300 ${isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? "scale-110" : "scale-100"}`} />
                                </div>
                                <span
                                    className={`text-[9px] font-bold uppercase tracking-[0.1em] transition-all duration-300 ${isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                                        }`}
                                >
                                    {item.label}
                                </span>

                                {/* Active Indicator Line at Top */}
                                {isActive && (
                                    <div className="absolute -top-[12px] left-1/2 -translate-x-1/2 w-10 h-[3px] bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default MobileNav;
