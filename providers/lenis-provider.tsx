"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        // Expose Lenis instance globally for programmatic scrolling
        (window as any).lenis = lenis;

        // Integrate Lenis with GSAP ScrollTrigger
        lenis.on("scroll", () => {
            ScrollTrigger.update();
        });

        // Update ScrollTrigger on resize
        ScrollTrigger.addEventListener("refresh", () => lenis.resize());

        // Animation frame loop
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Cleanup
        return () => {
            lenis.destroy();
            ScrollTrigger.removeEventListener("refresh", () => lenis.resize());
            delete (window as any).lenis;
        };
    }, []);

    return <>{children}</>;
}

