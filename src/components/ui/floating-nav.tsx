"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { throttle } from "@/lib/debounce";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { handleAnchorClick } = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY <= 50) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle para melhorar performance - executa no máximo a cada 100ms
    const throttledScroll = throttle(handleScroll, 100);
    
    window.addEventListener("scroll", throttledScroll);
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [lastScrollY]);

  // Fechar menu mobile ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (mobileMenuOpen && !target.closest('[data-mobile-menu]')) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [mobileMenuOpen]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: 0,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-full fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur-md border-b border-border/30",
          className
        )}
        data-mobile-menu
      >
        <div className="flex justify-between items-center w-full px-2 md:px-8 py-4 max-w-[1400px] mx-auto">
          {/* Logo */}
          <a href="/" className="flex items-center hover:opacity-80 transition-opacity cursor-pointer">
            <img 
              src="/images/logo.svg" 
              alt="Alastro" 
              className="h-9 w-auto"
              style={{ fill: 'currentColor' }}
            />
          </a>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((navItem, idx) => (
              <a
                key={`link-${idx}`}
                href={navItem.link}
                onClick={(e) => handleAnchorClick(e, navItem.link)}
                className={cn(
                  "relative text-foreground hover:text-[var(--color-menu-hover)] transition-colors duration-200 text-base font-amplitude font-bold"
                )}
              >
                <span className="block">{navItem.name}</span>
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
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
                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/95 backdrop-blur-md border-t border-border/30"
            >
              <nav className="flex flex-col py-4">
                {navItems.map((navItem, idx) => (
                  <a
                    key={`mobile-link-${idx}`}
                    href={navItem.link}
                    onClick={(e) => {
                      handleAnchorClick(e, navItem.link);
                      setMobileMenuOpen(false);
                    }}
                    className="px-8 py-3 text-foreground hover:text-[var(--color-menu-hover)] transition-colors duration-200 text-base font-amplitude font-bold hover:bg-gray-50/50"
                  >
                    {navItem.name}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};