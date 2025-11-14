import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const APIHealthBanner = ({ healthStatus }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showConnected, setShowConnected] = useState(false);
  const hasReloadedRef = useRef(false);
  const prevHealthyRef = useRef(null);
  const initialCheckDone = useRef(false);

  useEffect(() => {
    // Check if we already reloaded in this session (only once on mount)
    if (!initialCheckDone.current && sessionStorage.getItem("api_health_reloaded") === "true") {
      hasReloadedRef.current = true;
      sessionStorage.removeItem("api_health_reloaded");
      initialCheckDone.current = true;
    }

    const isHealthy = healthStatus?.bionauts?.isHealthy;

    // Show banner only when unhealthy
    if (!isHealthy) {
      setShowBanner(true);
      setShowConnected(false);
    } else {
      setShowBanner(false);
    }

    // Only reload if:
    // 1. We haven't reloaded yet in this session
    // 2. Previous state was explicitly false (unhealthy)
    // 3. Current state is true (healthy)
    if (
      !hasReloadedRef.current &&
      prevHealthyRef.current === false &&
      isHealthy === true
    ) {
      console.log("[API Status] API recovered, showing connected message...");
      // Show connected message first
      setShowBanner(false);
      setShowConnected(true);
      
      hasReloadedRef.current = true;
      sessionStorage.setItem("api_health_reloaded", "true");
      
      // Wait a bit to show message, then reload
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }

    // Update previous state
    prevHealthyRef.current = isHealthy;
  }, [healthStatus?.bionauts?.isHealthy]);

  // Don't show anything if both are false
  if (!showBanner && !showConnected) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl rounded-lg"
        >
          <div className="px-6 py-2.5 flex items-center gap-3">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <p className="font-semibold text-sm">
              API starting up, please wait...
            </p>
          </div>
        </motion.div>
      )}
      
      {showConnected && (
        <motion.div
          key="connected"
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl rounded-lg"
        >
          <div className="px-6 py-2.5 flex items-center gap-3">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="font-semibold text-sm">
              Connected! Refreshing...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default APIHealthBanner;
