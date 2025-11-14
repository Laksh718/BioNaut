import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BarChart3,
  Lightbulb,
  Brain,
  Home,
  Settings,
  User,
  BookOpen,
  Database,
  TrendingUp,
  Activity,
  Globe,
  Satellite,
  ChevronLeft,
  ChevronRight,
  Zap,
  Target,
  Layers,
  Sparkles,
} from "lucide-react";

const ModernSidebar = ({
  activeTab,
  setActiveTab,
  searchResults,
  isGeneratingAI,
  aiInsights,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);

  const mainTabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      gradient: "from-blue-500 to-cyan-500",
      description: "Overview & Analytics",
    },
    {
      id: "search",
      label: "Search",
      icon: Search,
      gradient: "from-emerald-500 to-teal-500",
      description: "Research Discovery",
    },
    {
      id: "trends",
      label: "Trends",
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-500",
      description: "Market Analysis",
    },
    {
      id: "recommendations",
      label: "Recommendations",
      icon: Target,
      gradient: "from-orange-500 to-red-500",
      description: "AI Suggestions",
    },
    {
      id: "ai",
      label: "HackerNaut AI Insights",
      icon: Sparkles,
      gradient: "from-indigo-500 to-purple-500",
      description: "Smart Analysis",
    },
  ];

  const secondaryTabs = [
    {
      id: "library",
      label: "Library",
      icon: BookOpen,
      gradient: "from-gray-500 to-slate-500",
      description: "Research Archive",
    },
    {
      id: "datasets",
      label: "Datasets",
      icon: Database,
      gradient: "from-cyan-500 to-blue-500",
      description: "Data Sources",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      gradient: "from-gray-500 to-gray-600",
      description: "Preferences",
    },
  ];

  const TabButton = ({ tab, isMain = true }) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;

    return (
      <motion.button
        onClick={() => setActiveTab(tab.id)}
        onMouseEnter={() => setHoveredTab(tab.id)}
        onMouseLeave={() => setHoveredTab(null)}
        className={`relative w-full group transition-all duration-300 ${
          isCollapsed ? "px-3 py-4" : "px-4 py-3"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background gradient */}
        <motion.div
          className={`absolute inset-0 rounded-xl bg-gradient-to-r ${
            tab.gradient
          } ${isActive ? "opacity-100" : "opacity-0"}`}
          animate={{
            opacity: isActive ? 1 : hoveredTab === tab.id ? 0.1 : 0,
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Content */}
        <div className="relative flex items-center space-x-3">
          <div
            className={`p-2 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-600 group-hover:bg-white/10 group-hover:text-gray-800"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0"
              >
                <div
                  className={`font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-gray-700 group-hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </div>
                <div
                  className={`text-xs transition-colors duration-200 ${
                    isActive
                      ? "text-white/80"
                      : "text-gray-500 group-hover:text-gray-600"
                  }`}
                >
                  {tab.description}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"
            layoutId="activeIndicator"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.button>
    );
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`bg-white/95 backdrop-blur-md border-r border-gray-200/50 shadow-xl ${
        isCollapsed ? "w-20" : "w-80"
      } transition-all duration-300 ease-in-out`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">BioNaut</h1>
                  <p className="text-sm text-gray-600">Research Platform</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* Main Navigation */}
        <div className="p-4">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Main Navigation
                </h3>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            {mainTabs.map((tab) => (
              <TabButton key={tab.id} tab={tab} isMain={true} />
            ))}
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="p-4 border-t border-gray-200/50">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Tools & Settings
                </h3>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            {secondaryTabs.map((tab) => (
              <TabButton key={tab.id} tab={tab} isMain={false} />
            ))}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="p-4 border-t border-gray-200/50">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {/* AI Status */}
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      AI System
                    </div>
                    <div className="text-xs text-gray-600">Online & Ready</div>
                  </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {searchResults.length} Results
                      </div>
                      <div className="text-xs text-gray-600">
                        Search Complete
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Generation */}
                {isGeneratingAI && (
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                    <motion.div
                      className="w-2 h-2 bg-orange-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        HackerNaut AI Analysis
                      </div>
                      <div className="text-xs text-gray-600">
                        Generating Insights...
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/50">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  Research User
                </div>
                <div className="text-xs text-gray-600">NASA Space Biology</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ModernSidebar;

