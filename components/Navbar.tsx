"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Code2, LogOut, User } from "lucide-react";
import { auth } from "@/app/firebase/config";
import { logoutUser } from "@/app/firebase/authMethods";
import { onAuthStateChanged, type User as FBUser } from "firebase/auth";
import { toast } from "sonner";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const appLinks = [
  { href: "/home", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/practice", label: "Practice" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/projects", label: "Projects" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<FBUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await logoutUser();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const links = user ? appLinks : publicLinks;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(2,2,8,0.95)" : "rgba(2,2,8,0.75)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: `1px solid ${scrolled ? "rgba(0,255,135,0.1)" : "transparent"}`,
      }}
    >
      <div className="container flex items-center justify-between h-16 md:h-[72px]">
        {/* Logo */}
        <Link href={user ? "/home" : "/"} className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
            style={{ background: "rgba(0,255,135,0.1)", border: "1px solid rgba(0,255,135,0.25)", boxShadow: "0 0 12px rgba(0,255,135,0.1)" }}>
            <Code2 className="w-5 h-5" style={{ color: "var(--neon-green)" }} />
          </div>
          <span className="font-heading text-sm font-700 tracking-[0.18em] hidden sm:block"
            style={{ color: "var(--neon-green)", textShadow: "0 0 12px rgba(0,255,135,0.4)" }}>
            CODEBUDDY
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== "/" && l.href !== "/home" && pathname.startsWith(l.href)) || pathname === l.href;
            return (
              <Link key={l.href} href={l.href}
                className={`px-3 py-2 rounded-lg font-heading text-[10px] font-600 tracking-[0.1em] uppercase transition-all ${
                  active ? "bg-[rgba(0,255,135,0.08)] text-[var(--neon-green)]" : "text-white/38 hover:text-white/65 hover:bg-white/4"
                }`}
                style={active ? { textShadow: "0 0 8px rgba(0,255,135,0.5)" } : {}}>
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop auth actions */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          {!authLoading && (user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: "rgba(0,255,135,0.06)", border: "1px solid rgba(0,255,135,0.12)" }}>
                <User className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--neon-green)" }} />
                <span className="text-xs font-mono text-white/50 max-w-[120px] truncate">
                  {user.displayName || user.email?.split("@")[0]}
                </span>
              </div>
              <button onClick={handleLogout} className="btn-neon py-2 px-4 text-[10px]">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-neon py-2 px-5 text-[10px]">Login</Link>
              <Link href="/signup" className="btn-neon btn-neon-solid py-2 px-5 text-[10px]">Sign Up</Link>
            </>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
          style={{ background: open ? "rgba(0,255,135,0.1)" : "transparent", border: "1px solid rgba(0,255,135,0.2)", color: "var(--neon-green)" }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden" style={{ background: "rgba(2,2,8,0.98)", borderTop: "1px solid rgba(0,255,135,0.08)" }}>
          <div className="container py-5">
            <div className="flex flex-col gap-1 mb-5">
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link key={l.href} href={l.href}
                    className={`py-3 px-4 rounded-xl text-sm font-mono transition-all ${
                      active
                        ? "bg-[rgba(0,255,135,0.1)] text-[var(--neon-green)] border border-[rgba(0,255,135,0.2)]"
                        : "text-white/40 hover:text-white/70 hover:bg-white/4 border border-transparent"
                    }`}>
                    {l.label}
                  </Link>
                );
              })}
            </div>
            <div className="pt-4 border-t border-[rgba(0,255,135,0.08)] flex flex-col gap-2">
              {!authLoading && (user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
                    style={{ background: "rgba(0,255,135,0.05)", border: "1px solid rgba(0,255,135,0.1)" }}>
                    <User className="w-4 h-4" style={{ color: "var(--neon-green)" }} />
                    <span className="text-sm font-mono text-white/50 truncate">{user.displayName || user.email?.split("@")[0]}</span>
                  </div>
                  <button onClick={handleLogout} className="btn-neon w-full justify-center py-3 text-[11px]">
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-neon w-full justify-center py-3 text-[11px]">Login</Link>
                  <Link href="/signup" className="btn-neon btn-neon-solid w-full justify-center py-3 text-[11px]">Sign Up</Link>
                </>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
