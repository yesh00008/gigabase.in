/**
 * Centralized Animation Configurations for Gigabase
 * Using Framer Motion for smooth, performant animations
 */

import { Variants } from "framer-motion";

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

// Fade in animation
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 }
};

// Slide in from left
export const slideInLeft = {
  initial: { x: -50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: "spring", stiffness: 100, damping: 15 }
};

// Slide in from right
export const slideInRight = {
  initial: { x: 50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: "spring", stiffness: 100, damping: 15 }
};

// Slide in from top
export const slideInTop = {
  initial: { y: -50, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { type: "spring", stiffness: 100, damping: 15 }
};

// Slide in from bottom
export const slideInBottom = {
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { type: "spring", stiffness: 100, damping: 15 }
};

// Scale in animation
export const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: "spring", stiffness: 200, damping: 20 }
};

// Pop in animation (with bounce)
export const popIn = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  transition: { 
    type: "spring",
    stiffness: 260,
    damping: 20
  }
};

// Rotate in animation
export const rotateIn = {
  initial: { rotate: -180, scale: 0, opacity: 0 },
  animate: { rotate: 0, scale: 1, opacity: 1 },
  transition: { 
    type: "spring",
    stiffness: 200,
    damping: 15
  }
};

// Stagger children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItem: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Card hover animation
export const cardHover = {
  whileHover: { 
    scale: 1.02,
    y: -5,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  whileTap: { scale: 0.98 }
};

// Button hover animation
export const buttonHover = {
  whileHover: { 
    scale: 1.05,
    transition: { 
      type: "spring",
      stiffness: 400,
      damping: 17
    }
  },
  whileTap: { scale: 0.95 }
};

// Pulse animation
export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Float animation
export const float = {
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Glow animation
export const glow = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(59, 130, 246, 0.5)",
      "0 0 40px rgba(59, 130, 246, 0.8)",
      "0 0 20px rgba(59, 130, 246, 0.5)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Shimmer animation for loading
export const shimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Bounce animation
export const bounce = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Typewriter effect
export const typewriter = {
  hidden: { width: 0 },
  visible: {
    width: "100%",
    transition: {
      duration: 1.5,
      ease: "easeInOut"
    }
  }
};

// List item stagger
export const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export const listItem: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 14
    }
  }
};

// Search result animations
export const searchResultContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

export const searchResultItem: Variants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Loading spinner
export const spinner = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Icon animations
export const iconSpin = {
  animate: {
    rotate: [0, 360],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const iconBounce = {
  whileHover: {
    y: [0, -5, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity
    }
  }
};

// Modal animations
export const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, delay: 0.1 }
  }
};

export const modalContent = {
  hidden: { scale: 0.8, opacity: 0, y: 50 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      delay: 0.1
    }
  },
  exit: { 
    scale: 0.8, 
    opacity: 0, 
    y: 50,
    transition: { duration: 0.2 }
  }
};

// Notification animations
export const notificationSlide = {
  initial: { x: 400, opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25
    }
  },
  exit: { 
    x: 400, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Progress bar animation
export const progressBar = {
  initial: { scaleX: 0, originX: 0 },
  animate: { 
    scaleX: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Tab switch animation
export const tabContent = {
  initial: { x: 10, opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    x: -10, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Accordion animations
export const accordionContent = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { 
    height: "auto", 
    opacity: 1,
    transition: {
      height: {
        type: "spring",
        stiffness: 300,
        damping: 30
      },
      opacity: {
        duration: 0.25,
        delay: 0.1
      }
    }
  }
};

// Gradient text animation
export const gradientText = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Count up animation helper
export const countUp = (start: number, end: number, duration: number = 1) => ({
  initial: { value: start },
  animate: { 
    value: end,
    transition: { 
      duration,
      ease: "easeOut"
    }
  }
});

// Parallax effect
export const parallax = (offset: number = 50) => ({
  initial: { y: offset },
  whileInView: { y: 0 },
  viewport: { once: true },
  transition: {
    type: "spring",
    stiffness: 100,
    damping: 20
  }
});

// Reveal animation for scroll
export const reveal = {
  initial: { y: 50, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: {
    type: "spring",
    stiffness: 100,
    damping: 20
  }
};
