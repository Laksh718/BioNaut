import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const APIHealthBanner = ({ healthStatus }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [wasUnhealthy, setWasUnhealthy] = useState(false);
  const [hasReloaded, setHasReloaded] = useState(false);

  useEffect(() => {
    // Check if we just reloaded due to health recovery
    const reloadFlag = sessionStorage.getItem('api_health_reloaded');
    if (reloadFlag === 'true') {
      // Clear the flag and don't show banner or reload again
      sessionStorage.removeItem('api_health_reloaded');
      setHasReloaded(true);
      return;
    }

    const bionautsUnhealthy = !healthStatus.bionauts.isHealthy;

    // Show banner if bionauts API is unhealthy
    if (bionautsUnhealthy) {
      setShowBanner(true);
      setWasUnhealthy(true);
    } else if (wasUnhealthy && healthStatus.bionauts.isHealthy && !hasReloaded) {
      // If it was unhealthy and now healthy, reload the page ONCE
      console.log("[API Status] API is now healthy, reloading page...");
      // Set flag before reloading
      sessionStorage.setItem('api_health_reloaded', 'true');
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Small delay to show the status change
    }
  }, [healthStatus.bionauts.isHealthy, wasUnhealthy, hasReloaded]);

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            <div>
              <p className="font-bold text-lg">
                API Starting Up
              </p>
              <p className="text-sm text-yellow-50">
                The server is waking up, this may take a moment...
              </p>
            </div>
          </div>
          {healthStatus.bionauts.isHealthy && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 bg-green-500 px-5 py-2.5 rounded-lg shadow-lg"
            >
              <svg
                className="w-6 h-6"
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
              <span className="font-bold text-lg">Connected!</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default APIHealthBanner;
