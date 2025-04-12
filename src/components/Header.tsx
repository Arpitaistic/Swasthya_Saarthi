
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User, LogOut, LogIn, UserPlus, AlertTriangle, Award, Home, BrainCog } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useMobile();

  // Track scroll position for header styles
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle smooth scroll to section
  const handleScrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2"
            aria-label="SwasthyaSaarthi logo and home link"
          >
            <BrainCog className="w-8 h-8 text-swasthya-primary" />
            <span className="font-bold text-lg md:text-xl text-swasthya-dark dark:text-white">
              Swasthya<span className="text-swasthya-secondary">Saarthi</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                location.pathname === "/"
                  ? "text-swasthya-primary bg-swasthya-primary/10"
                  : "text-swasthya-dark hover:text-swasthya-primary hover:bg-swasthya-primary/10 dark:text-white dark:hover:bg-gray-800"
              )}
            >
              <Home className="w-4 h-4 inline mr-1" />
              Home
            </Link>
            {location.pathname === "/" && (
              <>
                <button
                  onClick={() => handleScrollToSection("services")}
                  className="px-3 py-2 text-sm font-medium rounded-md text-swasthya-dark hover:text-swasthya-primary hover:bg-swasthya-primary/10 transition-colors dark:text-white dark:hover:bg-gray-800"
                >
                  AI Assistant
                </button>
                <button
                  onClick={() => handleScrollToSection("assessment")}
                  className="px-3 py-2 text-sm font-medium rounded-md text-swasthya-dark hover:text-swasthya-primary hover:bg-swasthya-primary/10 transition-colors dark:text-white dark:hover:bg-gray-800"
                >
                  Health Check
                </button>
                <button
                  onClick={() => handleScrollToSection("record")}
                  className="px-3 py-2 text-sm font-medium rounded-md text-swasthya-dark hover:text-swasthya-primary hover:bg-swasthya-primary/10 transition-colors dark:text-white dark:hover:bg-gray-800"
                >
                  My Health
                </button>
              </>
            )}
            <Link
              to="/emergency"
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                location.pathname === "/emergency"
                  ? "text-swasthya-primary bg-swasthya-primary/10"
                  : "text-swasthya-dark hover:text-swasthya-primary hover:bg-swasthya-primary/10 dark:text-white dark:hover:bg-gray-800"
              )}
            >
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              Emergency
            </Link>
            <Link
              to="/welfare"
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                location.pathname === "/welfare"
                  ? "text-swasthya-primary bg-swasthya-primary/10"
                  : "text-swasthya-dark hover:text-swasthya-primary hover:bg-swasthya-primary/10 dark:text-white dark:hover:bg-gray-800"
              )}
            >
              <Award className="w-4 h-4 inline mr-1" />
              Welfare Schemes
            </Link>
          </nav>

          {/* Auth & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    className="border-swasthya-primary text-swasthya-primary hover:bg-swasthya-primary/10 dark:border-gray-600 dark:text-white"
                  >
                    <User className="w-4 h-4 mr-1" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="text-swasthya-dark hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-swasthya-dark hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                  >
                    <LogIn className="w-4 h-4 mr-1" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-swasthya-primary hover:bg-swasthya-primary/90 text-white">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Menu Button & Theme Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-md"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-swasthya-dark dark:text-white" />
              ) : (
                <Menu className="h-5 w-5 text-swasthya-dark dark:text-white" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && isMobile && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <nav className="flex flex-col space-y-1">
              <Link
                to="/"
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  location.pathname === "/"
                    ? "text-swasthya-primary bg-swasthya-primary/10"
                    : "text-swasthya-dark hover:text-swasthya-primary hover:bg-swasthya-primary/10 dark:text-white dark:hover:bg-gray-800"
                )}
              >
                <Home className="w-4 h-4 inline mr-1" />
                Home
              </Link>
              {location.pathname === "/" && (
                <>
                  <button
                    onClick={() => handleScrollToSection("services")}
                    className="px-3 py-2 text-sm font-medium rounded-md text-left text-swasthya-dark hover:text-swasthya-primary hover:bg-swasthya-primary/10 transition-colors dark:text-white dark:hover:bg-gray-800"
                  >
                    AI Assistant
                  </button>
                  <button
                    onClick={() => handleScrollToSection("assessment")}
                    className="px-3 py-2 text-sm font-medium rounded-md text-left text-swasthya-dark hover:text-swasthya-primary hover:bg-swasthya-primary/10 transition-colors dark:text-white dark:hover:bg-gray-800"
                  >
                    Health Check
                  </button>
                  <button
                    onClick={() => handleScrollToSection("record")}
                    className="px-3 py-2 text-sm font-medium rounded-md text-left text-swasthya-dark hover:text-swasthya-primary hover:bg-swasthya-primary/10 transition-colors dark:text-white dark:hover:bg-gray-800"
                  >
                    My Health
                  </button>
                </>
              )}
              <Link
                to="/emergency"
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  location.pathname === "/emergency"
                    ? "text-swasthya-primary bg-swasthya-primary/10"
                    : "text-swasthya-dark hover:text-swasthya-primary hover:bg-swasthya-primary/10 dark:text-white dark:hover:bg-gray-800"
                )}
              >
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Emergency
              </Link>
              <Link
                to="/welfare"
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  location.pathname === "/welfare"
                    ? "text-swasthya-primary bg-swasthya-primary/10"
                    : "text-swasthya-dark hover:text-swasthya-primary hover:bg-swasthya-primary/10 dark:text-white dark:hover:bg-gray-800"
                )}
              >
                <Award className="w-4 h-4 inline mr-1" />
                Welfare Schemes
              </Link>
            </nav>

            {/* Mobile: Auth Links */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-sm font-medium rounded-md text-swasthya-primary hover:bg-swasthya-primary/10 transition-colors"
                  >
                    <User className="w-4 h-4 inline mr-1" />
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-3 py-2 text-sm font-medium rounded-md text-swasthya-dark hover:bg-gray-100 transition-colors dark:text-white dark:hover:bg-gray-800"
                  >
                    <LogOut className="w-4 h-4 inline mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-sm font-medium rounded-md text-swasthya-dark hover:bg-gray-100 transition-colors dark:text-white dark:hover:bg-gray-800"
                  >
                    <LogIn className="w-4 h-4 inline mr-1" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-sm font-medium rounded-md text-white bg-swasthya-primary hover:bg-swasthya-primary/90 transition-colors mt-1"
                  >
                    <UserPlus className="w-4 h-4 inline mr-1" />
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
