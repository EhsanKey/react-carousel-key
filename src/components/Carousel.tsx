"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
  autoplay?: boolean;
  delay?: number;
  showDots?: boolean;
  touchEnabled?: boolean;
  dir?: "ltr" | "rtl";
}

const minSwipeDistance = 50;

const Carousel: React.FC<CarouselProps> = ({
  children,
  className,
  autoplay = true,
  delay = 5000,
  showDots = true,
  touchEnabled = true,
  dir = "ltr",
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [clicked, setClicked] = useState(false); // حالت برای نشان دادن کلیک کردن بر روی کاروسل

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoplay && !clicked) {
      interval = setInterval(nextSlide, delay);
    }
    return () => clearInterval(interval);
  }, [autoplay, delay, clicked]);

  const isLTR = dir === "ltr";

  const setClickedWithDelay = (value: boolean, delay: number) => {
    setClicked(value);
    setTimeout(() => setClicked(false), delay);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % React.Children.count(children));
    setClickedWithDelay(true, delay);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? React.Children.count(children) - 1 : prev - 1
    );
    setClickedWithDelay(true, delay);
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) =>
    setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe || isRightSwipe)
      isLeftSwipe
        ? isLTR
          ? nextSlide()
          : prevSlide()
        : isLTR
        ? prevSlide()
        : nextSlide();
  };

  return (
    <div
      className={cn("m-[0 auto] overflow-hidden w-full", className)}
      ref={ref}
    >
      <div
        className="whitespace-nowrap transition-transform ease-linear duration-700"
        style={{
          transform: `translate3d(${
            (isLTR ? -currentSlide : currentSlide) * width
          }px, 0, 0)`,
        }}
        onTouchStart={touchEnabled ? onTouchStart : undefined}
        onTouchMove={touchEnabled ? onTouchMove : undefined}
        onTouchEnd={touchEnabled ? onTouchEnd : undefined}
      >
        {React.Children.map(children, (child, index) => (
          <div className="inline-block px-2 mt-4 h-fit" key={index}>
            {child}
          </div>
        ))}
      </div>
      {showDots && (
        <div className="flex items-center justify-center mt-5">
          {React.Children.map(children, (child, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`${
                index === currentSlide ? "bg-cyan-500" : "bg-[#D9D9D9]"
              } w-2 h-2 rounded-full inline-block mx-1`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
