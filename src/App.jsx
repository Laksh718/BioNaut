import React, { useState, useEffect } from "react";
import {
  apiService,
  enhancedSearch,
  formatSearchResults,
  formatSummary,
  formatTrendAnalysis,
  getExternalSummary,
} from "./services/api";
import DashboardLayout from "./components/DashboardLayout";
import { geminiService } from "./services/geminiService";
import healthCheckService from "./services/healthCheckService";

const App = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState("checking");
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [useEnhancedComponents, setUseEnhancedComponents] = useState(true);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [healthStatus, setHealthStatus] = useState({
    bionauts: { status: "unknown", lastChecked: null, isHealthy: false },
    summarizer: { status: "unknown", lastChecked: null, isHealthy: false },
  });

  // Search filters
  const [filters, setFilters] = useState({
    numResults: 5,
    sourceType: "All",
    source: "All",
    yearRange: null,
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    // Initialize health check service
    const handleHealthStatusChange = (newHealthStatus) => {
      setHealthStatus(newHealthStatus);
      console.log("[App] Health status updated:", newHealthStatus);
    };

    // Add listener for health status changes
    healthCheckService.addListener(handleHealthStatusChange);

    // Start periodic health checks
    healthCheckService.startPeriodicChecks();

    // Legacy API health check for backward compatibility
    const checkApiHealth = async () => {
      try {
        const response = await apiService.healthCheck();
        setApiStatus(response.status === "ok" ? "online" : "offline");
      } catch (error) {
        setApiStatus("offline");
        console.error("API health check failed:", error);
      }
    };

    checkApiHealth();

    // Cleanup function
    return () => {
      healthCheckService.removeListener(handleHealthStatusChange);
      healthCheckService.stopPeriodicChecks();
    };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setIsGeneratingAI(true);
    setError(null);

    try {
      const searchOptions = {
        k: filters.numResults,
        source_type: filters.sourceType !== "All" ? filters.sourceType : null,
        source: filters.source !== "All" ? filters.source : null,
        year_range: filters.yearRange,
        start_date: filters.startDate,
        end_date: filters.endDate,
      };

      const formattedResults = await enhancedSearch(searchQuery, searchOptions);
      setSearchResults(formattedResults);

      // Generate summary using external API or fallback
      console.log("Generating summary for query:", searchQuery);

      try {
        // Try to get summary from external API if we have results with filenames
        const externalResult = formattedResults.find(
          (result) => result.pdf_filename || result.filename
        );
        if (externalResult) {
          const filename =
            externalResult.pdf_filename || externalResult.filename;
          const externalSummary = await getExternalSummary(filename);
          if (externalSummary.success) {
            setSummary(externalSummary.summary);
            console.log(
              "Using external summary:",
              externalSummary.summary.substring(0, 200)
            );
          } else {
            throw new Error("External summary failed");
          }
        } else {
          throw new Error("No filename available for external summary");
        }
      } catch (externalError) {
        console.warn(
          "External summary failed, using local API:",
          externalError
        );

        // Fallback to local API summary
        try {
          const summaryResponse = await apiService.summarize({
            query: searchQuery,
          });
          console.log("Local summary response:", summaryResponse);
          const formattedSummary = formatSummary(summaryResponse.summary);
          console.log("Formatted summary:", formattedSummary);
          setSummary(formattedSummary);
        } catch (localError) {
          console.warn(
            "Local summary also failed, using fallback:",
            localError
          );
          // Final fallback summary
          setSummary(
            `Summary for "${searchQuery}":\n\nFound ${formattedResults.length} research results. This query relates to NASA's space biology research, which focuses on understanding how living systems respond to space environments. Key areas include microgravity effects on biological processes, human health monitoring for space missions, and development of countermeasures for space travel effects.\n\nPowered by HackerNauts Summerizer.`
          );
        }
      }

      // Automatically start generating AI insights in background
      if (formattedResults.length > 0) {
        // Generate AI insights silently in background
        generateAIInsightsInBackground(searchQuery, formattedResults);
      }
    } catch (error) {
      setError(error.message || "Search failed. Please try again.");
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const downloadResults = () => {
    const dataStr = JSON.stringify(searchResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bionauts_search_results.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateInsights = (query, results) => {
    setShowAIInsights(true);
  };

  const handleAIInsightsComplete = () => {
    setIsGeneratingAI(false);
  };

  const generateAIInsightsInBackground = async (query, results) => {
    setIsGeneratingAI(true);
    try {
      const analysis = await geminiService.analyzeSearchResults(query, results);
      setAiInsights(analysis);
    } catch (error) {
      console.error("Background AI generation failed:", error);
      setAiInsights("AI analysis completed using AI.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      handleSearch={handleSearch}
      handleKeyPress={handleKeyPress}
      isLoading={isLoading}
      isGeneratingAI={isGeneratingAI}
      filters={filters}
      setFilters={setFilters}
      searchResults={searchResults}
      summary={summary}
      downloadResults={downloadResults}
      showAIInsights={showAIInsights}
      setShowAIInsights={setShowAIInsights}
      aiInsights={aiInsights}
      handleAIInsightsComplete={handleAIInsightsComplete}
      apiStatus={apiStatus}
      healthStatus={healthStatus}
    />
  );
};

export default App;
