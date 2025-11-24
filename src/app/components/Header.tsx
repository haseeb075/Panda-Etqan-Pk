import React from "react";

const Header: React.FC = () => {
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
            <button className="bg-green-bg hover:bg-[#003a15] px-4 py-2 rounded-lg transition-colors">
              Login
            </button>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-[#003a15] transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 pt-4 border-t border-green-500">
          <nav className="flex flex-col space-y-3">
            <a
              href="#"
              className="hover:text-green-200 transition-colors py-2"
            ></a>
            <a href="#" className="hover:text-green-200 transition-colors py-2">
              About
            </a>
            <a href="#" className="hover:text-green-200 transition-colors py-2">
              Services
            </a>
            <a href="#" className="hover:text-green-200 transition-colors py-2">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
