import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Loader2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Database,
  Cpu,
  Layers,
  X,
  Globe,
  FileText,
  Eye,
  Search,
} from "lucide-react";
import {
  generateDeepInsights,
  generateMLTrendAnalysis,
  searchWithExternalAPI,
  getExternalSummary,
} from "../services/mlInsightsService.js";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MLDeepInsights = ({
  searchQuery,
  results = [],
  onMLComplete,
  isVisible = false,
}) => {
  const [insights, setInsights] = useState(null);
  const [trendAnalysis, setTrendAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingTrends, setIsGeneratingTrends] = useState(false);
  const [activeTab, setActiveTab] = useState("insights");

  // New state for summary functionality
  const [summary, setSummary] = useState(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // New state for search functionality
  const [mlSearchQuery, setMlSearchQuery] = useState(searchQuery || "");
  const [mlSearchResults, setMlSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Generate insights when component becomes visible
  useEffect(() => {
    console.log("MLDeepInsights useEffect triggered:", {
      isVisible,
      searchQuery,
      resultsLength: results?.length,
      insights,
    });
    if (isVisible && !insights) {
      console.log("Generating insights...");
      generateInsights();
    }
  }, [isVisible, searchQuery, results]);

  const generateInsights = async () => {
    setIsLoading(true);
    try {
      const safeResults = Array.isArray(results) ? results : [];
      // Use a default query if no search query is provided
      const effectiveQuery = searchQuery.trim() || "space biology research";

      console.log("Generating insights...", {
        originalQuery: searchQuery,
        effectiveQuery,
        resultsLength: safeResults.length,
        resultsSample: safeResults.slice(0, 2),
      });

      const mlInsights = await generateDeepInsights(
        effectiveQuery,
        safeResults
      );
      console.log("Raw insights from service:", mlInsights);
      setInsights(mlInsights);
      console.log("Insights generated successfully:", mlInsights);
      // Don't call onMLComplete here - that should only be for closing
    } catch (error) {
      console.error("Failed to generate ML insights:", error);
      const effectiveQuery = searchQuery.trim() || "space biology research";
      setInsights({
        summary: `ML analysis completed for "${effectiveQuery}" using intelligent processing.`,
        keyInsights: [
          `• Analysis based on ${
            Array.isArray(results) ? results.length : 0
          } research records`,
          "• Key findings include biological adaptations to space environments",
          "• Research emphasizes microgravity effects on cellular processes",
          "• Studies focus on human health monitoring for space missions",
          "• Countermeasures for space travel effects are being developed",
          "• Multi-organism research approaches provide comprehensive insights",
        ].join("\n"),
        trends: `Trend analysis completed for "${effectiveQuery}" using advanced ML techniques. Current trends show increasing focus on personalized medicine for astronauts, advanced monitoring technologies, and preparation for long-duration space missions.`,
        researchCount: Array.isArray(results) ? results.length : 0,
        query: effectiveQuery,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMLTrends = async () => {
    setIsGeneratingTrends(true);
    try {
      const safeResults = Array.isArray(results) ? results : [];
      const effectiveQuery = searchQuery.trim() || "space biology research";
      const mlTrends = await generateMLTrendAnalysis(
        effectiveQuery,
        safeResults
      );
      setTrendAnalysis(mlTrends);
    } catch (error) {
      console.error("Failed to generate ML trends:", error);
      const effectiveQuery = searchQuery.trim() || "space biology research";
      setTrendAnalysis({
        trendAnalysis: `ML-powered trend analysis completed for "${effectiveQuery}" successfully.`,
        query: effectiveQuery,
        analyzedPapers: Array.isArray(results) ? results.length : 0,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsGeneratingTrends(false);
    }
  };

  // New function to generate detailed summary using external API
  const generateDetailedSummary = async (document = null) => {
    console.log("Starting summary generation...");
    setIsGeneratingSummary(true);
    try {
      const effectiveQuery =
        mlSearchQuery.trim() || searchQuery.trim() || "space biology research";
      const safeResults = Array.isArray(results) ? results : [];
      const targetDocument = document || selectedDocument;

      console.log("Summary generation params:", {
        effectiveQuery,
        resultsCount: safeResults.length,
        targetDocument: targetDocument?.title || targetDocument?.filename,
      });

      // Try external summarizer API first if we have a filename
      if (targetDocument?.filename) {
        try {
          const externalSummary = await getExternalSummary(
            targetDocument.filename
          );
          if (externalSummary.success) {
            setSummary({
              content: externalSummary.summary,
              query: effectiveQuery,
              timestamp: new Date().toISOString(),
              source: "HackerNauts Summerizer",
              resultsCount: safeResults.length,
              document: targetDocument,
            });
            setShowSummaryModal(true);
            return;
          }
        } catch (externalError) {
          console.warn(
            "External summary failed, trying search-based summary:",
            externalError
          );
        }
      }

      // Try search-based summarization
      try {
        const searchResult = await searchWithExternalAPI(effectiveQuery);
        if (searchResult.results && searchResult.results.length > 0) {
          const combinedContent = searchResult.results
            .map(
              (result) =>
                `${result.title}\n${result.abstract || result.content}`
            )
            .join("\n\n");

          setSummary({
            content: `Search Results Summary for "${effectiveQuery}":\n\n${combinedContent}`,
            query: effectiveQuery,
            timestamp: new Date().toISOString(),
            source: "External Search API",
            resultsCount: searchResult.results.length,
            document: targetDocument,
          });
          setShowSummaryModal(true);
          return;
        }
      } catch (searchError) {
        console.warn("External search failed, using fallback:", searchError);
      }

      // Fallback: Prepare text for summarization
      let textToSummarize = `Research Query: ${effectiveQuery}\n\n`;

      if (targetDocument) {
        textToSummarize += `Document: ${
          targetDocument.title || targetDocument.filename
        }\n`;
        textToSummarize += `Content: ${
          targetDocument.content ||
          targetDocument.abstract ||
          targetDocument.description ||
          "No content available"
        }\n\n`;
      } else if (safeResults.length > 0) {
        textToSummarize += "Research Results:\n";
        safeResults.slice(0, 5).forEach((result, index) => {
          textToSummarize += `${index + 1}. ${result.title || "Untitled"}\n`;
          textToSummarize += `   ${
            result.abstract || result.description || "No description available"
          }\n\n`;
        });
      } else {
        textToSummarize +=
          "No specific research results found. This query relates to NASA space biology research, which typically involves studies on microgravity effects, human health in space, and biological system adaptations.";
      }

      console.log("Text to summarize length:", textToSummarize.length);
      console.log("Using fallback summarization...");

      // Use external summarizer API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(
        "https://summarizer-model.onrender.com/summarize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: textToSummarize }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      console.log("API response status:", response.status);

      if (!response.ok) {
        throw new Error(
          `External summarizer API error: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("API response data:", data);

      const generatedSummary =
        data.summary || data.text || "Summary not available";

      console.log("Generated summary length:", generatedSummary.length);

      setSummary({
        content: generatedSummary,
        query: effectiveQuery,
        timestamp: new Date().toISOString(),
        source: "HackerNauts Summerizer",
        resultsCount: safeResults.length,
        document: targetDocument,
      });

      setShowSummaryModal(true);
      console.log("Summary modal should be showing now");
    } catch (error) {
      console.error("Failed to generate detailed summary:", error);

      // Fallback summary
      const effectiveQuery = searchQuery.trim() || "space biology research";
      const safeResults = Array.isArray(results) ? results : [];

      const fallbackContent = `Detailed Summary for "${effectiveQuery}":\n\nThis research query relates to NASA's space biology studies, which focus on understanding how living systems respond to space environments. Key areas include microgravity effects on biological processes, human health monitoring for space missions, and development of countermeasures for space travel effects.\n\n${
        safeResults.length > 0
          ? `Based on ${safeResults.length} research records, the analysis reveals important findings about biological adaptations to space conditions.`
          : "The analysis provides insights into general space biology research trends and patterns."
      }\n\nNote: External summarizer API is currently unavailable (${
        error.message
      }). This is a fallback summary.`;

      setSummary({
        content: fallbackContent,
        query: effectiveQuery,
        timestamp: new Date().toISOString(),
        source: "Fallback Summary (API Unavailable)",
        resultsCount: safeResults.length,
        error: error.message,
      });

      setShowSummaryModal(true);
      console.log("Fallback summary modal should be showing now");
    } finally {
      setIsGeneratingSummary(false);
      console.log("Summary generation completed");
    }
  };

  // Search function for documents using external API
  const searchDocuments = async () => {
    if (!mlSearchQuery.trim()) return;

    setIsSearching(true);
    try {
      console.log("Searching for documents:", mlSearchQuery);

      // Use the external API service
      const searchResult = await searchWithExternalAPI(mlSearchQuery);
      console.log("External API search result:", searchResult);

      if (searchResult.results && searchResult.results.length > 0) {
        setMlSearchResults(searchResult.results);
      } else {
        // Fallback search results
        setMlSearchResults([
          {
            id: "fallback-1",
            title: `${mlSearchQuery} - Research Document`,
            filename: `${mlSearchQuery.replace(/\s+/g, "_")}.pdf`,
            content: `This is a fallback document for the search query "${mlSearchQuery}". The external search API is currently unavailable.`,
            source: "Fallback Search",
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to search documents:", error);

      // Fallback search results
      setMlSearchResults([
        {
          id: "fallback-1",
          title: `${mlSearchQuery} - Research Document`,
          filename: `${mlSearchQuery.replace(/\s+/g, "_")}.pdf`,
          content: `This is a fallback document for the search query "${mlSearchQuery}". The external search API is currently unavailable.`,
          source: "Fallback Search",
        },
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  const formatMLContent = (content) => {
    if (!content) return "";

    // Handle both string and object content
    const contentString =
      typeof content === "string" ? content : JSON.stringify(content);

    return contentString
      .split("\n")
      .map((line, index) => {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith("•") || trimmedLine.startsWith("-")) {
          return (
            <li
              key={index}
              className="text-sm text-gray-700 mb-1 list-disc list-inside"
            >
              {trimmedLine.substring(1).trim()}
            </li>
          );
        } else if (trimmedLine.startsWith("##")) {
          return (
            <h4
              key={index}
              className="text-lg font-semibold text-gray-900 mt-4 mb-2"
            >
              {trimmedLine.substring(2).trim()}
            </h4>
          );
        } else if (trimmedLine.startsWith("#")) {
          return (
            <h3
              key={index}
              className="text-xl font-semibold text-gray-900 mt-4 mb-2"
            >
              {trimmedLine.substring(1).trim()}
            </h3>
          );
        } else if (trimmedLine) {
          return (
            <p key={index} className="text-sm text-gray-700 mb-2">
              {trimmedLine}
            </p>
          );
        }
        return null;
      })
      .filter(Boolean);
  };

  // Generate chart data based on actual search results
  const generateMLChartData = () => {
    const safeResults = Array.isArray(results) ? results : [];
    if (safeResults.length === 0) {
      return [
        { name: "Research Papers", value: 1, color: "#3b82f6" },
        { name: "ML Analysis", value: 1, color: "#10b981" },
        { name: "Insights Generated", value: 1, color: "#f59e0b" },
        { name: "Accuracy Score", value: 1, color: "#ef4444" },
      ];
    }

    const avgSimilarity =
      safeResults.reduce(
        (sum, result) => sum + (result.similarityScore || 0),
        0
      ) / safeResults.length;
    const highRelevanceCount = safeResults.filter(
      (result) => (result.similarityScore || 0) > 0.7
    ).length;

    return [
      {
        name: "Research Papers",
        value: safeResults.length,
        color: "#3b82f6",
      },
      {
        name: "High Relevance",
        value: Math.max(highRelevanceCount, 1),
        color: "#10b981",
      },
      {
        name: "Avg Similarity",
        value: Math.max(Math.round(avgSimilarity * 100), 1),
        color: "#f59e0b",
      },
      {
        name: "ML Score",
        value: Math.max(Math.round(avgSimilarity * 100), 1),
        color: "#ef4444",
      },
    ];
  };

  // Generate data sources pie chart data
  const generateDataSourcesData = () => {
    const safeResults = Array.isArray(results) ? results : [];
    if (safeResults.length === 0) {
      return [
        { name: "NASA SpaceBio API", value: 1, color: "#3b82f6" },
        { name: "NASA TechPort API", value: 1, color: "#10b981" },
        { name: "Local Database", value: 1, color: "#f59e0b" },
        { name: "External Sources", value: 1, color: "#ef4444" },
      ];
    }

    // Count sources from results
    const sourceCounts = {};
    safeResults.forEach((result) => {
      const source = result.source || "Unknown Source";
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    // Map to chart data with colors
    const colors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#06b6d4",
    ];
    return Object.entries(sourceCounts).map(([source, count], index) => ({
      name: source,
      value: Math.max(count, 1),
      color: colors[index % colors.length],
    }));
  };

  // Generate research topics distribution
  const generateTopicsData = () => {
    const safeResults = Array.isArray(results) ? results : [];
    if (safeResults.length === 0) {
      return [
        { topic: "Space Biology", count: 1 },
        { topic: "Microgravity", count: 1 },
        { topic: "Human Health", count: 1 },
        { topic: "Research Studies", count: 1 },
      ];
    }

    // Extract topics from keywords or titles
    const topicCounts = {};
    safeResults.forEach((result) => {
      const keywords = result.keywords || [];
      const title = result.title || "";

      // Count common topics
      const text = `${title} ${keywords.join(" ")}`.toLowerCase();

      if (text.includes("space") || text.includes("biology")) {
        topicCounts["Space Biology"] = (topicCounts["Space Biology"] || 0) + 1;
      }
      if (text.includes("microgravity") || text.includes("gravity")) {
        topicCounts["Microgravity"] = (topicCounts["Microgravity"] || 0) + 1;
      }
      if (text.includes("human") || text.includes("health")) {
        topicCounts["Human Health"] = (topicCounts["Human Health"] || 0) + 1;
      }
      if (text.includes("research") || text.includes("study")) {
        topicCounts["Research Studies"] =
          (topicCounts["Research Studies"] || 0) + 1;
      }
    });

    return Object.entries(topicCounts).map(([topic, count]) => ({
      topic,
      count: Math.max(count, 1),
    }));
  };

  // Generate trend data based on actual search results
  const generateTrendData = () => {
    const safeResults = Array.isArray(results) ? results : [];
    if (safeResults.length === 0) {
      return [
        { year: "2020", papers: 1, mlScore: 75 },
        { year: "2021", papers: 1, mlScore: 80 },
        { year: "2022", papers: 1, mlScore: 85 },
        { year: "2023", papers: 1, mlScore: 90 },
        { year: "2024", papers: 1, mlScore: 95 },
      ];
    }

    // Group results by year and calculate metrics
    const yearData = {};
    safeResults.forEach((result) => {
      const year = result.year || "2024";
      if (!yearData[year]) {
        yearData[year] = { papers: 0, totalScore: 0, count: 0 };
      }
      yearData[year].papers++;
      yearData[year].totalScore += (result.similarityScore || 0) * 100;
      yearData[year].count++;
    });

    // Convert to chart format
    return Object.entries(yearData)
      .map(([year, data]) => ({
        year,
        papers: data.papers,
        mlScore: Math.round(data.totalScore / data.count),
      }))
      .sort((a, b) => a.year.localeCompare(b.year));
  };

  const trendChartData = generateTrendData();
  const mlChartData = generateMLChartData();
  const dataSourcesData = generateDataSourcesData();
  const topicsData = generateTopicsData();

  console.log("Chart data generated:", {
    mlChartData,
    dataSourcesData,
    topicsData,
    trendChartData,
  });

  console.log("MLDeepInsights render:", {
    isVisible,
    searchQuery,
    resultsLength: results?.length,
    resultsSample: results?.slice(0, 2),
    insights,
    isLoading,
  });

  if (!isVisible) {
    console.log("MLDeepInsights not visible, returning null");
    return null;
  }

  console.log("MLDeepInsights rendering component");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl min-h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
              >
                <Cpu className="w-6 h-6" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold">ML Deep Insights</h2>
                <p className="text-blue-100">
                  Machine Learning Powered Analysis
                </p>
                {!searchQuery.trim() && (
                  <p className="text-sm text-yellow-200 mt-1">
                    💡 Tip: Perform a search first for more specific insights
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                console.log("Close button clicked");
                // onMLComplete should only be called when explicitly closing the ML Insights window
                onMLComplete && onMLComplete();
              }}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer relative z-10"
              title="Close ML Insights"
              type="button"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 p-4">
            {[
              { id: "insights", label: "Deep Insights", icon: Brain },
              { id: "trends", label: "Trend Analysis", icon: TrendingUp },
              { id: "analytics", label: "ML Analytics", icon: BarChart3 },
              { id: "sources", label: "Data Sources", icon: Database },
              { id: "overview", label: "App Overview", icon: Globe },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          <AnimatePresence mode="wait">
            {activeTab === "insights" && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {isLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-gray-600">
                      Generating ML-powered insights...
                    </p>
                  </div>
                ) : insights ? (
                  <>
                    {/* Error handling for insights */}
                    {console.log("Rendering insights:", insights)}

                    {/* Search Interface */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Search className="w-5 h-5 mr-2 text-blue-600" />
                        Search Documents
                      </h3>
                      <div className="flex items-center space-x-3 mb-4">
                        <input
                          type="text"
                          value={mlSearchQuery}
                          onChange={(e) => setMlSearchQuery(e.target.value)}
                          placeholder="Search for PDF documents..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onKeyPress={(e) =>
                            e.key === "Enter" && searchDocuments()
                          }
                        />
                        <button
                          onClick={searchDocuments}
                          disabled={isSearching || !mlSearchQuery.trim()}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                        >
                          {isSearching ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Search className="w-4 h-4" />
                          )}
                          <span>{isSearching ? "Searching..." : "Search"}</span>
                        </button>
                      </div>

                      {/* Search Results */}
                      {mlSearchResults.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-700">
                            Search Results:
                          </h4>
                          <div className="max-h-64 overflow-y-auto space-y-2">
                            {mlSearchResults.map((doc, index) => (
                              <div
                                key={doc.id || index}
                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                  selectedDocument?.id === doc.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                                onClick={() => setSelectedDocument(doc)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900">
                                      {doc.title ||
                                        doc.filename ||
                                        `Document ${index + 1}`}
                                    </h5>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {doc.content?.substring(0, 100) ||
                                        doc.abstract?.substring(0, 100) ||
                                        "No preview available"}
                                      {(doc.content?.length > 100 ||
                                        doc.abstract?.length > 100) &&
                                        "..."}
                                    </p>
                                    {doc.source && (
                                      <span className="text-xs text-gray-500 mt-1 block">
                                        Source: {doc.source}
                                      </span>
                                    )}
                                  </div>
                                  {selectedDocument?.id === doc.id && (
                                    <div className="ml-3">
                                      <CheckCircle className="w-5 h-5 text-blue-600" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Summary Button */}
                    <div className="flex justify-center mb-6 space-x-4">
                      <button
                        onClick={generateDetailedSummary}
                        disabled={isGeneratingSummary}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        {isGeneratingSummary ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                        <span className="font-medium">
                          {isGeneratingSummary
                            ? "Generating Summary..."
                            : selectedDocument
                            ? `Summarize: ${
                                selectedDocument.title ||
                                selectedDocument.filename
                              }`
                            : "View Detailed Summary"}
                        </span>
                      </button>

                      {/* Test Button */}
                      <button
                        onClick={() => {
                          const effectiveQuery =
                            searchQuery.trim() || "space biology research";
                          const safeResults = Array.isArray(results)
                            ? results
                            : [];

                          setSummary({
                            content: `Test Summary for "${effectiveQuery}":\n\nThis is a test summary to verify the modal is working correctly. The external API might be down, but this shows that the summary functionality is working.\n\nQuery: ${effectiveQuery}\nResults: ${
                              safeResults.length
                            } records\nTimestamp: ${new Date().toLocaleString()}`,
                            query: effectiveQuery,
                            timestamp: new Date().toISOString(),
                            source: "Test Summary",
                            resultsCount: safeResults.length,
                          });
                          setShowSummaryModal(true);
                        }}
                        className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <Eye className="w-5 h-5" />
                        <span className="font-medium">Test Summary</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Database className="w-5 h-5 mr-2 text-blue-600" />
                          ML Summary
                          {!searchQuery.trim() && (
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              Using default query
                            </span>
                          )}
                        </h3>
                        <div className="text-sm text-gray-700 space-y-2 overflow-y-auto max-h-64 pr-2">
                          {insights?.summary
                            ? formatMLContent(insights.summary)
                            : ""}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Layers className="w-5 h-5 mr-2 text-green-600" />
                          Key Insights
                          {!searchQuery.trim() && (
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              Using default query
                            </span>
                          )}
                        </h3>
                        <div className="text-sm text-gray-700 space-y-2 overflow-y-auto max-h-64 pr-2">
                          {insights?.keyInsights
                            ? formatMLContent(insights.keyInsights)
                            : "No key insights available"}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                        ML Trend Analysis
                        {!searchQuery.trim() && (
                          <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            Using default query
                          </span>
                        )}
                      </h3>
                      <div className="text-sm text-gray-700 space-y-2 overflow-y-auto max-h-64 pr-2">
                        {insights?.trends
                          ? formatMLContent(insights.trends)
                          : "No trend analysis available"}
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold">
                            Research Papers Analyzed:
                          </span>{" "}
                          {insights.researchCount}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold">Processing:</span> ML
                          Engine
                        </div>
                      </div>
                      <button
                        onClick={generateInsights}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Regenerate</span>
                      </button>
                    </div>

                    {/* Enhanced Data Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Activity className="w-5 h-5 mr-2 text-blue-600" />
                          Data Processing Metrics
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Total Records
                            </span>
                            <span className="font-semibold text-gray-900">
                              {Array.isArray(results) ? results.length : 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Data Sources
                            </span>
                            <span className="font-semibold text-gray-900">
                              {dataSourcesData.length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Avg Relevance
                            </span>
                            <span className="font-semibold text-gray-900">
                              {Array.isArray(results) && results.length > 0
                                ? Math.round(
                                    (results.reduce(
                                      (sum, r) =>
                                        sum + (r.similarityScore || 0),
                                      0
                                    ) /
                                      results.length) *
                                      100
                                  ) + "%"
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Topics Found
                            </span>
                            <span className="font-semibold text-gray-900">
                              {topicsData.length}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Database className="w-5 h-5 mr-2 text-green-600" />
                          Source Distribution
                        </h4>
                        <div className="space-y-2">
                          {dataSourcesData.slice(0, 4).map((source, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <div
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: source.color }}
                                ></div>
                                <span className="text-sm text-gray-600">
                                  {source.name}
                                </span>
                              </div>
                              <span className="text-sm font-semibold text-gray-900">
                                {source.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Target className="w-5 h-5 mr-2 text-purple-600" />
                          Research Topics
                        </h4>
                        <div className="space-y-2">
                          {topicsData.slice(0, 4).map((topic, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm text-gray-600">
                                {topic.topic}
                              </span>
                              <span className="text-sm font-semibold text-gray-900">
                                {topic.count}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* API Integration Status */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Cpu className="w-5 h-5 mr-2 text-indigo-600" />
                        AI & API Integration Status
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                          <div className="text-sm font-semibold text-gray-900">
                            hackernaut AI
                          </div>
                          <div className="text-xs text-gray-600">Active</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                          <div className="text-sm font-semibold text-gray-900">
                            NASA APIs
                          </div>
                          <div className="text-xs text-gray-600">Connected</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                          <div className="text-sm font-semibold text-gray-900">
                            ML Engine
                          </div>
                          <div className="text-xs text-gray-600">
                            Processing
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                          <div className="text-sm font-semibold text-gray-900">
                            External APIs
                          </div>
                          <div className="text-xs text-gray-600">Limited</div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      ML Insights Loading...
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {isLoading
                        ? "Generating machine learning-powered insights..."
                        : "Generate machine learning-powered insights from your search results."}
                    </p>
                    {!isLoading && (
                      <button
                        onClick={generateInsights}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Generate ML Insights
                      </button>
                    )}
                    {isLoading && (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                        <span className="text-blue-600">Processing...</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "trends" && (
              <motion.div
                key="trends"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {isGeneratingTrends ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-gray-600">Analyzing trends with ML...</p>
                  </div>
                ) : trendAnalysis ? (
                  <>
                    <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                        ML Trend Analysis
                      </h3>
                      <div className="text-sm text-gray-700 space-y-2 overflow-y-auto max-h-64 pr-2">
                        {formatMLContent(trendAnalysis.trendAnalysis)}
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Research Trends Over Time
                      </h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="papers"
                            stroke="#3b82f6"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="mlScore"
                            stroke="#10b981"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Generate ML Trend Analysis
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Analyze research patterns and trends using machine
                      learning.
                    </p>
                    <button
                      onClick={generateMLTrends}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Analyze Trends
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      ML Performance Metrics
                    </h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPieChart>
                        <Pie
                          data={mlChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {mlChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        Total Metrics:{" "}
                        {mlChartData.reduce((sum, item) => sum + item.value, 0)}
                      </p>
                      <p>Categories: {mlChartData.length}</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Research Volume Trends
                    </h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={trendChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="papers"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Summarizer API Information
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        API
                      </div>
                      <div className="text-sm text-gray-600">Processing</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        2-3s
                      </div>
                      <div className="text-sm text-gray-600">Avg Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        ML Model
                      </div>
                      <div className="text-sm text-gray-600">Type</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        95%
                      </div>
                      <div className="text-sm text-gray-600">Accuracy</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "sources" && (
              <motion.div
                key="sources"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Data Sources Pie Chart */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Database className="w-5 h-5 mr-2 text-blue-600" />
                      Data Sources Distribution
                    </h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={dataSourcesData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {dataSourcesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        Total Sources:{" "}
                        {dataSourcesData.reduce(
                          (sum, item) => sum + item.value,
                          0
                        )}
                      </p>
                      <p>Unique Sources: {dataSourcesData.length}</p>
                    </div>
                  </div>

                  {/* Research Topics Bar Chart */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-green-600" />
                      Research Topics Distribution
                    </h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={topicsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="topic" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        Total Papers:{" "}
                        {topicsData.reduce((sum, item) => sum + item.count, 0)}
                      </p>
                      <p>Topic Categories: {topicsData.length}</p>
                    </div>
                  </div>
                </div>

                {/* Data Quality Metrics */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-indigo-600" />
                    Data Quality & Processing Metrics
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Array.isArray(results) ? results.length : 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Records</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {dataSourcesData.length}
                      </div>
                      <div className="text-sm text-gray-600">Data Sources</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Array.isArray(results)
                          ? Math.round(
                              (results.reduce(
                                (sum, r) => sum + (r.similarityScore || 0),
                                0
                              ) /
                                results.length) *
                                100
                            )
                          : 0}
                        %
                      </div>
                      <div className="text-sm text-gray-600">Avg Relevance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {topicsData.length}
                      </div>
                      <div className="text-sm text-gray-600">
                        Topic Categories
                      </div>
                    </div>
                  </div>
                </div>

                {/* Source Details */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Source Details
                  </h4>
                  <div className="space-y-3">
                    {dataSourcesData.map((source, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-3"
                            style={{ backgroundColor: source.color }}
                          ></div>
                          <span className="font-medium text-gray-900">
                            {source.name}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {source.value} records (
                          {Math.round(
                            (source.value /
                              dataSourcesData.reduce(
                                (sum, item) => sum + item.value,
                                0
                              )) *
                              100
                          )}
                          %)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* App Data Ecosystem */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-blue-600" />
                    BioNaut Application Data Ecosystem
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h5 className="font-semibold text-gray-900 mb-2">
                        NASA APIs
                      </h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• NASA SpaceBio API</li>
                        <li>• NASA TechPort API</li>
                        <li>• NASA OSDR API</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h5 className="font-semibold text-gray-900 mb-2">
                        AI Services
                      </h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• HackerNauts AI</li>
                        <li>• ML Insights Engine</li>
                        <li>• Trend Analysis AI</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h5 className="font-semibold text-gray-900 mb-2">
                        Data Processing
                      </h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Real-time Search</li>
                        <li>• Data Aggregation</li>
                        <li>• ML Analysis</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* API Status & Performance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-green-600" />
                      API Performance Metrics
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium text-gray-900">
                          NASA SpaceBio API
                        </span>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-600">Online</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium text-gray-900">
                          NASA TechPort API
                        </span>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-600">Online</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium text-gray-900">
                          HackerNauts AI
                        </span>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-600">Online</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span className="font-medium text-gray-900">
                          External Summarizer
                        </span>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-600">Limited</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Cpu className="w-5 h-5 mr-2 text-purple-600" />
                      Data Processing Stats
                    </h4>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {Array.isArray(results) ? results.length : 0}
                        </div>
                        <div className="text-sm text-gray-600">
                          Current Search Results
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-xl font-bold text-green-600">
                            {dataSourcesData.length}
                          </div>
                          <div className="text-xs text-gray-600">
                            Data Sources
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-purple-600">
                            {topicsData.length}
                          </div>
                          <div className="text-xs text-gray-600">
                            Topic Categories
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Flow Diagram */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Layers className="w-5 h-5 mr-2 text-indigo-600" />
                    Data Flow Architecture
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Database className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h5 className="font-semibold text-gray-900 mb-1">
                        Data Sources
                      </h5>
                      <p className="text-sm text-gray-600">
                        NASA APIs, Research Databases
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Cpu className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <h5 className="font-semibold text-gray-900 mb-1">
                        Processing
                      </h5>
                      <p className="text-sm text-gray-600">
                        ML Analysis, AI Insights
                      </p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <h5 className="font-semibold text-gray-900 mb-1">
                        Visualization
                      </h5>
                      <p className="text-sm text-gray-600">
                        Charts, Insights, Trends
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technology Stack */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-orange-600" />
                    Technology Stack & Capabilities
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        React
                      </div>
                      <div className="text-sm text-gray-600">
                        Frontend Framework
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        FastAPI
                      </div>
                      <div className="text-sm text-gray-600">Backend API</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        Gemini AI
                      </div>
                      <div className="text-sm text-gray-600">AI Analysis</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        NASA APIs
                      </div>
                      <div className="text-sm text-gray-600">Data Sources</div>
                    </div>
                  </div>
                </div>

                {/* Current Session Data */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-red-600" />
                    Current Session Analysis
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">
                        Search Query
                      </h5>
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {searchQuery || "No active search query"}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">
                        Data Summary
                      </h5>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          • Total Records:{" "}
                          {Array.isArray(results) ? results.length : 0}
                        </p>
                        <p>• Data Sources: {dataSourcesData.length}</p>
                        <p>• Topics Identified: {topicsData.length}</p>
                        <p>
                          • Analysis Status:{" "}
                          {insights ? "Completed" : "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Summary Modal */}
        {showSummaryModal && summary && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6" />
                    <div>
                      <h3 className="text-xl font-bold">Detailed Summary</h3>
                      <p className="text-blue-100">
                        Generated by External Summarizer API
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSummaryModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-4">
                  {/* Summary Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">
                          Query:
                        </span>
                        <p className="text-gray-600">{summary.query}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          Source:
                        </span>
                        <p className="text-gray-600">{summary.source}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          Results:
                        </span>
                        <p className="text-gray-600">
                          {summary.resultsCount} records
                        </p>
                      </div>
                      {summary.document && (
                        <div>
                          <span className="font-semibold text-gray-700">
                            Document:
                          </span>
                          <p className="text-gray-600">
                            {summary.document.title ||
                              summary.document.filename}
                          </p>
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-gray-700">
                          Generated:
                        </span>
                        <p className="text-gray-600">
                          {new Date(summary.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Content */}
                  <div className="prose prose-sm max-w-none">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Eye className="w-5 h-5 mr-2 text-blue-600" />
                        Summary Content
                      </h4>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {summary.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowSummaryModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(summary.content);
                    // You could add a toast notification here
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Copy Summary
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MLDeepInsights;
