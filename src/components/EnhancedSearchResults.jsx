import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Star,
  Calendar,
  User,
  FileText,
  Brain,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import FeedbackModal from "./FeedbackModal";

const SearchResults = ({ results, searchQuery, onGenerateInsights }) => {
  const [selectedResult, setSelectedResult] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [expandedResults, setExpandedResults] = useState({});

  const handleFeedback = (result) => {
    setSelectedResult(result);
    setShowFeedbackModal(true);
  };

  const toggleExpanded = (resultId) => {
    setExpandedResults((prev) => ({
      ...prev,
      [resultId]: !prev[resultId],
    }));
  };

  const formatSimilarityScore = (score) => {
    return (score * 100).toFixed(1);
  };

  const getScoreColor = (score) => {
    if (score >= 0.7) return "text-green-600";
    if (score >= 0.5) return "text-yellow-600";
    return "text-red-600";
  };

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* HackerNaut AI Insights Button */}
      <motion.div variants={itemVariants} className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onGenerateInsights(searchQuery, results)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Brain className="h-5 w-5" />
          <span>Generate HackerNaut AI Insights</span>
        </motion.button>
      </motion.div>

      {/* Search Results */}
      <AnimatePresence>
        {results.map((result, index) => (
          <motion.div
            key={result.id || index}
            variants={itemVariants}
            layout
            className="search-result group hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <motion.h3
                  className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-nasa-blue transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                >
                  {result.title}
                </motion.h3>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <motion.div
                    className="flex items-center space-x-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <FileText className="h-4 w-4" />
                    <span>{result.sourceType}</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center space-x-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>{result.year}</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center space-x-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <User className="h-4 w-4" />
                    <span>{result.authors}</span>
                  </motion.div>
                  <motion.div
                    className={`flex items-center space-x-1 ${getScoreColor(
                      result.similarityScore
                    )}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Star className="h-4 w-4" />
                    <span>
                      {formatSimilarityScore(result.similarityScore)}% match
                    </span>
                  </motion.div>
                </div>

                <motion.p
                  className="text-gray-700 mb-3 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {result.abstract}
                </motion.p>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Source:</span> {result.source}
                  </div>

                  <div className="flex items-center space-x-2">
                    {result.link && (
                      <motion.a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary flex items-center space-x-1 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>View Study</span>
                      </motion.a>
                    )}

                    {result.doi && (
                      <motion.a
                        href={`https://doi.org/${result.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary flex items-center space-x-1 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>DOI</span>
                      </motion.a>
                    )}

                    <motion.button
                      onClick={() => handleFeedback(result)}
                      className="btn-secondary flex items-center space-x-1 text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Star className="h-4 w-4" />
                      <span>Rate</span>
                    </motion.button>

                    <motion.button
                      onClick={() => toggleExpanded(result.id || index)}
                      className="btn-secondary flex items-center space-x-1 text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Lightbulb className="h-4 w-4" />
                      <span>
                        {expandedResults[result.id || index] ? "Less" : "More"}
                      </span>
                    </motion.button>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedResults[result.id || index] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="font-medium">Research Impact:</span>
                          <span className="text-nasa-blue">High</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Key Terms:</span>{" "}
                          microgravity, bone density, space biology
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Research Type:</span>{" "}
                          Experimental Study
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {showFeedbackModal && selectedResult && (
        <FeedbackModal
          result={selectedResult}
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
        />
      )}
    </motion.div>
  );
};

export default SearchResults;
