import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

const loadingStates = [
  "Pulling property in",
  "Connecting with Airbnb account",
  "Finalizing account creation",
];

const TOTAL_DURATION = 9000;
const UPDATE_INTERVAL = 50;

function useLoadingState() {
  const [currentState, setCurrentState] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = (elapsedTime / TOTAL_DURATION) * 100;

      if (newProgress >= 100) {
        setProgress(100);
        setIsComplete(true);
        clearInterval(timer);
      } else {
        setProgress(newProgress);
        const newState = Math.floor(newProgress / (100 / loadingStates.length));
        if (newState !== currentState) {
          setCurrentState(newState);
        }
      }
    }, UPDATE_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return {
    currentMessage: loadingStates[currentState] ?? "",
    isComplete,
    progress,
  };
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="mt-4 h-2 w-64 overflow-hidden rounded-full bg-gray-200">
      <motion.div
        className="h-full bg-blue-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

function Ellipsis() {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
    >
      ...
    </motion.span>
  );
}

export default function LoadingPage() {
  const { currentMessage, isComplete, progress } = useLoadingState();
  const router = useRouter();

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => {
        void router.push("/");
      }, 1000);
    }
  }, [isComplete, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key={currentMessage}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-3xl font-bold text-gray-800"
          >
            {currentMessage}
            <Ellipsis />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-800"
          >
            All done!
          </motion.div>
        )}
      </AnimatePresence>
      {!isComplete && <ProgressBar progress={progress} />}
    </div>
  );
}
