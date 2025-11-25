"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SVGImage from "./SVGImage";
import EtqanSidebarLogo from "@/images/EtqanSidebarLogo.svg";
import {
  Home,
  BarChart3,
  Users,
  Package,
  DollarSign,
  ChevronsLeft,
  User,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: Home, label: "BACK MARGIN", href: "/back_margin" },
    { icon: BarChart3, label: "FRONT MARGIN", href: "/front_margin" },
    { icon: Users, label: "BACK MARGIN ADHOC", href: "/back_margin_adhoc" },
    { icon: Package, label: "ADMIN SCREEN", href: "/admin_screen" },
    { icon: DollarSign, label: "USER MANAGEMENT", href: "/user_management" },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        h-screen lg:h-full
        bg-white shadow-lg transform transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        ${isCollapsed ? "w-20" : "w-64"}
      `}
      >
        <div className="flex flex-col h-full m-0">
          {/* Sidebar Header */}
          <div className="p-4 border-b flex items-center justify-between relative">
            {!isCollapsed && (
              <div className="text-lg font-semibold text-gray-800 flex-1">
                <SVGImage
                  src={EtqanSidebarLogo}
                  alt="ETQAN LOGO"
                  width={120}
                  height={120}
                />
              </div>
            )}
            {isCollapsed && (
              <div className="flex justify-center w-full">
                <SVGImage
                  src={EtqanSidebarLogo}
                  alt="ETQAN LOGO"
                  width={110}
                  height={110}
                />
              </div>
            )}
            <button
              onClick={toggleCollapse}
              className={`p-2 rounded-lg hover:bg-gray-100 transition-colors lg:block hidden ${
                isCollapsed ? "absolute top-2 right-2" : ""
              }`}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronsLeft
                className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        // Close sidebar on mobile when navigating
                        if (onClose && typeof window !== "undefined" && window.innerWidth < 1024) {
                          onClose();
                        }
                      }}
                      className={`flex items-center rounded-lg transition-colors ${
                        isCollapsed ? "justify-center p-3" : "space-x-3 p-3"
                      } ${
                        isActive
                          ? "bg-green-50 text-green-700 font-semibold"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      {React.createElement(item.icon, {
                        className: `w-5 h-5 flex-shrink-0 ${
                          isActive ? "text-green-700" : "text-gray-600"
                        }`,
                      })}
                      {!isCollapsed && (
                        <span className="whitespace-nowrap">{item.label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t">
            <div
              className={`flex items-center bg-gray-50 rounded-lg ${
                isCollapsed ? "justify-center p-3" : "space-x-3 p-3"
              }`}
            >
              <div className="w-8 h-8 bg-green-bg rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Roshan</p>
                  <p className="text-sm text-gray-500 truncate">
                    admin@example.com
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
