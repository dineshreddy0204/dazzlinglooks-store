import React, { useEffect, useRef, useState } from 'react';

/**
 * Automatically pauses nonessential CSS animations when the tab/page is hidden
 * to conserve battery and CPU on Android and mobile devices.
 */
export function useVisibilityPause() {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        document.documentElement.classList.add('page-hidden');
      } else {
        document.documentElement.classList.remove('page-hidden');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}

interface LuxuryRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  yOffset?: number;
  threshold?: number;
}

/**
 * IntersectionObserver scroll-storytelling component.
 * Triggers once when entering the viewport, using GPU-accelerated opacity + translate3d.
 * Respects prefers-reduced-motion and never leaves content hidden if IntersectionObserver is unavailable.
 */
export const LuxuryReveal: React.FC<LuxuryRevealProps> = ({
  children,
  className = '',
  delayMs = 0,
  yOffset = 16,
  threshold = 0.08,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    if (!('IntersectionObserver' in window)) return true;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return true;
    return false;
  });

  useEffect(() => {
    if (isVisible) return;
    const node = ref.current;
    if (!node) {
      setIsVisible(true);
      return;
    }

    // Fallback safety timer so content never stays hidden even on slow/unusual viewports
    const safetyTimer = window.setTimeout(() => {
      setIsVisible(true);
    }, 1800);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(node);

    return () => {
      window.clearTimeout(safetyTimer);
      observer.disconnect();
    };
  }, [isVisible, threshold]);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0.01,
        transform: isVisible ? 'translate3d(0, 0px, 0)' : `translate3d(0, ${yOffset}px, 0)`,
        transition: `opacity 620ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms, transform 620ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
};

/**
 * Restrained ambient luxury floating light reflections & micro-particles for hero/banner backgrounds.
 * Strictly decorative, behind content, pointer-events-none.
 */
export const AmbientLuxuryAccents: React.FC<{ variant?: 'hero' | 'banner' }> = ({
  variant = 'hero',
}) => {
  if (variant === 'banner') {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden z-0"
      >
        <div className="lux-float-1 absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-[#F3D19C]/25 to-transparent blur-xl" />
        <div className="lux-float-3 absolute -bottom-8 left-1/3 w-28 h-28 rounded-full bg-gradient-to-tr from-[#E91E63]/12 to-transparent blur-xl" />
        <span className="lux-sparkle-1 absolute top-4 right-[38%] text-[#C59B5F]/45 text-[10px] select-none">
          ✦
        </span>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-0"
    >
      {/* Soft ambient champagne & rose-gold light glows */}
      <div className="lux-float-1 absolute -top-16 left-[8%] w-64 h-64 rounded-full bg-gradient-to-br from-[#FFF8EE]/70 via-[#F3D19C]/25 to-transparent blur-2xl" />
      <div className="lux-float-2 absolute top-10 right-[12%] w-72 h-72 rounded-full bg-gradient-to-bl from-[#FCE8EE]/65 via-[#E91E63]/10 to-transparent blur-2xl" />
      <div className="lux-float-3 absolute -bottom-20 left-[38%] w-60 h-60 rounded-full bg-gradient-to-tr from-[#E5C391]/20 to-transparent blur-2xl" />

      {/* Delicate floating gold light reflections in decorative margins */}
      <span className="lux-sparkle-1 absolute top-7 left-[44%] text-[#C59B5F]/55 text-xs select-none">
        ✦
      </span>
      <span className="lux-sparkle-2 absolute top-14 right-[6%] text-[#B9124B]/35 text-[11px] select-none">
        ✦
      </span>
      <span className="lux-sparkle-3 absolute bottom-8 left-[48%] text-[#C59B5F]/50 text-[10px] select-none">
        ✦
      </span>
    </div>
  );
};
