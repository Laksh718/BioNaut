import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  BarChart3,
  Lightbulb,
  Brain,
  CheckCircle,
  Sparkles,
} from "lucide-react";

const Navigation = ({
  activeTab,
  setActiveTab,
  searchResults,
  isGeneratingAI,
  aiInsights,
}) => {
  const tabs = [
    { id: "search", label: "Search", icon: Search, color: "text-blue-600" },
    {
      id: "trends",
      label: "Enhanced Trends",
      icon: BarChart3,
      color: "text-green-600",
    },
    {
      id: "recommendations",
      label: "Recommendations",
      icon: Lightbulb,
      color: "text-purple-600",
    },
    { id: "ai", label: "AI Insights", icon: Brain, color: "text-pink-600" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white shadow-sm border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-3 border-b-2 font-medium text-sm transition-all duration-300 rounded-t-lg ${
                  activeTab === tab.id
                    ? `border-${tab.color.split("-")[1]}-500 ${tab.color} bg-${
                        tab.color.split("-")[1]
                      }-50`
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={
                    activeTab === tab.id ? { rotate: [0, 10, -10, 0] } : {}
                  }
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="h-4 w-4" />
                </motion.div>
                <span>{tab.label}</span>
                {tab.id === "ai" && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {isGeneratingAI ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full"
                      />
                    ) : aiInsights ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <Sparkles className="h-3 w-3 text-purple-500" />
                    )}
                  </motion.div>
                )}
                {tab.id === "search" && searchResults.length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;

