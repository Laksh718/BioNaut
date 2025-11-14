import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./Header";
import Navigation from "./Navigation";
import SearchSection from "./SearchSection";
import SearchResults from "./SearchResults";
import SummarySection from "./SummarySection";
import TrendAnalysis from "./TrendAnalysis";
import Recommendations from "./Recommendations";
import AIInsights from "./AIInsights";

const MainLayout = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleKeyPress,
  isLoading,
  isGeneratingAI,
  filters,
  setFilters,
  searchResults,
  summary,
  downloadResults,
  showAIInsights,
  setShowAIInsights,
  aiInsights,
  handleAIInsightsComplete,
  useEnhancedComponents,
  setUseEnhancedComponents,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchResults={searchResults}
        isGeneratingAI={isGeneratingAI}
        aiInsights={aiInsights}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "search" && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <SearchSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                handleKeyPress={handleKeyPress}
                isLoading={isLoading}
                isGeneratingAI={isGeneratingAI}
                filters={filters}
                setFilters={setFilters}
              />

              {searchResults.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <SearchResults
                      searchResults={searchResults}
                      isGeneratingAI={isGeneratingAI}
                      downloadResults={downloadResults}
                    />
                  </div>
                  <div>
                    <SummarySection summary={summary} />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "trends" && (
            <motion.div
              key="trends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TrendAnalysis />
            </motion.div>
          )}

          {activeTab === "recommendations" && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Recommendations />
            </motion.div>
          )}

          {activeTab === "ai" && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12"
            >
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    🧠
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  HackerNaut AI Insights Ready
                </h3>
                <p className="text-gray-600 mb-6">
                  Click the button below to view detailed HackerNaut AI analysis of your
                  search results
                </p>
                <motion.button
                  onClick={() => setShowAIInsights(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View HackerNaut AI Analysis
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HackerNaut AI Insights Modal */}
        <AIInsights
          searchQuery={searchQuery}
          results={searchResults}
          isOpen={showAIInsights}
          onClose={() => setShowAIInsights(false)}
          isGeneratingAI={isGeneratingAI}
          onAIComplete={handleAIInsightsComplete}
          preGeneratedInsights={aiInsights}
        />
      </main>
    </div>
  );
};

export default MainLayout;

