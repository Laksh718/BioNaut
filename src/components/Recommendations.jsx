import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  FileText,
  Star,
  Lightbulb,
  Target,
  TrendingUp,
  BookOpen,
  Zap,
} from "lucide-react";
import { apiService, formatRecommendationResults } from "../services/api.js";
import RecommendationResults from "./RecommendationResults";

const Recommendations = () => {
  const [recommendationType, setRecommendationType] = useState("query");
  const [query, setQuery] = useState("");
  const [recordId, setRecordId] = useState("");
  const [numRecommendations, setNumRecommendations] = useState(5);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const handleQueryRecommendations = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setUsingFallback(false);

    try {
      const response = await apiService.recommendByQuery(
        query,
        numRecommendations
      );

      // Check if using fallback data
      if (response.fallback) {
        setUsingFallback(true);
      }

      if (response.recommendations && response.recommendations.length > 0) {
        const formattedResults = formatRecommendationResults(
          response.recommendations
        );
        setRecommendations(formattedResults);
      } else {
        setRecommendations([]);
        setError(
          "No recommendations found for this query. Try a different research interest."
        );
      }
    } catch (error) {
      setError(
        error.message || "Failed to get recommendations. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordRecommendations = async () => {
    if (!recordId.trim()) return;

    setIsLoading(true);
    setError(null);
    setUsingFallback(false);

    try {
      const response = await apiService.recommendByRecord(
        recordId,
        numRecommendations
      );

      // Check if using fallback data
      if (response.fallback) {
        setUsingFallback(true);
      }

      if (response.recommendations && response.recommendations.length > 0) {
        const formattedResults = formatRecommendationResults(
          response.recommendations
        );
        setRecommendations(formattedResults);
      } else {
        setRecommendations([]);
        setError(
          "No related studies found for this record ID. Please check the ID and try again."
        );
      }
    } catch (error) {
      setError(
        error.message || "Failed to get related studies. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (recommendationType === "query") {
        handleQueryRecommendations();
      } else {
        handleRecordRecommendations();
      }
    }
  };

  const exampleInterests = [
    "microgravity effects on bone density",
    "plant growth experiments on ISS",
    "space radiation effects on DNA",
    "muscle atrophy in astronauts",
    "circadian rhythm disruption in space",
    "immune system changes in space",
    "CRISPR gene editing in space",
    "artificial gravity effects on biology",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Lightbulb className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              AI Recommendations
            </h2>
            <p className="text-gray-600">
              Get personalized research recommendations powered by AI
            </p>
          </div>
        </div>
      </motion.div>

      {/* Recommendation Type Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-600" />
          <span>Recommendation Type</span>
        </h3>
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <motion.button
            onClick={() => setRecommendationType("query")}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all ${
              recommendationType === "query"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Search className="h-4 w-4" />
            <span>By Research Interest</span>
          </motion.button>
          <motion.button
            onClick={() => setRecommendationType("record")}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all ${
              recommendationType === "record"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FileText className="h-4 w-4" />
            <span>By Study ID</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        {recommendationType === "query" ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Research Interest Recommendations</span>
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your research interest
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., 'microgravity effects on plant growth'"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Recommendations
                </label>
                <select
                  value={numRecommendations}
                  onChange={(e) =>
                    setNumRecommendations(parseInt(e.target.value))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={3}>3 recommendations</option>
                  <option value={5}>5 recommendations</option>
                  <option value={10}>10 recommendations</option>
                  <option value={15}>15 recommendations</option>
                  <option value={20}>20 recommendations</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Choose how many related studies you'd like to see
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Popular Research Interests:</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {exampleInterests.map((interest, index) => (
                    <motion.button
                      key={interest}
                      onClick={() => setQuery(interest)}
                      className="text-xs bg-white px-3 py-2 rounded-full border border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {interest}
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.button
                onClick={handleQueryRecommendations}
                disabled={isLoading || !query.trim()}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Getting Recommendations...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    <span>Get AI Recommendations</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <span>Study-Based Recommendations</span>
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Study Record ID
                </label>
                <input
                  type="text"
                  value={recordId}
                  onChange={(e) => setRecordId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., 'study_12345' or 'pub_67890'"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 You can find record IDs in search results
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Related Studies
                </label>
                <select
                  value={numRecommendations}
                  onChange={(e) =>
                    setNumRecommendations(parseInt(e.target.value))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={3}>3 related studies</option>
                  <option value={5}>5 related studies</option>
                  <option value={10}>10 related studies</option>
                  <option value={15}>15 related studies</option>
                  <option value={20}>20 related studies</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Choose how many related studies you'd like to discover
                </p>
              </div>

              <motion.button
                onClick={handleRecordRecommendations}
                disabled={isLoading || !recordId.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Finding Related Studies...</span>
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4" />
                    <span>Find Related Studies</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm">⚠️</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-1 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Fallback Mode Notice */}
      {usingFallback && recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm">ℹ️</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                Sample Recommendations
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                Showing curated research examples from NASA's space biology
                database.
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Current Settings Display */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900">
                Current Settings
              </h4>
              <p className="text-xs text-blue-700">
                {recommendationType === "query"
                  ? `Research Interest: "${query}" • ${numRecommendations} recommendations requested`
                  : `Study ID: "${recordId}" • ${numRecommendations} related studies requested`}
              </p>
            </div>
          </div>
        </motion.div>
      )}
      {recommendations.length > 0 && (
        <RecommendationResults
          recommendations={recommendations}
          downloadResults={() => {
            const dataStr = JSON.stringify(recommendations, null, 2);
            const dataBlob = new Blob([dataStr], {
              type: "application/json",
            });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "hackernauts_recommendations.json";
            link.click();
            URL.revokeObjectURL(url);
          }}
          searchQuery={recommendationType === "query" ? query : recordId}
        />
      )}

      {/* Empty State */}
      {recommendations.length === 0 && !isLoading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Star className="h-8 w-8 text-white" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready for Recommendations
            </h3>
            <p className="text-gray-600 mb-6">
              {recommendationType === "query"
                ? "Enter your research interest to get personalized AI recommendations"
                : "Enter a study record ID to find related research papers"}
            </p>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Search className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600">Research Interest</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-xs text-gray-600">Study ID</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Recommendations;
