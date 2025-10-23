"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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
          "flex max-w-full fixed top-0 inset-x-0 z-50 bg-white/40 backdrop-blur-md border-b border-border/30",
          className
        )}
      >
        <div className="flex justify-between items-center w-full px-2 md:px-8 py-4 max-w-[1400px] mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/images/logo.svg" 
              alt="Alastro" 
              className="h-9 w-auto"
              style={{ fill: 'currentColor' }}
            />
            <span className="text-sm font-amplitude font-bold text-muted-foreground ml-2">
              PRODUTORA AUDIOVISUAL
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((navItem, idx) => (
              <a
                key={`link-${idx}`}
                href={navItem.link}
                className={cn(
                  "relative text-foreground hover:text-[var(--color-menu-hover)] transition-colors duration-200 text-base font-amplitude font-bold"
                )}
              >
                <span className="block">{navItem.name}</span>
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground">
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
      </motion.div>
    </AnimatePresence>
  );
};