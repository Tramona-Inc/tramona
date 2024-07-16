import WordFadeIn from "@/components/ui/word-fade-in";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

export default function LoadingPropertyScrape() {
  return (
    <div className="flex flex-col items-center justify-center">
      <WordFadeIn
        className="text-sm"
        delay={0.3}
        words="Searching for property "
      />
      <div className="grid place-content-center bg-white px-4 py-2">
        <BarLoader />
      </div>
    </div>
  );
}

const variants: Variants = {
  initial: {
    scaleY: 0.5,
    opacity: 0,
  },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 1,
      ease: "circIn",
    },
  },
};

const BarLoader = () => {
  return (
    <motion.div
      transition={{
        staggerChildren: 0.25,
      }}
      initial="initial"
      animate="animate"
      className="flex gap-1"
    >
      <motion.div variants={variants} className="h-12 w-2 bg-primaryGreen" />
      <motion.div variants={variants} className="h-12 w-2 bg-primaryGreen" />
      <motion.div variants={variants} className="h-12 w-2 bg-primaryGreen" />
      <motion.div variants={variants} className="h-12 w-2 bg-primaryGreen" />
      <motion.div
        variants={variants}
        className="h-12 w-2 bg-primaryGreen-hover"
      />
    </motion.div>
  );
};
