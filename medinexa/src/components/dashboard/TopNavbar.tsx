"use client";

import { FiMenu } from "react-icons/fi";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";

interface TopNavbarProps {
  onMobileMenuToggle: () => void;
}

export default function TopNavbar({ onMobileMenuToggle }: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="flex lg:hidden h-9 w-9 items-center justify-center rounded-xl border border-border text-body hover:text-heading hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            aria-label="Open sidebar menu"
          >
            <FiMenu className="h-4.5 w-4.5" />
          </button>
          <SearchBar />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <NotificationDropdown />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
