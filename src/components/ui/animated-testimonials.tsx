"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
// import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
  className,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
  className?: string;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
  <div className={cn("max-w-4xl md:max-w-7xl mx-auto px-4 md:px-8 lg:px-12", className)}>
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-48 md:gap-20">
        <div>
          <motion.div 
            className="relative h-80 w-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                handleNext();
              } else if (swipe > swipeConfidenceThreshold) {
                handlePrev();
              }
            }}
          >
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 2
                      : 1,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                                    <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    draggable={false}
                    className={cn(
                      "col-span-2 rounded-2xl object-cover shadow-xl grayscale-[0.2] brightness-110 w-[500px] h-[500px]",
                      className
                    )}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
        <motion.div 
          className="flex justify-between flex-col py-4"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              handleNext();
            } else if (swipe > swipeConfidenceThreshold) {
              handlePrev();
            }
          }}
        >
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <h3 className="text-3xl font-amplitude font-bold text-foreground">
              {testimonials[active].name}
            </h3>
                        <p className="sm:text-lg md:text-xl font-amplitude text-muted-foreground leading-normal">
              {testimonials[active].designation}
            </p>
            <motion.p 
              className="sm:text-lg md:text-xl font-amplitude text-muted-secondary mt-4 leading-normal"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              {testimonials[active].quote}
            </motion.p>
          </motion.div>
          <div className="flex gap-4 pt-5 md:pt-8">
            <button
              onClick={handlePrev}
              className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center group/button border border-foreground"
            >
              <IconArrowLeft className="h-5 w-5 text-foreground group-hover/button:rotate-12 transition-transform duration-300" />
            </button>
            <button
              onClick={handleNext}
              className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center group/button border border-foreground"
            >
              <IconArrowRight className="h-5 w-5 text-foreground group-hover/button:-rotate-12 transition-transform duration-300" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
