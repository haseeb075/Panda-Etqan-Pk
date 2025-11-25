"use client";

import React from "react";
import { Menu, LogIn } from "lucide-react";

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="bg-green-bg text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center ">
            <h1 className="text-xl font-bold">Etqan</h1>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button className="bg-green-bg hover:bg-[#003a15] px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Login
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-lg hover:bg-[#003a15] transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
