# 🎨 Gigabase Animations Guide

## Overview

Gigabase now features smooth, performant animations powered by **Framer Motion**, enhancing user experience with delightful interactions and transitions throughout the application.

---

## ✨ Animation Features Added

### 1. **Page Transitions**
- Smooth fade and slide transitions between routes
- Entry/exit animations for all pages
- Duration: 300-500ms for optimal UX

### 2. **Home Page Animations**
```typescript
✅ Logo animation - Spring bounce effect on load
✅ Search bar - Scale-in with spring physics
✅ Stats counter - Pop-in animation with number counting
✅ Theme toggle - Rotate and scale animation
✅ Background - Animated starfield (existing)
```

### 3. **Search Results Animations**
```typescript
✅ Staggered list items - Results appear one by one
✅ Card hover effects - Lift and scale on hover
✅ Loading states - Shimmer and pulse effects
✅ Filter transitions - Smooth tab switching
```

### 4. **Interactive Elements**
```typescript
✅ Buttons - Hover scale and tap feedback
✅ Cards - Lift effect with shadow
✅ Icons - Rotate, bounce, and spin effects
✅ Modals - Scale and fade backdrop
✅ Notifications - Slide from right
```

### 5. **Micro-interactions**
```typescript
✅ Input focus - Border glow animation
✅ Suggestion dropdown - Fade and slide
✅ Progress bars - Fill animation
✅ Tooltips - Pop-in effect
✅ Badges - Pulse for attention
```

---

## 📚 Animation Library

All animations are centralized in `src/lib/animations.ts`:

### Basic Animations
- `fadeIn` - Simple opacity fade
- `slideInLeft/Right/Top/Bottom` - Directional slides
- `scaleIn` - Scale from center
- `popIn` - Bounce scale effect
- `rotateIn` - Rotate with scale

### Advanced Effects
- `staggerContainer` - Parent container for stagger
- `staggerItem` - Child items with delay
- `cardHover` - Card lift on hover
- `buttonHover` - Button feedback
- `pulse` - Continuous pulsing
- `float` - Floating effect
- `glow` - Glowing border
- `shimmer` - Loading shimmer

### Specialized
- `searchResultContainer/Item` - Search results
- `modalBackdrop/Content` - Modal animations
- `notificationSlide` - Toast notifications
- `accordionContent` - Expand/collapse
- `progressBar` - Loading progress

---

## 🎯 Usage Examples

### 1. Basic Page Animation
```tsx
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";

const MyPage = () => (
  <motion.div {...fadeIn}>
    {/* Your content */}
  </motion.div>
);
```

### 2. Staggered List
```tsx
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

<motion.div variants={staggerContainer} initial="hidden" animate="show">
  {items.map(item => (
    <motion.div key={item.id} variants={staggerItem}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### 3. Hover Effects
```tsx
import { motion } from "framer-motion";
import { cardHover } from "@/lib/animations";

<motion.div {...cardHover}>
  <Card />
</motion.div>
```

### 4. Button with Feedback
```tsx
import { motion } from "framer-motion";
import { buttonHover } from "@/lib/animations";

<motion.button {...buttonHover}>
  Click Me
</motion.button>
```

---

## ⚡ Performance Optimization

### Best Practices
1. **Use `transform` and `opacity`** - GPU accelerated
2. **Avoid animating `width`, `height`, `top`, `left`** - Causes reflow
3. **Use `layoutId` for shared element transitions**
4. **Implement `AnimatePresence`** for exit animations
5. **Set `will-change` CSS property** for complex animations

### Performance Tips
```tsx
// ✅ Good - GPU accelerated
<motion.div animate={{ x: 100, opacity: 1 }} />

// ❌ Avoid - Causes layout reflow
<motion.div animate={{ width: "100%", marginLeft: 50 }} />

// ✅ Use layout animations instead
<motion.div layout />
```

### Reducing Animation Complexity
```tsx
// Use reduce motion preference
import { useReducedMotion } from "framer-motion";

const shouldReduceMotion = useReducedMotion();
const variants = shouldReduceMotion ? simpleVariants : complexVariants;
```

---

## 🎬 Animation Timeline

### App Entry Sequence (Home Page)
```
0ms     - Page fade in starts
100ms   - Logo slides in from top
200ms   - Logo scale animation
400ms   - Search bar scales in
300ms   - Theme button rotates in
600ms   - Stats fade in
800ms   - Stats counter animates
```

### Search Results Sequence
```
0ms     - Page transition
100ms   - Search bar appears
200ms   - Filter tabs slide in
300ms   - Results container fades
350ms   - First result appears
400ms   - Second result (stagger +50ms)
450ms   - Third result
... continues with 50ms stagger
```

---

## 🔧 Configuration

### Customizing Animations

Edit `src/lib/animations.ts` to modify defaults:

```typescript
// Change spring stiffness (higher = faster)
export const slideInLeft = {
  initial: { x: -50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { 
    type: "spring", 
    stiffness: 100,  // Increase for snappier
    damping: 15      // Decrease for more bounce
  }
};

// Change duration for tween animations
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 } // Adjust timing
};
```

### Global Animation Settings

```tsx
// In App.tsx
import { MotionConfig } from "framer-motion";

