"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Custom hook for GSAP animations with proper cleanup
 * @param callback - Animation callback function that receives gsap context
 * @param dependencies - Dependencies array for re-running animations
 */
export function useGSAP(
  callback: (context: gsap.Context) => void,
  dependencies: any[] = []
) {
  const contextRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    // Create GSAP context for scoped animations
    contextRef.current = gsap.context(() => {
      callback(contextRef.current!);
    });

    return () => {
      // Cleanup: revert all animations in this context
      contextRef.current?.revert();
    };
  }, dependencies);

  return contextRef;
}

/**
 * Hook for scroll-triggered animations
 * @param elementRef - Ref to the element to animate
 * @param animationConfig - GSAP animation configuration
 * @param scrollTriggerConfig - ScrollTrigger configuration
 */
export function useScrollAnimation(
  elementRef: React.RefObject<HTMLElement>,
  animationConfig: gsap.TweenVars,
  scrollTriggerConfig?: ScrollTrigger.Vars
) {
  useGSAP(() => {
    if (!elementRef.current) return;

    gsap.fromTo(elementRef.current, animationConfig.from || {}, {
      ...animationConfig,
      scrollTrigger: {
        trigger: elementRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        ...scrollTriggerConfig,
      },
    });
  }, []);
}

/**
 * Hook for parallax effects
 * @param elementRef - Ref to the element to apply parallax
 * @param speed - Parallax speed (0.5 = slower, 2 = faster)
 */
export function useParallax(
  elementRef: React.RefObject<HTMLElement>,
  speed: number = 0.5
) {
  useGSAP(() => {
    if (!elementRef.current) return;

    gsap.to(elementRef.current, {
      y: () => window.innerHeight * speed,
      ease: "none",
      scrollTrigger: {
        trigger: elementRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, [speed]);
}

/**
 * Hook for stagger animations on child elements
 * @param containerRef - Ref to the container element
 * @param childSelector - CSS selector for child elements
 * @param animationConfig - GSAP animation configuration
 * @param staggerAmount - Time between each child animation
 */
export function useStaggerAnimation(
  containerRef: React.RefObject<HTMLElement>,
  childSelector: string,
  animationConfig: gsap.TweenVars,
  staggerAmount: number = 0.1
) {
  useGSAP(() => {
    if (!containerRef.current) return;

    const children = containerRef.current.querySelectorAll(childSelector);

    gsap.fromTo(children, animationConfig.from || {}, {
      ...animationConfig,
      stagger: staggerAmount,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  }, [childSelector, staggerAmount]);
}

/**
 * Utility to refresh ScrollTrigger (useful after layout changes)
 */
export function refreshScrollTrigger() {
  ScrollTrigger.refresh();
}

/**
 * Utility to update ScrollTrigger on Lenis scroll
 */
export function syncScrollTriggerWithLenis() {
  if (typeof window !== "undefined" && (window as any).lenis) {
    const lenis = (window as any).lenis;

    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });
  }
}
