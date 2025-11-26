import gsap from "gsap";

/**
 * Common GSAP animation configurations
 */

// Fade animations
export const fadeIn = {
  from: { opacity: 0 },
  opacity: 1,
  duration: 0.8,
  ease: "power2.out",
};

export const fadeInUp = {
  from: { opacity: 0, y: 50 },
  opacity: 1,
  y: 0,
  duration: 0.8,
  ease: "power3.out",
};

export const fadeInDown = {
  from: { opacity: 0, y: -50 },
  opacity: 1,
  y: 0,
  duration: 0.8,
  ease: "power3.out",
};

export const fadeInLeft = {
  from: { opacity: 0, x: -50 },
  opacity: 1,
  x: 0,
  duration: 0.8,
  ease: "power3.out",
};

export const fadeInRight = {
  from: { opacity: 0, x: 50 },
  opacity: 1,
  x: 0,
  duration: 0.8,
  ease: "power3.out",
};

// Scale animations
export const scaleIn = {
  from: { opacity: 0, scale: 0.8 },
  opacity: 1,
  scale: 1,
  duration: 0.6,
  ease: "back.out(1.7)",
};

export const scaleInRotate = {
  from: { opacity: 0, scale: 0.5, rotation: -10 },
  opacity: 1,
  scale: 1,
  rotation: 0,
  duration: 0.8,
  ease: "back.out(1.4)",
};

// Slide animations
export const slideInLeft = {
  from: { x: -100, opacity: 0 },
  x: 0,
  opacity: 1,
  duration: 0.8,
  ease: "power3.out",
};

export const slideInRight = {
  from: { x: 100, opacity: 0 },
  x: 0,
  opacity: 1,
  duration: 0.8,
  ease: "power3.out",
};

/**
 * Parallax animation configuration
 * @param speed - Parallax speed multiplier (0.5 = slower, 2 = faster)
 */
export const parallaxConfig = (speed: number = 0.5) => ({
  y: () => window.innerHeight * speed,
  ease: "none",
  scrollTrigger: {
    scrub: true,
  },
});

/**
 * Counter animation for numbers
 * @param element - Element to animate
 * @param endValue - Target number
 * @param duration - Animation duration
 */
export const animateCounter = (
  element: HTMLElement,
  endValue: number,
  duration: number = 2
) => {
  const obj = { value: 0 };

  gsap.to(obj, {
    value: endValue,
    duration,
    ease: "power1.out",
    onUpdate: () => {
      element.textContent = Math.round(obj.value).toString();
    },
  });
};

/**
 * Text reveal animation with split text effect
 * @param element - Element containing text
 * @param duration - Animation duration
 * @param stagger - Stagger amount between characters
 */
export const textReveal = (
  element: HTMLElement,
  duration: number = 0.8,
  stagger: number = 0.03
) => {
  const text = element.textContent || "";
  element.innerHTML = text
    .split("")
    .map(
      (char) =>
        `<span style="display:inline-block">${
          char === " " ? "&nbsp;" : char
        }</span>`
    )
    .join("");

  const chars = element.querySelectorAll("span");

  gsap.fromTo(
    chars,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: "power2.out",
    }
  );
};

/**
 * Hover animation for cards
 * @param element - Element to animate on hover
 */
export const cardHoverAnimation = (element: HTMLElement) => {
  const tl = gsap.timeline({ paused: true });

  tl.to(element, {
    y: -10,
    scale: 1.02,
    duration: 0.3,
    ease: "power2.out",
  });

  element.addEventListener("mouseenter", () => tl.play());
  element.addEventListener("mouseleave", () => tl.reverse());

  return tl;
};

/**
 * Floating animation for elements
 * @param element - Element to float
 * @param distance - Float distance in pixels
 * @param duration - Animation duration
 */
export const floatingAnimation = (
  element: HTMLElement,
  distance: number = 20,
  duration: number = 3
) => {
  gsap.to(element, {
    y: distance,
    duration,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
};

/**
 * Stagger reveal animation for lists
 * @param elements - NodeList or Array of elements
 * @param staggerAmount - Time between each element
 */
export const staggerReveal = (
  elements: NodeListOf<Element> | Element[],
  staggerAmount: number = 0.1
) => {
  gsap.fromTo(
    elements,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: staggerAmount,
      ease: "power2.out",
    }
  );
};

/**
 * Gradient shift animation
 * @param element - Element with gradient background
 * @param duration - Animation duration
 */
export const gradientShift = (element: HTMLElement, duration: number = 3) => {
  gsap.to(element, {
    backgroundPosition: "200% center",
    duration,
    ease: "none",
    repeat: -1,
  });
};

/**
 * Magnetic button effect
 * @param button - Button element
 * @param strength - Magnetic strength (0-1)
 */
export const magneticButton = (button: HTMLElement, strength: number = 0.5) => {
  button.addEventListener("mousemove", (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(button, {
      x: x * strength,
      y: y * strength,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  button.addEventListener("mouseleave", () => {
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    });
  });
};
