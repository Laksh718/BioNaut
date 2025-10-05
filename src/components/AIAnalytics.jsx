import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Zap, TrendingUp, Target } from "lucide-react";
import { geminiService } from "../services/geminiService.js";

const AIAnalytics = ({ searchResults, searchQuery }) => {
  const [aiAnalytics, setAiAnalytics] = useState(null);
  const [isGeneratingAnalytics, setIsGeneratingAnalytics] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleGenerateAnalytics = async () => {
    if (!searchResults.length || !searchQuery) return;

    setIsGeneratingAnalytics(true);
    setShowAnalytics(true);

    try {
      const analytics = await geminiService.analyzeSearchResults(
        searchQuery,
        searchResults
      );
      setAiAnalytics(analytics);
    } catch (error) {
      console.error("AI analytics generation failed:", error);
      setAiAnalytics("AI analytics generation failed. Please try again.");
    } finally {
      setIsGeneratingAnalytics(false);
    }
  };

  const formatAnalyticsContent = (content) => {
    if (!content) return "";
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

  if (!searchResults.length) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Brain className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              AI Analytics
            </h3>
            <p className="text-sm text-gray-600">Powered by Google Gemini</p>
          </div>
        </div>
        <button
          onClick={handleGenerateAnalytics}
          disabled={isGeneratingAnalytics}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
        >
          {isGeneratingAnalytics ? (
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
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              <span>Generate Analytics</span>
            </>
          )}
        </button>
      </div>

      {showAnalytics && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4"
        >
          {isGeneratingAnalytics ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
                />
                <p className="text-gray-600">
                  AI is analyzing your search results...
                </p>
              </div>
            </div>
          ) : aiAnalytics ? (
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className="text-lg font-semibold text-gray-900">
                  Analysis Results
                </h4>
              </div>
              <div className="prose max-w-none">
                {formatAnalyticsContent(aiAnalytics)}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>
                Click "Generate Analytics" to get AI-powered insights about your
                search results.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AIAnalytics;
