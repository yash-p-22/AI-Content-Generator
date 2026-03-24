import { Link, useLocation } from "wouter";
import { LayoutTemplate, Wand2, History, Settings, Sun, Moon, Sparkles } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex flex-col items-center gap-1 py-3 px-2 rounded-xl cursor-pointer transition-all duration-200 w-full",
          active
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <div
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200",
            active
              ? "bg-primary/10 dark:bg-primary/15"
              : "hover:bg-muted"
          )}
        >
          {icon}
        </div>
        <span className="text-[10px] font-semibold tracking-wide leading-none">
          {label}
        </span>
      </div>
    </Link>
  );
}

export function Sidebar() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="hidden md:flex w-[72px] flex-shrink-0 flex flex-col items-center border-r border-border bg-card py-4 h-full z-30">
      {/* Logo */}
      <div className="mb-4 w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
        <Sparkles className="w-4 h-4 text-white" />
      </div>

      {/* Nav items */}
      <nav className="flex flex-col items-center gap-1 w-full px-2 flex-1">
        <NavItem
          href="/generator"
          icon={
            <Wand2
              className={cn(
                "w-5 h-5 transition-colors",
                location === "/generator" ? "text-primary" : "text-muted-foreground"
              )}
            />
          }
          label="Generate"
          active={location === "/generator"}
        />
        <NavItem
          href="/history"
          icon={
            <History
              className={cn(
                "w-5 h-5 transition-colors",
                location === "/history" ? "text-primary" : "text-muted-foreground"
              )}
            />
          }
          label="History"
          active={location === "/history"}
        />
      </nav>

      {/* Bottom: Theme toggle + AI badge */}
      <div className="flex flex-col items-center gap-3 mt-auto">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
          aria-label="Toggle theme"
          data-testid="button-sidebar-toggle-theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 border border-primary/20 flex items-center justify-center overflow-hidden">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=man"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </aside>
  );
}
