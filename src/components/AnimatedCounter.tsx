import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const AnimatedCounter = ({ 
  value, 
  duration = 2, 
  className = "",
  prefix = "",
  suffix = "",
  decimals = 0
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    return latest.toFixed(decimals);
  });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration,
        ease: "easeOut",
        onUpdate: (latest) => {
          // Format with commas
          const formatted = Math.floor(latest).toLocaleString();
          setDisplayValue(formatted);
        }
      });

      return controls.stop;
    }
  }, [count, value, duration, isInView]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ 
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.2
      }}
    >
      {prefix}
      <motion.span
        animate={isInView ? {
          textShadow: [
            "0 0 0px rgba(59, 130, 246, 0)",
            "0 0 20px rgba(59, 130, 246, 0.8)",
            "0 0 0px rgba(59, 130, 246, 0)"
          ]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {displayValue}
      </motion.span>
      {suffix}
    </motion.span>
  );
};

interface CountUpAnimationProps {
  value: number;
  label?: string;
  icon?: React.ReactNode;
  description?: string;
}

export const CountUpAnimation = ({ value, label, icon, description }: CountUpAnimationProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      {/* Content */}
      <div className="relative glass-card border border-border/50 rounded-2xl p-6 space-y-3">
        {/* Icon */}
        {icon && (
          <motion.div
            className="inline-flex p-3 rounded-xl bg-blue-500/10"
            animate={isInView ? {
              rotate: [0, 5, -5, 0],
            } : {}}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {icon}
          </motion.div>
        )}

        {/* Label */}
        {label && (
          <motion.p
            className="text-muted-foreground text-sm font-medium"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: 0.2 }}
          >
            {label}
          </motion.p>
        )}

        {/* Animated counter */}
        <motion.div className="relative">
          <AnimatedCounter
            value={value}
            duration={2.5}
            className="text-4xl md:text-5xl font-bold text-white"
          />
          
          {/* Plus particles */}
          <div className="absolute -right-8 top-0">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-blue-400 text-xl font-bold"
                initial={{ opacity: 0, y: 0, x: 0 }}
                animate={isInView ? {
                  opacity: [0, 1, 0],
                  y: [-20, -40, -60],
                  x: [0, 10, 20],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeOut"
                }}
              >
                +
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Description */}
        {description && (
          <motion.p
            className="text-xs text-muted-foreground/70"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4 }}
          >
            {description}
          </motion.p>
        )}

        {/* Progress bar */}
        <motion.div
          className="h-1 bg-blue-500/20 rounded-full overflow-hidden"
          initial={{ scaleX: 0, originX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ 
            duration: 2.5,
            ease: "easeOut",
            delay: 0.3
          }}
        >
          <motion.div
            className="h-full w-full bg-blue-500"
            initial={{ scaleX: 0, originX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ 
              duration: 2.5,
              ease: "easeOut",
              delay: 0.3
            }}
          />
          <motion.div
            className="h-full w-full bg-white/20 absolute top-0 left-0"
            animate={{
              x: ["-100%", "100%"]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnimatedCounter;
