import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const APIHealthBanner = ({ healthStatus }) => {
  const [showBanner, setShowBanner] = useState(false);
  const hasReloadedRef = useRef(false);
  const prevHealthyRef = useRef(null);

  useEffect(() => {
    // Check if we already reloaded in this session
    if (sessionStorage.getItem("api_health_reloaded") === "true") {
      hasReloadedRef.current = true;
      sessionStorage.removeItem("api_health_reloaded");
      return;
    }

    const isHealthy = healthStatus?.bionauts?.isHealthy;

    // Show banner only when unhealthy
    setShowBanner(!isHealthy);

    // Only reload if:
    // 1. We haven't reloaded yet in this session
    // 2. Previous state was explicitly false (unhealthy)
    // 3. Current state is true (healthy)
    if (
      !hasReloadedRef.current &&
      prevHealthyRef.current === false &&
      isHealthy === true
    ) {
      console.log("[API Status] API recovered, reloading once...");
      hasReloadedRef.current = true;
      sessionStorage.setItem("api_health_reloaded", "true");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }

    // Update previous state
    prevHealthyRef.current = isHealthy;
  }, [healthStatus?.bionauts?.isHealthy]);

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
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
    </AnimatePresence>
  );
};

export default APIHealthBanner;
