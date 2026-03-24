import { Link, useLocation } from "wouter";
import { Wand2, History, Home as HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/generator", icon: Wand2, label: "Generate" },
    { href: "/history", icon: History, label: "History" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-t border-border z-50 flex items-center justify-around px-4 pb-safe">
      {navItems.map(({ href, icon: Icon, label }) => {
        const active = location === href;
        return (
          <Link key={href} href={href}>
            <div className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              active ? "text-primary" : "text-muted-foreground"
            )}>
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
