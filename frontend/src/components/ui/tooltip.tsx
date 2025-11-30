"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
  position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ content, children, delay = 300, position = "top" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getPositionStyles = () => {
    const offset = 8;
    switch (position) {
      case "top":
        return {
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%) translateY(-8px)",
        };
      case "bottom":
        return {
          top: "100%",
          left: "50%",
          transform: "translateX(-50%) translateY(8px)",
        };
      case "left":
        return {
          right: "100%",
          top: "50%",
          transform: "translateY(-50%) translateX(-8px)",
        };
      case "right":
        return {
          left: "100%",
          top: "50%",
          transform: "translateY(-50%) translateX(8px)",
        };
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 px-3 py-2 text-sm text-white bg-neutral-900 rounded-lg shadow-lg whitespace-nowrap"
            style={getPositionStyles()}
          >
            {content}
            <div
              className="absolute w-2 h-2 bg-neutral-900 transform rotate-45"
              style={{
                ...(position === "top" && { bottom: "-4px", left: "50%", transform: "translateX(-50%) rotate(45deg)" }),
                ...(position === "bottom" && { top: "-4px", left: "50%", transform: "translateX(-50%) rotate(45deg)" }),
                ...(position === "left" && { right: "-4px", top: "50%", transform: "translateY(-50%) rotate(45deg)" }),
                ...(position === "right" && { left: "-4px", top: "50%", transform: "translateY(-50%) rotate(45deg)" }),
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 