import { Link, useLocation } from "wouter";
import {
  Sparkles,
  History,
  Menu,
  Sparkle,
  Sun,
  Moon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-provider";

function NavLinks({
  isActive,
  className = "",
}: {
  isActive: (path: string) => boolean;
  className?: string;
}) {
  return (
    <nav className={`flex items-center gap-1 ${className}`}>
      <Link
        href="/generator"
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
          isActive("/generator")
            ? "bg-white dark:bg-[#252d3d] text-primary shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200/50 dark:hover:bg-white/10"
        }`}
      >
        <Sparkle className="w-4 -mt-2 h-4" />
        <Sparkle className="-ml-3 w-3 h-3 text-gray-500 dark:text-gray-400" />
        Generator
      </Link>
      <Link
        href="/history"
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
          isActive("/history")
            ? "bg-white dark:bg-[#252d3d] text-primary shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200/50 dark:hover:bg-white/10"
        }`}
      >
        <History className="w-4 h-4" />
        History
      </Link>
    </nav>
  );
}

export function Header() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/60 dark:bg-[#0e1117]/70 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
            ContentForge
          </span>
        </Link>

        <div className="flex items-center gap-8">
          {/* Desktop Navigation */}
          <NavLinks
            isActive={isActive}
            className="hidden md:flex bg-gray-100/60 dark:bg-white/5 p-1 rounded-full border border-gray-200/60 dark:border-white/10"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* AI Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/25 text-green-700 dark:text-green-400 rounded-full border border-green-200 dark:border-green-800/60 shadow-sm font-mono text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            AI Ready
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            data-testid="button-toggle-theme"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden w-9 h-9 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px] p-6 bg-background border-border">
              <SheetTitle className="text-left mb-6 text-foreground">Navigation</SheetTitle>
              <div className="flex flex-col gap-4 mt-8">
                <Link
                  href="/generator"
                  className={`flex items-center gap-3 p-3 rounded-xl text-base font-medium transition-all ${
                    isActive("/generator")
                      ? "bg-primary/5 dark:bg-primary/10 text-primary"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  <Sparkle className="w-4 -mt-2 h-4" />
                  <Sparkle className="-ml-3 w-3 h-3 text-gray-500" />
                  Generator
                </Link>
                <Link
                  href="/history"
                  className={`flex items-center gap-3 p-3 rounded-xl text-base font-medium transition-all ${
                    isActive("/history")
                      ? "bg-primary/5 dark:bg-primary/10 text-primary"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  <History className="w-5 h-5" />
                  History
                </Link>
              </div>

              <div className="absolute bottom-8 left-6 right-6">
                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/25 text-green-700 dark:text-green-400 rounded-xl border border-green-100 dark:border-green-800/50 font-mono text-xs font-medium">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  AI Status: Operational
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
