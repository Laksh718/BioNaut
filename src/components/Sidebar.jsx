import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  BarChart3,
  Lightbulb,
  Home,
  Settings,
  BookOpen,
  TrendingUp,
  Activity,
  Globe,
  Satellite,
  ChevronLeft,
  ChevronRight,
  Info,
  Database,
} from "lucide-react";

const Sidebar = ({
  activeTab,
  setActiveTab,
  searchResults,
  isGeneratingAI,
  aiInsights,
  isCollapsed,
  setIsCollapsed,
}) => {
  const mainTabs = [
    { id: "dashboard", label: "Dashboard", icon: Home, color: "text-blue-600" },
    { id: "search", label: "Search", icon: Search, color: "text-green-600" },
    {
      id: "trends",
      label: "Trends",
      icon: BarChart3,
      color: "text-purple-600",
    },
    {
      id: "recommendations",
      label: "Recommendations",
      icon: Lightbulb,
      color: "text-orange-600",
    },
    {
      id: "overview",
      label: "App Overview",
      icon: Info,
      color: "text-indigo-600",
    },
    {
      id: "data-sources",
      label: "Data Sources",
      icon: Database,
      color: "text-teal-600",
    },
  ];

  const secondaryTabs = [
    { id: "library", label: "Library", icon: BookOpen, color: "text-gray-600" },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      color: "text-gray-600",
    },
  ];

  return (
    <>
      {/* Floating Sidebar */}
      <motion.aside
        initial={{
          x: -300,
          opacity: 0,
        }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        className={`fixed top-4 left-4 bottom-4 z-50 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="h-full bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col overflow-hidden">
          {/* Header Section */}
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg flex items-center justify-center"
              >
                <img
                  src="/hackernauts-logo.png"
                  alt="HackerNauts Logo"
                  className="w-full h-full object-cover rounded-xl"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
                />
              </motion.div>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-xl font-bold text-white">BioNaut</h1>
                  <p className="text-xs text-slate-400 flex items-center space-x-1">
                    <Satellite className="h-3 w-3" />
                    <span>HackerNauts AI</span>
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {/* Main Navigation */}
            <div className="space-y-1">
              {mainTabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      animate={isActive ? { rotate: [0, 10, -10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-medium"
                      >
                        {tab.label}
                      </motion.span>
                    )}

                    {/* Status Indicators */}
                    {tab.id === "search" && searchResults.length > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-2 h-2 bg-green-400 rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-slate-700/50 my-4" />

            {/* Secondary Navigation */}
            <div className="space-y-1">
              {secondaryTabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * (index + 5) }}
                    onClick={() => setActiveTab(tab.id)}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="h-5 w-5" />
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-medium"
                      >
                        {tab.label}
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700/50">
            <motion.button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center justify-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                ) : (
                  <ChevronLeft className="h-4 w-4 text-slate-300" />
                )}
              </motion.div>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-2 text-sm text-slate-300"
                >
                  Collapse
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
