"use client";

import { ReactNode } from "react";
import Header from "./header";
import Footer from "./footer";

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

const Layout = ({
  children,
  showHeader = true,
  showFooter = true,
  className = "",
}: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header />}

      <main className={`flex-1 ${showHeader ? "pt-16" : ""} ${className}`}>
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
