import React from "react";
import { motion } from "framer-motion";
import { Rocket, Brain, Zap } from "lucide-react";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <div className="w-16 h-16 border-4 border-gray-200 border-t-nasa-blue rounded-full" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Rocket className="h-6 w-6 text-nasa-blue" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-center"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Brain className="h-4 w-4 text-purple-500" />
          <span>Powered by Gemini AI</span>
          <Zap className="h-4 w-4 text-yellow-500" />
        </div>
      </motion.div>

      {/* Animated dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex space-x-1 mt-4"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-2 h-2 bg-nasa-blue rounded-full"
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default LoadingSpinner;
