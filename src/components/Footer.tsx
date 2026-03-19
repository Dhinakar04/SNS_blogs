import { Link } from "react-router-dom";
import { Linkedin, Youtube, ArrowUpRight } from "lucide-react";
import { categories } from "@/data/mockData";

const Footer = () => (
  <footer className="w-full bg-[#f8f8f8] border-t border-border pt-20 pb-12 px-6 md:px-12 lg:px-24 font-sans text-foreground">
    <div className="max-w-[1400px] mx-auto">
      {/* Top Section with Logo and Tagline */}
      <div className="flex flex-col md:flex-row justify-between items-start pb-16 border-b border-border/70">
        <div className="flex-1">
          <Link to="/" className="inline-block mb-6">
            <img src="/sns-logo.png" alt="SNS Groups" className="h-[60px] object-contain" />
          </Link>
          <div className="max-w-[500px] flex items-center gap-10">
            <h3 className="text-[18px] font-bold text-foreground leading-[1.4] whitespace-nowrap">
              Redesigning Common Mind &<br />Business Towards Excellence
            </h3>
            <div className="hidden md:block h-[1px] w-20 bg-border/50"></div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-16 gap-y-12 mt-12 md:mt-0 flex-[2]">
          <div>
            <h4 className="text-[11px] font-bold text-foreground uppercase tracking-widest mb-8">Navigation</h4>
            <ul className="flex flex-col gap-5">
              {[
                { label: 'Home', path: '/' },
                { label: 'Latest', path: '/latest' },
                { label: 'Popular', path: '/popular' },
                { label: 'Trending', path: '/trending' }
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="text-[14px] text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-foreground uppercase tracking-widest mb-8">SNS Ecosystem</h4>
            <ul className="flex flex-col gap-5">
              {[
                { label: 'SNS Square Technologies', url: 'https://www.snssquare.com/' },
                { label: 'SNS Innovation Hub', url: 'https://snsihub.ai/' },
                { label: 'SNS Institutions', url: 'https://main.snsgroups.com/' },
                { label: 'SNS SPINE', url: 'https://snsspine.in/' }
              ].map(link => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    {link.label} <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-foreground uppercase tracking-widest mb-8">Categories</h4>
            <ul className="flex flex-col gap-5">
              {categories.slice(0, 7).map(c => (
                <li key={c}>
                  <Link to={`/latest?category=${encodeURIComponent(c)}`} className="text-[14px] text-muted-foreground hover:text-foreground transition-colors">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 py-16 border-b border-border/70">
        <div>
          <h4 className="text-[11px] font-bold text-foreground uppercase tracking-widest mb-6">Coimbatore</h4>
          <p className="text-[14px] text-foreground font-bold mb-3">Headquarters</p>
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            536, Thudiyalur - Saravanampatti Rd,<br />
            Vellakinar, Coimbatore,<br />
            Tamil Nadu 641029, India
          </p>
        </div>

        <div>
          <h4 className="text-[11px] font-bold text-foreground uppercase tracking-widest mb-6">Bengaluru</h4>
          <p className="text-[14px] text-foreground font-bold mb-3">Strategic Office</p>
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            Embassy Tech Village, ORR, Bellandur,<br />
            Bengaluru,<br />
            Karnataka 560103, India
          </p>
        </div>

        <div>
          <h4 className="text-[11px] font-bold text-foreground uppercase tracking-widest mb-6">Contact</h4>
          <p className="text-[14px] text-foreground font-bold mb-3">Reach Us</p>
          <div className="flex flex-col gap-2.5">
            <p className="text-[14px] text-muted-foreground">
              <span className="font-semibold text-foreground/80">Whatsapp:</span> +91 95664 23456
            </p>
            <p className="text-[14px] text-muted-foreground">
              <span className="font-semibold text-foreground/80">Info:</span> ero.cgc@snsgroups.com
            </p>
            <p className="text-[14px] text-muted-foreground">
              <span className="font-semibold text-foreground/80">Careers:</span> job@snsgroups.com
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="flex flex-col md:flex-row justify-between items-center pt-10 gap-4">
        <p className="text-[12px] text-muted-foreground font-medium">© 2026 SNS Ecosystem. All rights reserved.</p>
        <div className="flex items-center gap-6 text-[12px] text-muted-foreground font-medium">
          <div className="flex items-center gap-4">
            <Link to="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <span className="text-border">·</span>
            <Link to="#" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <a href="#" className="flex justify-center items-center w-8 h-8 bg-black/5 hover:bg-black/10 transition-colors rounded-sm text-foreground">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="flex justify-center items-center w-8 h-8 bg-black/5 hover:bg-black/10 transition-colors rounded-sm text-foreground">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
