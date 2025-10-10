import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import DashboardOverview from "./DashboardOverview";
import SearchSection from "./SearchSection";
import SearchResults from "./SearchResults";
import SummarySection from "./SummarySection";
import TrendAnalysis from "./TrendAnalysis";
import Recommendations from "./Recommendations";
import Library3D from "./Library3D";
import EnhancedRecommendations from "./EnhancedRecommendations";
import EnhancedTrendAnalysis from "./EnhancedTrendAnalysis";
import AppOverview from "./AppOverview";
import DataSources from "./DataSources";
import AIAnalytics from "./AIAnalytics";
import SettingsPage from "./SettingsPage";

const DashboardLayout = ({
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
  apiStatus,
  healthStatus,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardOverview
            searchResults={searchResults}
            summary={summary}
            isGeneratingAI={isGeneratingAI}
            aiInsights={aiInsights}
            filters={filters}
            showAIInsights={showAIInsights}
            setShowAIInsights={setShowAIInsights}
            handleAIInsightsComplete={handleAIInsightsComplete}
            searchQuery={searchQuery}
            setActiveTab={setActiveTab}
          />
        );
      case "search":
        return (
          <div className="space-y-6">
            <SearchSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              handleKeyPress={handleKeyPress}
              isLoading={isLoading}
              isGeneratingAI={isGeneratingAI}
              filters={filters}
              setFilters={setFilters}
              healthStatus={healthStatus}
            />
            {searchResults.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <SearchResults
                    searchResults={searchResults}
                    isGeneratingAI={isGeneratingAI}
                    downloadResults={downloadResults}
                    searchQuery={searchQuery}
                  />
                </div>
                <div className="space-y-6">
                  <SummarySection
                    summary={summary}
                    healthStatus={healthStatus}
                  />
                  <AIAnalytics
                    searchResults={searchResults}
                    searchQuery={searchQuery}
                  />
                </div>
              </div>
            )}
          </div>
        );
      case "trends":
        return <EnhancedTrendAnalysis />;
      case "recommendations":
        return <Recommendations />;
      case "library":
        return (
          <div className="h-full">
            <Library3D />
          </div>
        );
      case "overview":
        return <AppOverview />;
      case "data-sources":
        return <DataSources />;
      case "settings":
        return <SettingsPage />;
      default:
        return (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Coming Soon
              </h3>
              <p className="text-gray-600">This feature is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchResults={searchResults}
          isGeneratingAI={isGeneratingAI}
          aiInsights={aiInsights}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Floating Header */}
        <DashboardHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          handleKeyPress={handleKeyPress}
          isLoading={isLoading}
          isGeneratingAI={isGeneratingAI}
          apiStatus={apiStatus}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
            isCollapsed ? "ml-20 mr-4" : "ml-72 mr-4"
          } pt-32`}
        >
          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
