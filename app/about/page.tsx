"use client";

import Image from "next/image";
import { Twitter, Facebook, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import gsap from "gsap";

// Starburst icon component matching the design
const StarburstIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={cn("w-24 h-24 text-slate-900", className)}
    fill="currentColor"
  >
    {/* Creating a multi-pointed star/burst effect */}
    {Array.from({ length: 12 }).map((_, i) => (
      <rect
        key={i}
        x="48"
        y="0"
        width="4"
        height="100"
        className="origin-center"
        style={{ transform: `rotate(${i * 15}deg)` }}
      />
    ))}
  </svg>
);

const AboutPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const starburstRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Starburst continuous rotation
      gsap.to(starburstRef.current, {
        rotation: 360,
        repeat: -1,
        duration: 10,
        ease: "linear",
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 2. Initial Setup - hide elements to prevent flash
      gsap.set(imageRef.current, { clipPath: "inset(100% 0 0 0)" }); // Hide image top-down
      gsap.set(titleRef.current, { y: 100, opacity: 0 });
      gsap.set(textRef.current?.children || [], { y: 30, opacity: 0 });
      gsap.set(lineRef.current, { width: 0 });
      gsap.set(socialRef.current?.children || [], { y: 20, opacity: 0 });

      // 3. Animation Sequence
      tl.to(imageRef.current, {
        clipPath: "inset(0% 0 0 0)",
        duration: 1.5,
        ease: "power2.inOut",
      })
        .to(
          titleRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 1,
          },
          "-=1"
        )
        .to(
          textRef.current?.children || [],
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.8,
          },
          "-=0.5"
        )
        .to(
          lineRef.current,
          {
            width: "6rem", // w-24 is 6rem
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .to(
          socialRef.current?.children || [],
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.8,
          },
          "-=0.8"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen text-slate-900 pt-20 px-4 md:px-8 lg:px-16 flex flex-col justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Image Section */}
          <div className="lg:col-span-5 relative mt-10 lg:mt-0">
            {/* Starburst Icon */}
            <div
              ref={starburstRef}
              className="absolute -top-12 -left-12 z-20 hidden md:block" // removed animate-spin-slow as we use gsap
            >
              <StarburstIcon />
            </div>

            <div
              ref={imageRef}
              className="relative aspect-[4/5] w-full overflow-hidden bg-white shadow-xl"
            >
              <Image
                src="/images/about/hero.png"
                alt="Designer measuring furniture"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-7 flex flex-col justify-center relative z-10 pl-0 lg:pl-10 pt-10 lg:pt-0">
            {/* Big Typography */}
            <h1
              ref={titleRef}
              className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-slate-900 mb-16 uppercase leading-none"
            >
              About Us
            </h1>

            {/* Description Text */}
            <div
              ref={textRef}
              className="max-w-md ml-auto lg:mx-0 space-y-8 text-sm md:text-base text-slate-600 leading-relaxed font-medium"
            >
              <p>
                Chaitra started as a small interior design firm in downtown
                Bangalore, aiming to help home buyers to make do with the new
                space that they had acquired. It soon became obvious that it would
                make sense to help our clients see beyond the walls and floor
                plans, and be there with them from the get-go.
              </p>
              <p>
                Currently, we offer house realtor, interior design, and architecture
                services in order to help our customers find their forever homes as
                seamlessly and painlessly as possible. We value our customers
                above everything else, meaning that we won&apos;t take &apos;OK&apos; as an
                answer.
              </p>
            </div>

            {/* Decorative line/bar at bottom right */}
            <div
              ref={lineRef}
              className="hidden lg:block h-3 bg-slate-900 mt-20 ml-auto" // removed w-24 as we animate it
            />
          </div>
        </div>

        {/* Footer Social Icons */}
        <div
          ref={socialRef}
          className="flex justify-center lg:justify-start lg:pl-[15%] gap-8 mt-16 pb-10 text-slate-900"
        >
          <Twitter className="w-5 h-5 cursor-pointer hover:text-slate-600 transition-colors" />
          <Facebook className="w-5 h-5 cursor-pointer hover:text-slate-600 transition-colors" />
          <Instagram className="w-5 h-5 cursor-pointer hover:text-slate-600 transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
