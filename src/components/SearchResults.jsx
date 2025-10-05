import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  ExternalLink,
  Calendar,
  User,
  FileText,
  FileSearch,
} from "lucide-react";
import { getExternalSummary } from "../services/api.js";

const SearchResults = ({
  searchResults,
  isGeneratingAI,
  downloadResults,
  searchQuery,
}) => {
  const [generatingSummaries, setGeneratingSummaries] = useState({});
  const [summaries, setSummaries] = useState({});

  const handleGenerateSummary = async (result) => {
    const filename = result.pdf_filename || result.filename;
    if (!filename) return;

    setGeneratingSummaries((prev) => ({ ...prev, [result.id]: true }));

    try {
      const summaryData = await getExternalSummary(filename);
      if (summaryData.success) {
        setSummaries((prev) => ({ ...prev, [result.id]: summaryData.summary }));
      } else {
        setSummaries((prev) => ({
          ...prev,
          [result.id]: "Summary not available",
        }));
      }
    } catch (error) {
      console.error("Summary generation failed:", error);
      setSummaries((prev) => ({
        ...prev,
        [result.id]: "Failed to generate summary",
      }));
    } finally {
      setGeneratingSummaries((prev) => ({ ...prev, [result.id]: false }));
    }
  };
  if (searchResults.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Results Found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search query or filters to find relevant research.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Results Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Search Results
            </h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {searchResults.length} found
            </span>
            {isGeneratingAI && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 text-sm text-blue-600"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full"
                />
                <span>AI analyzing...</span>
              </motion.div>
            )}
          </div>
          <motion.button
            onClick={downloadResults}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="h-4 w-4" />
            <span>Download JSON</span>
          </motion.button>
        </div>
      </div>

      {/* Results List */}
      <div className="divide-y divide-gray-200">
        <AnimatePresence>
          {searchResults.map((result, index) => (
            <motion.div
              key={result.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {result.title}
                  </h3>

                  {/* Abstract/Summary */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {result.abstract ||
                      result.summary ||
                      "No abstract available"}
                  </p>

                  {/* Essential Details */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    {result.source && (
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{result.source}</span>
                        {result.source === "HackerNauts API" && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            HackerNauts API
                          </span>
                        )}
                      </div>
                    )}
                    {result.relevance_score && (
                      <div className="flex items-center space-x-1">
                        <span className="text-blue-600 font-medium">
                          Score: {(result.relevance_score * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                    {result.year && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{result.year}</span>
                      </div>
                    )}
                    {result.authors && (
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span className="line-clamp-1">
                          {Array.isArray(result.authors)
                            ? result.authors.slice(0, 2).join(", ") +
                              (result.authors.length > 2 ? " et al." : "")
                            : result.authors}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Links and Actions */}
                  <div className="flex items-center space-x-4 mt-3">
                    {result.link && (
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Study
                      </a>
                    )}
                    {(result.pdf_filename || result.filename) && (
                      <button
                        onClick={() => handleGenerateSummary(result)}
                        disabled={generatingSummaries[result.id]}
                        className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        {generatingSummaries[result.id] ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"
                            />
                            Generating...
                          </>
                        ) : (
                          <>
                            <FileSearch className="h-4 w-4 mr-1" />
                            Generate Summary
                          </>
                        )}
                      </button>
                    )}
                    {result.doi && (
                      <a
                        href={`https://doi.org/${result.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        DOI: {result.doi}
                      </a>
                    )}
                    {!result.link &&
                      !result.doi &&
                      !result.pdf_filename &&
                      !result.filename && (
                        <span className="text-sm text-gray-400 italic">
                          No links available
                        </span>
                      )}
                  </div>

                  {/* Summary Display */}
                  {summaries[result.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-4 bg-gray-50 rounded-lg border"
                    >
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        HackerNauts Summary:
                      </h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {summaries[result.id]}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Similarity Score */}
                {(result.similarityScore || result.score) && (
                  <div className="ml-4 flex items-center">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      {Math.round(
                        (result.similarityScore || result.score) * 100
                      )}
                      % match
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SearchResults;
