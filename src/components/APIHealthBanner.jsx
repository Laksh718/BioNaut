import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const APIHealthBanner = ({ healthStatus }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [wasUnhealthy, setWasUnhealthy] = useState(false);

  useEffect(() => {
    const bionautsUnhealthy = !healthStatus.bionauts.isHealthy;

    // Show banner if bionauts API is unhealthy
    if (bionautsUnhealthy) {
      setShowBanner(true);
      setWasUnhealthy(true);
    } else if (wasUnhealthy && healthStatus.bionauts.isHealthy) {
      // If it was unhealthy and now healthy, reload the page
      console.log("API is now healthy, reloading page...");
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Small delay to show the status change
    }
  }, [healthStatus.bionauts.isHealthy, wasUnhealthy]);

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white px-6 py-3 shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <div>
              <p className="font-semibold">
                API is starting up, please wait...
              </p>
              <p className="text-sm text-yellow-100">
                The server is waking up. This may take a moment.
              </p>
            </div>
          </div>
          {healthStatus.bionauts.isHealthy && (
            <div className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="font-semibold">Connected! Refreshing...</span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default APIHealthBanner;
