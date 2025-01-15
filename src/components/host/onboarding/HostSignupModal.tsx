"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Replace these images or text with anything you like:
const steps = [
  {
    title: "Create your listing",
    image: "/placeholder.svg",
    description: "Start by adding some photos and details about your space.",
  },
  {
    title: "Set your price",
    image: "/placeholder.svg",
    description: "Decide how much you want to charge per night.",
  },
  {
    title: "Choose your availability",
    image: "/placeholder.svg",
    description: "Use the calendar to select when your space is available.",
  },
  {
    title: "Set house rules",
    image: "/placeholder.svg",
    description: "Establish guidelines for guests staying at your place.",
  },
  {
    title: "Publish your listing",
    image: "/placeholder.svg",
    description: "Once everything looks good, make your listing live!",
  },
];

export default function HostSignupModal({
  onCloseAction,
}: {
  onCloseAction: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (steps.length > 0 && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle completion
      console.log("Sign up process completed!");
      onCloseAction();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0]?.clientX ?? null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = () => {
    if (touchStart !== null && touchEnd !== null) {
      if (touchStart - touchEnd > 75) {
        handleNext();
      } else if (touchStart - touchEnd < -75) {
        handlePrev();
      }
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    if (galleryRef.current) {
      galleryRef.current.style.transform = `translateX(-${currentStep * 100}%)`;
    }
  }, [currentStep]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        {/* Close Button */}
        <div className="flex justify-end p-2">
          <button
            onClick={onCloseAction}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-6 pt-0">
          <h2 className="mb-4 text-2xl font-bold">
            {steps[currentStep]?.title}
          </h2>

          {/* Image Gallery */}
          <div className="relative mb-4 h-48 w-full overflow-hidden">
            <div
              ref={galleryRef}
              className="flex h-full w-full transition-transform duration-300 ease-in-out"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="h-full w-full flex-shrink-0 overflow-hidden"
                >
                  <Image
                    src={step.image}
                    alt={`Step ${index + 1}`}
                    className="h-full w-full rounded-lg object-cover"
                    width={400}
                    height={300}
                  />
                </div>
              ))}
            </div>

            {/* Prev / Next Buttons */}
            <button
              onClick={handlePrev}
              className="disabled={currentStep === 0} absolute left-2 top-1/2 -translate-y-1/2 transform rounded-full bg-white p-1 shadow-md"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="disabled={steps.length === 0 || currentStep === steps.length - 1} absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-white p-1 shadow-md"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Description & Dots */}
          <p className="mb-4 text-gray-600">
            {steps[currentStep]?.description}
          </p>
          <div className="flex items-center justify-between">
            {/* Dots */}
            <div className="space-x-1">
              {steps.map((_, index) => (
                <span
                  key={index}
                  className={`inline-block h-2 w-2 rounded-full ${
                    index === currentStep ? "bg-blue-500" : "bg-gray-300"
                  }`}
                ></span>
              ))}
            </div>

            {/* Next / Finish */}
            <Button onClick={handleNext}>
              {steps.length > 0 && currentStep === steps.length - 1
                ? "Finish"
                : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
