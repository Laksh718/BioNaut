import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Lightbulb,
  TrendingUp,
  Users,
  BookOpen,
  Calendar,
  Star,
  Brain,
  Zap,
} from "lucide-react";
import { apiService } from "../services/api.js";
import { geminiService } from "../services/geminiService.js";

const EnhancedRecommendations = () => {
  const [queryRecommendations, setQueryRecommendations] = useState([]);
  const [recordRecommendations, setRecordRecommendations] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("queries");

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load query-based recommendations using example queries
      const exampleQueries = [
        "microgravity effects on bone density",
        "plant growth experiments on ISS",
        "space radiation effects on DNA",
        "muscle atrophy in astronauts",
        "circadian rhythm disruption in space",
      ];

      const queryPromises = exampleQueries.map((query) =>
        apiService.recommendByQuery(query, 2).catch((err) => {
          console.warn(`Failed to get recommendations for "${query}":`, err);
          return { recommendations: [] };
        })
      );

      const queryResults = await Promise.all(queryPromises);
      const allQueryRecommendations = queryResults.flatMap(
        (result) => result.recommendations || []
      );
      setQueryRecommendations(allQueryRecommendations.slice(0, 8)); // Limit to 8 recommendations

      // Load record-based recommendations using example record IDs
      const exampleRecordIds = ["pub_463", "pub_56", "pub_41"];
      const recordPromises = exampleRecordIds.map((recordId) =>
        apiService.recommendByRecord(recordId, 2).catch((err) => {
          console.warn(
            `Failed to get recommendations for record "${recordId}":`,
            err
          );
          return { recommendations: [] };
        })
      );

      const recordResults = await Promise.all(recordPromises);
      const allRecordRecommendations = recordResults.flatMap(
        (result) => result.recommendations || []
      );
      setRecordRecommendations(allRecordRecommendations.slice(0, 6)); // Limit to 6 recommendations

      // Generate AI recommendations
      try {
        const aiRecs = await geminiService.generateRecommendations(
          "space biology research",
          "general space biology research"
        );
        setAiRecommendations(aiRecs);
      } catch (aiError) {
        console.warn("AI recommendations not available:", aiError.message);
        setAiRecommendations("AI recommendations generated using AI.");
      }
    } catch (error) {
      setError(error.message || "Failed to load recommendations");
      console.error("Recommendations error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "queries", label: "Query Suggestions", icon: Target },
    { id: "records", label: "Related Records", icon: BookOpen },
    { id: "ai", label: "AI Recommendations", icon: Brain },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card"
      >
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-8 w-8 border-b-2 border-nasa-blue"
          />
          <span className="ml-3 text-gray-600">Loading recommendations...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card"
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">{error}</div>
          <motion.button
            onClick={loadRecommendations}
            className="mt-3 btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retry
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Enhanced Recommendations
            </h2>
            <p className="text-sm text-gray-600">
              AI-powered suggestions for your research journey
            </p>
          </div>
          <motion.button
            onClick={loadRecommendations}
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="card">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium ${
                  activeTab === tab.id
                    ? "bg-white text-nasa-blue shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.id === "ai" && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Zap className="h-3 w-3 text-purple-500" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "queries" && (
          <motion.div
            key="queries"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-500" />
                <span>Suggested Research Queries</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {queryRecommendations.map((rec, index) => (
                  <motion.div
                    key={rec.record?.record_id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="h-5 w-5 text-yellow-500 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {rec.record?.title || "Research Study"}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {rec.record?.abstract ||
                            "Explore this research study for insights into space biology"}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {rec.record?.source_type || "Research Study"}
                          </span>
                          {rec.similarity_score && (
                            <span className="text-xs text-gray-500">
                              {(rec.similarity_score * 100).toFixed(1)}% match
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "records" && (
          <motion.div
            key="records"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-green-500" />
                <span>Related Research Records</span>
              </h3>
              <div className="space-y-3">
                {recordRecommendations.map((rec, index) => (
                  <motion.div
                    key={rec.record?.record_id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {rec.record?.title || "Research Record"}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {rec.record?.abstract ||
                            "Explore this research record for detailed insights"}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          {rec.record?.source && (
                            <span className="flex items-center space-x-1">
                              <BookOpen className="h-3 w-3" />
                              <span>{rec.record.source}</span>
                            </span>
                          )}
                          {rec.record?.year && (
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{rec.record.year}</span>
                            </span>
                          )}
                          {rec.record?.authors && (
                            <span className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{rec.record.authors}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      {rec.similarity_score && (
                        <div className="ml-4 text-right">
                          <div className="flex items-center space-x-1 text-sm text-green-600">
                            <Star className="h-4 w-4" />
                            <span>
                              {(rec.similarity_score * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "ai" && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-500" />
                <span>AI-Powered Recommendations</span>
              </h3>
              {aiRecommendations ? (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {aiRecommendations}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    AI Recommendations Not Available
                  </h4>
                  <p className="text-gray-600">
                    AI-powered recommendations are currently unavailable
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnhancedRecommendations;
