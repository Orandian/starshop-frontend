"use client";

import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Tab = {
  title: string;
  value: string;
  content: React.ReactNode | (() => React.ReactNode);
};

export const Tabs = ({
  activeValue,
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}: {
  activeValue: string;
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}) => {

  const activeTab = propTabs.find(tab => tab.value === activeValue) || propTabs[0];

  return (
    <>
      <div className={cn(
        "flex flex-row items-center justify-start [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full",
        containerClassName
      )}>
        {propTabs.map((tab) => (
          <button
            key={tab.value}
            className={cn(
              "relative px-6 py-3 rounded-lg font-medium transition-colors",
              tabClassName
            )}
          >
            {activeValue === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className={cn(
                  "absolute inset-0 bg-blue-100 rounded-lg",
                  activeTabClassName
                )}
              />
            )}
            <span className={cn(
              "relative block transition-colors",
              activeValue === tab.value
                ? "text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            )}>
              {tab.title}
            </span>
          </button>
        ))}
      </div>
      <FadeInDiv
        active={activeTab}
        className={cn("mt-8", contentClassName)}
      />
    </>
  );
};

export const FadeInDiv = ({
  className,
  active,
}: {
  className?: string;
  active: Tab;
}) => {
  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={active.value}
          initial={{ opacity: 0, x: 300, scale: 0.8, rotateY: 90 }}
          animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, x: -300, scale: 0.8, rotateY: -90, transition: { duration: 0.3 } }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
          style={{ transformStyle: "preserve-3d" }}
          className={cn("w-full h-full", className)}
        >
          {typeof active.content === "function" ? active.content() : active.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

