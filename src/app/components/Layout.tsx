import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header onMenuToggle={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
