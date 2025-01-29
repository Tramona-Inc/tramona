import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, MotionValue } from "framer-motion";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import supabase from "@/utils/supabase-client";

const AESTHETIC_LOADING_TEXT = [
  "Connecting to Airbnb",
  "Communicating with Airbnb",
  "Optimizing Data Transfer",
  "Syncing Property Details",
  "Preparing Your Property Profile",
];

const checkingStates = [
  "Analyzing Results",
  "Checking Host Team Ownership",
  "Finalizing Setup",
  "Redirecting...",
];

const TOTAL_DURATION = 60000;
const UPDATE_INTERVAL = 50;
const AESTHETIC_TEXT_INTERVAL = 3000;

function useCombinedLoadingState({
  isSessionLoaded,
  hasHostTeamCreatedEvent,
  isUserHostTeamOwner,
}: {
  isSessionLoaded: boolean;
  hasHostTeamCreatedEvent: boolean;
  isUserHostTeamOwner: boolean | undefined;
}) {
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(checkingStates[0]);
  const [isComplete, setIsComplete] = useState(false);
  const progress: MotionValue<number> = useSpring(0, {
    stiffness: 100,
    damping: 20,
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [isTimeout, setIsTimeout] = useState(false); // New state to track timeout

  // ------- ROTATES THE MESSAGES ON INDEX -------
  useEffect(() => {
    if (checkingStates[currentStateIndex]) {
      setCurrentMessage(checkingStates[currentStateIndex]);
      console.log(
        `[useCombinedLoadingState] Message updated to: ${checkingStates[currentStateIndex]}`,
      );
    }
  }, [currentStateIndex]);

  ///
  useEffect(() => {
    if (isSessionLoaded) {
      if (currentStateIndex < 1) {
        setCurrentStateIndex(1);
        console.log(
          "[useCombinedLoadingState] Session loaded, moving to state 1 (Checking Host Team Ownership)",
        );
      }
    }
  }, [isSessionLoaded, currentStateIndex]);

  useEffect(() => {
    if (currentStateIndex < 2) {
      // basically index q
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const elapsedTime = Date.now() - (startTimeRef.current ?? Date.now());
        const newProgress = (elapsedTime / TOTAL_DURATION) * 100 + 40;
        console.log(
          "[useCombinedLoadingState] Interval tick - newProgress:",
          newProgress,
        ); // LOG 1: Interval Progress Value
        if (newProgress >= 99) {
          console.log(
            "[useCombinedLoadingState] TIMEOUT CONDITION MET - newProgress:",
            newProgress,
          ); // LOG 2: Timeout Condition Check
          progress.set(100);
          setCurrentStateIndex(3); // Immediately move to "Redirecting..." state on timeout
          console.log(); // LOG 3: State Index Update
          setIsTimeout(true); // Set timeout state to true
          console.log("[useCombinedLoadingState] Setting isTimeout to true"); // LOG 4: isTimeout State Update
          if (timerRef.current) {
            clearInterval(timerRef.current);
            console.log("[useCombinedLoadingState] Clearing Interval Timer"); // LOG 5: Clearing Timer
          }
        } else {
          progress.set(newProgress);
        }
      }, UPDATE_INTERVAL);
    } else {
      if (currentStateIndex === 2) {
        progress.set(90);
      }
      console.log(
        "[useCombinedLoadingState] currentStateIndex >= 2, clearing timer (not in timeout phase)",
      );
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      console.log(
        "[useCombinedLoadingState] Cleanup function - clearing timer",
      );
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentStateIndex]);

  useEffect(() => {
    if (hasHostTeamCreatedEvent) {
      if (currentStateIndex < 2) {
        setCurrentStateIndex(2);
        console.log(
          "[useCombinedLoadingState] Host team event received, moving to state 2 (Finalizing Setup) and setting progress to 100",
        );
        progress.set(80);
        setTimeout(() => {
          progress.set(95);
        }, 1000);
      }
    }
  }, [hasHostTeamCreatedEvent, currentStateIndex]);

  useEffect(() => {
    if (isUserHostTeamOwner !== undefined) {
      // No need to set state here anymore for redirection on success/failure, timeout handles redirection state
      setIsComplete(true); // Still mark as complete when ownership is resolved logically
      console.log(
        "[useCombinedLoadingState] isUserHostTeamOwner resolved, marking as complete (redirection handled by timeout or success path)",
      );
    }
  }, [isUserHostTeamOwner]);

  console.log(
    "[useCombinedLoadingState] Returning progress value:",
    progress.get(),
  );
  return {
    currentMessage,
    isComplete,
    progress,
    currentStateIndex,
    isTimeout, // Expose isTimeout state
  };
}

function ProgressBar({ progress }: { progress: MotionValue<number> }) {
  console.log("ProgressBar progress:", progress.get());

  return (
    <div className="mt-4 h-2 w-64 overflow-hidden rounded-full border bg-gray-200">
      <motion.div className="h-full bg-teal-900" style={{ width: progress }} />
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

export default function CombinedLoadingPage() {
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const [hasHostTeamCreatedEvent, setHasHostTeamCreatedEvent] = useState(false);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [loadingTimeoutExpired, setLoadingTimeoutExpired] = useState(false);
  // ----- Aesthetic Text State -----
  const [aestheticTextIndex, setAestheticTextIndex] = useState(0);

  const { data: isUserHostTeamOwner, refetch: refetchIsUserHostTeamOwner } =
    api.hostTeams.isUserHostTeamOwner.useQuery(
      { userId: session?.user.id ?? "" },
      { enabled: isSessionLoaded && hasHostTeamCreatedEvent },
    );

  const { currentMessage, isComplete, progress, isTimeout } =
    useCombinedLoadingState({
      isSessionLoaded,
      hasHostTeamCreatedEvent,
      isUserHostTeamOwner,
    });

  // ---- Aesthetic Text Rotation -----
  useEffect(() => {
    const intervalId = setInterval(() => {
      setAestheticTextIndex(
        (prevIndex) => (prevIndex + 1) % AESTHETIC_LOADING_TEXT.length,
      );
    }, AESTHETIC_TEXT_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  //if logged in setState
  useEffect(() => {
    if (status === "authenticated") {
      setIsSessionLoaded(true);
    }
  }, [status]);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setLoadingTimeoutExpired(true);
    }, TOTAL_DURATION); // Use TOTAL_DURATION for timeout as well

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (loadingTimeoutExpired || isTimeout) {
      void router.push("/why-list");
    }
  }, [loadingTimeoutExpired, router, isUserHostTeamOwner, isTimeout]);

  useEffect(() => {
    const checkHostTeamOwnership = async () => {
      if (hasHostTeamCreatedEvent) {
        void refetchIsUserHostTeamOwner(); // Removed await to not block and let timeout logic flow naturally
      }
    };
    void checkHostTeamOwnership();
  }, [hasHostTeamCreatedEvent, refetchIsUserHostTeamOwner]);

  useEffect(() => {
    if (isUserHostTeamOwner !== undefined) {
      if (isUserHostTeamOwner) {
        setTimeout(() => {
          void router.push("/host");
        }, 2500);
      }
    }
  }, [isUserHostTeamOwner, router, isComplete]);

  useEffect(() => {
    if (isSessionLoaded && session?.user.id) {
      const channel = supabase.channel("host_teams_channel");

      channel
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "host_teams",
          },
          (payload) => {
            if (payload.new.owner_id === session.user.id) {
              setHasHostTeamCreatedEvent(true);
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
            }
          },
        )
        .subscribe();

      return () => {
        void supabase.removeChannel(channel);
      };
    }
  }, [isSessionLoaded, session?.user.id, supabase]);

  console.log("CombinedLoadingPage isTimeout:", isTimeout); // LOG 6: Check isTimeout prop in CombinedLoadingPage
  console.log("CombinedLoadingPage progress", progress.get());

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <AnimatePresence mode="wait">
        {!isTimeout &&
          (!isComplete ? (
            <div className="flex flex-col items-center justify-center">
              <motion.div
                key={AESTHETIC_LOADING_TEXT[aestheticTextIndex]}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center text-3xl font-bold text-gray-800"
              >
                {AESTHETIC_LOADING_TEXT[aestheticTextIndex]}
                <Ellipsis />
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-800"
            >
              You&apos;re all set! Let&apos;s jump into your host dashboard
            </motion.div>
          ))}
      </AnimatePresence>
      {isComplete || (!isTimeout && <ProgressBar progress={progress} />)}
      {!isTimeout && !isComplete && (
        <motion.div
          key={currentMessage}
          initial={{ y: 20, opacity: 0 }} // Initial position: slightly below, transparent
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-3 text-center text-xs font-bold text-gray-400"
        >
          {/* {currentMessage} USE FOR TESTING */}
          Just a minute more, we&apos;re almost finished!
        </motion.div>
      )}
      {isTimeout &&
        (console.log(
          "[CombinedLoadingPage] Redirecting text is rendering because isTimeout is:",
          isTimeout,
        ), // LOG 7: Conditional Render Check
        (
          <p className="mt-2 text-gray-600">
            Redirecting you to why-list page...
          </p>
        ))}
    </div>
  );
}
