import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Activity, Menu } from "lucide-react";
import SearchSuggestions from "./SearchSuggestions";

const DashboardHeader = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleKeyPress,
  isLoading,
  isGeneratingAI,
  apiStatus,
  isCollapsed,
  setIsCollapsed,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    handleSearch();
  };
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-2 sm:top-4 z-40 bg-white/90 backdrop-blur-md shadow-lg border border-gray-200/50 rounded-xl sm:rounded-2xl px-3 sm:px-6 py-3 sm:py-4 transition-all duration-300 ${
        isCollapsed
          ? "left-16 sm:left-20 right-2 sm:right-4"
          : "left-4 sm:left-72 right-2 sm:right-4"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors mr-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </motion.button>

        {/* Logo - Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3 flex-shrink-0"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
          >
            <img
              src="/hackernauts-logo.png"
              alt="HackerNauts Logo"
              className="w-full h-full object-cover rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
            />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              BioNaut
            </h1>
          </div>
        </motion.div>

        {/* Centered Search Box - Made Lengthy */}
        <div className="flex-1 flex justify-center px-2 sm:px-8">
          <div className="relative w-full max-w-4xl sm:max-w-6xl">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-7 w-7 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(e.target.value.length === 0);
              }}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search NASA space biology research..."
              className="block w-full pl-12 sm:pl-14 pr-16 sm:pr-20 py-3 sm:py-5 border border-gray-300 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg sm:text-2xl font-medium shadow-sm"
            />
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleSearch}
                disabled={isLoading || isGeneratingAI || !searchQuery.trim()}
                className="absolute inset-y-0 right-0 pr-5 flex items-center"
              >
                <div className="px-4 sm:px-8 py-2 sm:py-4 bg-blue-600 text-white rounded-lg sm:rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm sm:text-xl">
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Searching...</span>
                    </>
                  ) : isGeneratingAI ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>AI Processing...</span>
                    </>
                  ) : (
                    <span>Search</span>
                  )}
                </div>
              </motion.button>
            )}

            {/* Search Suggestions */}
            <SearchSuggestions
              onSelectSuggestion={handleSuggestionSelect}
              isVisible={showSuggestions}
            />
          </div>
        </div>

        {/* Status - Right Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-green-100 text-green-800 flex-shrink-0"
        >
          <Activity className="h-5 w-5" />
          <span className="text-sm font-medium">Knowledge Base Active</span>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;
