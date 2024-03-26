"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState, useMemo } from "react";

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
  autoplay?: boolean;
  delay?: number;
  showDots?: boolean;
  touchEnabled?: boolean;
  mouseEnabled?: boolean;
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
  mouseEnabled = true,
  dir = "ltr",
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const widthRef = useRef<number>(0);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (ref.current) {
      widthRef.current = ref.current.offsetWidth;
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

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setTouchStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) =>
    setTouchEnd(e.clientX);

  const onMouseUp = () => {
    onTouchEnd();
  };

  const handleDotClick = (index: number) => {
    if (!clicked) {
      setCurrentSlide(index);
      setClickedWithDelay(true, delay);
    }
  };

  const transformedWidth = useMemo(() => {
    return (isLTR ? -currentSlide : currentSlide) * widthRef.current;
  }, [currentSlide, isLTR]);

  return (
    <div
      className={cn("m-[0 auto] overflow-hidden w-full", className)}
      ref={ref}
    >
      <div
        className="whitespace-nowrap transition-transform ease-linear duration-700"
        style={{
          transform: `translate3d(${transformedWidth}px, 0, 0)`,
        }}
        onTouchStart={touchEnabled ? onTouchStart : undefined}
        onTouchMove={touchEnabled ? onTouchMove : undefined}
        onTouchEnd={touchEnabled ? onTouchEnd : undefined}
        onMouseDown={mouseEnabled ? onMouseDown : undefined}
        onMouseMove={mouseEnabled ? onMouseMove : undefined}
        onMouseUp={mouseEnabled ? onMouseUp : undefined}
      >
        {React.Children.map(children, (child, index) => (
          <div
            className="inline-block px-2 mt-4 h-fit cursor-pointer"
            key={index}
          >
            {child}
          </div>
        ))}
      </div>
      {showDots && (
        <div className="flex items-center justify-center mt-5">
          {React.Children.map(children, (child, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
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
