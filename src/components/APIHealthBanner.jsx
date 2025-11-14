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

    // Show banner ONLY if bionauts API is unhealthy
    if (bionautsUnhealthy) {
      setShowBanner(true);
      setWasUnhealthy(true);
    } else {
      // Hide banner when healthy
      setShowBanner(false);
      
      // If it was unhealthy and now healthy, reload the page ONCE
      if (wasUnhealthy && !hasReloaded) {
        console.log("[API Status] API is now healthy, reloading page...");
        // Set flag before reloading
        sessionStorage.setItem('api_health_reloaded', 'true');
        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
    }
  }, [healthStatus.bionauts.isHealthy, wasUnhealthy, hasReloaded]);

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