<MotionConfig reducedMotion="user">
  {/* Your app */}
</MotionConfig>
```

---

## 🎨 Animation Presets by Component

### Home Page
- **Logo**: Spring bounce (stiffness: 150, damping: 20)
- **Search**: Scale fade-in (duration: 0.4s)
- **Toggle**: Rotate 180° with scale
- **Stats**: Pop-in with count-up

### Search Results
- **Results**: Stagger 50ms delay
- **Cards**: Hover lift 5px + scale 1.02
- **Filters**: Tab slide (duration: 0.3s)
- **Badges**: Pulse (2s infinite)

### Article Page
- **Content**: Fade slide from bottom
- **Images**: Lazy load with blur-up
- **Code blocks**: Slide in from left
- **Share buttons**: Pop-in on hover

### Modal/Dialog
- **Backdrop**: Fade (duration: 0.2s)
- **Content**: Scale + slide from center
- **Close**: Scale down with rotate

---

## 📱 Responsive Animations

Animations adapt to screen size:

```tsx
// Mobile - Simpler, faster
const mobileVariant = {
  transition: { duration: 0.2 }
};

// Desktop - More elaborate
const desktopVariant = {
  transition: { 
    type: "spring",
    stiffness: 200,
    damping: 20
  }
};

// Use with media query
const isMobile = window.innerWidth < 768;
const variants = isMobile ? mobileVariant : desktopVariant;
```

---

## 🐛 Troubleshooting

### Animation Not Working
1. Check Framer Motion is installed: `npm list framer-motion`
2. Verify import: `import { motion } from "framer-motion"`
3. Ensure component is wrapped in `<motion.div>`
4. Check variants are properly destructured

### Performance Issues
1. Reduce stagger delay
2. Limit animated items (paginate)
3. Use `layoutId` sparingly
4. Check for conflicting CSS transitions
5. Use Chrome DevTools Performance tab

### Flickering
1. Add `will-change: transform` CSS
2. Use `layout` prop instead of animating dimensions
3. Check z-index conflicts
4. Ensure no competing animations

---

## 🔮 Future Enhancements

### Planned Animations
- [ ] 3D card flip effects
- [ ] Parallax scrolling
- [ ] Gesture-based interactions (swipe, drag)
- [ ] Page transition variants (slide, zoom, fade)
- [ ] Animated SVG illustrations
- [ ] Confetti effects for achievements
- [ ] Skeleton loading states
- [ ] Interactive data visualizations

### Advanced Features
- [ ] Physics-based interactions
- [ ] Scroll-triggered animations
- [ ] Custom easing curves
- [ ] Morphing shapes
- [ ] Animated gradients
- [ ] Particle effects

---

## 📖 Resources

### Documentation
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animation Best Practices](https://web.dev/animations/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions)

### Inspiration
- [Awwwards](https://www.awwwards.com/)
- [Dribbble](https://dribbble.com/tags/animation)
- [CodePen](https://codepen.io/tag/framer-motion)

### Tools
- [Framer Motion Playground](https://codesandbox.io/s/framer-motion-playground)
- [Spring Visualizer](https://www.framer.com/motion/spring/)
- [Easings.net](https://easings.net/)

---

## 📊 Animation Performance Metrics

### Target Performance
- **First Contentful Paint (FCP)**: < 1.8s
- **Animation Frame Rate**: 60 FPS
- **Interaction Delay**: < 100ms
- **Page Transition**: < 300ms

### Monitoring
```tsx
// Log animation performance
import { useAnimation } from "framer-motion";

const controls = useAnimation();
controls.start({ x: 100 }).then(() => {
  console.log("Animation complete");
});
```

---

## ✅ Animation Checklist

Before deploying:
- [ ] All animations tested on mobile devices
- [ ] Reduced motion preferences respected
- [ ] No animation jank (60 FPS maintained)
- [ ] Loading states have animations
- [ ] Error states have feedback animations
- [ ] Accessibility: Focus indicators animated
- [ ] Dark mode animations work properly
- [ ] Browser compatibility tested (Chrome, Firefox, Safari)
- [ ] Performance metrics meet targets
- [ ] No console errors related to animations

---

## 🎉 Credits

**Animations powered by:**
- [Framer Motion](https://www.framer.com/motion/) - Production-ready animation library
- React 18.3 - Concurrent rendering for smooth animations
- Tailwind CSS - Utility classes for quick styling

**Developed with care for Gigabase Knowledge Nexus** 💙
