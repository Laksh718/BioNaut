import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const APIHealthBanner = ({ healthStatus }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [hasReloaded, setHasReloaded] = useState(false);
  // track previous health so we only reload when we transition from unhealthy -> healthy
  const prevIsHealthy = useRef(undefined);

  useEffect(() => {
    // If we previously set the reload flag, clear it and avoid reloading again
    const reloadFlag = sessionStorage.getItem("api_health_reloaded");
    if (reloadFlag === "true") {
      sessionStorage.removeItem("api_health_reloaded");
      setHasReloaded(true);
      // initialize prev state to healthy to avoid immediate reloads
      prevIsHealthy.current = true;
      return;
    }

    const currentHealthy = Boolean(healthStatus?.bionauts?.isHealthy);
    const previous = prevIsHealthy.current;

    // show banner only when currently unhealthy
    if (!currentHealthy) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }

    // Only reload when we detect a transition from explicit unhealthy (previous === false)
    // to healthy (currentHealthy === true). This avoids reloading on initial mount
    // if the API is already healthy.
    if (previous === false && currentHealthy && !hasReloaded) {
      // mark reload and perform single reload
      sessionStorage.setItem("api_health_reloaded", "true");
      setHasReloaded(true);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }

    // update previous state for next run
    prevIsHealthy.current = currentHealthy;
  }, [healthStatus?.bionauts?.isHealthy, hasReloaded]);

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
