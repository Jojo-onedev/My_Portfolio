import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    const handleMouseOver = (e) => {
      // Check if we are hovering over an interactive element
      const target = e.target;
      const isInteractive = 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.closest('.interactive') !== null;
        
      setIsHovering(isInteractive);
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1,
    },
    hover: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 2.5,
    }
  };

  return (
    <>
      <style>
        {`
          @media (min-width: 1024px) {
            * {
              cursor: none !important;
            }
          }
        `}
      </style>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 bg-white rounded-full pointer-events-none z-[9999] hidden lg:block mix-blend-difference"
        variants={variants}
        animate={isHovering ? "hover" : "default"}
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30,
          mass: 0.2
        }}
      />
    </>
  );
};

export default CustomCursor;
