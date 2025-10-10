import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react";

const ServiceLoadingAnimation = ({
  isVisible,
  unhealthyServices = [],
  duration = 5000,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setIsComplete(false);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100 && !isComplete) {
        setIsComplete(true);
        setTimeout(() => {
          onComplete && onComplete();
        }, 500); // Small delay before calling onComplete
      }
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, [isVisible, duration, isComplete, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              animate={{
                rotate: isComplete ? 0 : 360,
                scale: isComplete ? 1 : [1, 1.1, 1],
              }}
              transition={{
                rotate: {
                  duration: 2,
                  repeat: isComplete ? 0 : Infinity,
                  ease: "linear",
                },
                scale: { duration: 1, repeat: isComplete ? 0 : Infinity },
              }}
              className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              {isComplete ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              )}
            </motion.div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {isComplete ? "Services Recovered" : "Service Health Check"}
            </h3>

            <p className="text-gray-600">
              {isComplete
                ? "All services are now healthy and ready to use."
                : "Checking service health status..."}
            </p>
          </div>

          {/* Service Status */}
          <div className="space-y-3 mb-6">
            {unhealthyServices.map((service, index) => (
              <motion.div
                key={service}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{
                      scale: isComplete ? 1 : [1, 1.2, 1],
                      rotate: isComplete ? 0 : [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: isComplete ? 0 : Infinity,
                      delay: index * 0.2,
                    }}
                  >
                    {isComplete ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </motion.div>

                  <div>
                    <span className="font-medium text-gray-900 capitalize">
                      {service} Service
                    </span>
                    <p className="text-sm text-gray-600">
                      {isComplete ? "Healthy" : "Checking..."}
                    </p>
                  </div>
                </div>

                {!isComplete && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Clock className="h-4 w-4 text-gray-400" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Health Check Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Status Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-sm text-gray-600">
              {isComplete
                ? "You can now proceed with your search or summarization."
                : "Please wait while we verify service availability..."}
            </p>
          </motion.div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-4 right-4 w-20 h-20 bg-blue-100 rounded-full"
            />
            <motion.div
              animate={{
                x: [0, -50, 0],
                y: [0, -30, 0],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-4 left-4 w-16 h-16 bg-green-100 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ServiceLoadingAnimation;
