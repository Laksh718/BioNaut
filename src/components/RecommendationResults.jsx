import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { geminiService } from "../services/geminiService.js";
import {
  ExternalLink,
  Calendar,
  User,
  Database,
  FileText,
  Download,
  Share2,
  Copy,
  BookOpen,
  Globe,
  Tag,
  Award,
  BarChart3,
  Building,
  Hash,
  Star,
  TrendingUp,
  Eye,
  Quote,
} from "lucide-react";

const RecommendationResults = ({
  recommendations,
  downloadResults,
  searchQuery,
}) => {
  const [copiedStates, setCopiedStates] = useState({});
  const [aiSummaries, setAiSummaries] = useState({});
  const [generatingSummaries, setGeneratingSummaries] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const shareResult = (result) => {
    if (navigator.share) {
      navigator.share({
        title: result.title,
        text: result.summary,
        url: result.link,
      });
    } else {
      copyToClipboard(result.link);
    }
  };

  // Generate AI summaries for recommendations
  const generateAISummaries = async () => {
    if (generatingSummaries || recommendations.length === 0) return;

    setGeneratingSummaries(true);
    try {
      const summaryPromises = recommendations.map(async (recommendation) => {
        try {
          const summary = await geminiService.generateRecommendationSummary(
            recommendation
          );
          return { id: recommendation.id, summary };
        } catch (error) {
          console.warn(
            `Failed to generate summary for ${recommendation.id}:`,
            error
          );
          return { id: recommendation.id, summary: recommendation.summary };
        }
      });

      const summaries = await Promise.all(summaryPromises);
      const summaryMap = {};
      summaries.forEach(({ id, summary }) => {
        if (summary) summaryMap[id] = summary;
      });

      setAiSummaries(summaryMap);
    } catch (error) {
      console.error("Error generating AI summaries:", error);
    } finally {
      setGeneratingSummaries(false);
    }
  };

  // Generate summaries when recommendations change
  useEffect(() => {
    if (recommendations.length > 0) {
      generateAISummaries();
    }
  }, [recommendations]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Results Header */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Recommended Studies
            </h3>
            <p className="text-sm text-gray-600">
              Found {recommendations.length} related research papers
            </p>
          </div>
        </div>
        <motion.button
          onClick={downloadResults}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="h-4 w-4" />
          <span>Download JSON</span>
        </motion.button>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            {/* Result Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                    {result.title}
                  </h4>
                  <div className="flex items-center space-x-2 ml-4">
                    <motion.div
                      className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-green-100 to-blue-100 rounded-full"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Star className="h-3 w-3 text-green-600" />
                      <span className="text-xs font-semibold text-green-700">
                        {(result.similarityScore * 100).toFixed(1)}%
                      </span>
                    </motion.div>
                  </div>
                </div>

                {/* Publication Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-blue-500" />
                    <span className="truncate">{result.publisher}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <span>{result.year}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-orange-500" />
                    <span>{result.publicationType}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-green-500" />
                    <span className="truncate">{result.source}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <motion.button
                  onClick={() => copyToClipboard(result.link)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Copy link"
                >
                  <Copy className="h-4 w-4" />
                </motion.button>
                <motion.button
                  onClick={() => shareResult(result)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Share"
                >
                  <Share2 className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            {/* Result Content */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Quote className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Summary
                </span>
                {generatingSummaries && (
                  <motion.div
                    className="flex items-center space-x-1 text-xs text-blue-600"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Generating AI summary...</span>
                  </motion.div>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                {aiSummaries[result.id] ? (
                  <div className="space-y-3">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-800">
                          AI-Generated Summary
                        </span>
                      </div>
                      <p className="text-sm text-blue-700 leading-relaxed">
                        {aiSummaries[result.id]}
                      </p>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-xs text-gray-500 mb-2">
                        Original Abstract:
                      </p>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {result.summary || ""}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {result.summary || ""}
                  </p>
                )}
              </div>
            </div>

            {/* Result Metadata */}
            <div className="space-y-3 mb-4">
              {/* Authors */}
              {result.authors && result.authors.length > 0 && (
                <div className="flex items-start space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4 mt-0.5 text-blue-500" />
                  <div className="flex-1">
                    <span className="font-medium text-gray-700">Authors:</span>
                    <div className="mt-1">
                      {Array.isArray(result.authors) ? (
                        <div className="space-y-1">
                          {result.authors.slice(0, 3).map((author, idx) => (
                            <div key={idx} className="text-sm text-gray-600">
                              • {author}
                            </div>
                          ))}
                          {result.authors.length > 3 && (
                            <div className="text-xs text-gray-500 italic">
                              + {result.authors.length - 3} more authors
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="ml-1">{result.authors}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Principal Investigator */}
              {result.principalInvestigator && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span className="font-medium text-gray-700">
                    Principal Investigator:
                  </span>
                  <span>{result.principalInvestigator}</span>
                </div>
              )}

              {/* Journal/Publication Details */}
              {(result.journal ||
                result.volume ||
                result.issue ||
                result.pages) && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Publication Details
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-700">
                    {result.journal && (
                      <div className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span className="truncate">{result.journal}</span>
                      </div>
                    )}
                    {result.volume && (
                      <div className="flex items-center space-x-1">
                        <Hash className="h-3 w-3" />
                        <span>Vol. {result.volume}</span>
                      </div>
                    )}
                    {result.issue && (
                      <div className="flex items-center space-x-1">
                        <Hash className="h-3 w-3" />
                        <span>Issue {result.issue}</span>
                      </div>
                    )}
                    {result.pages && (
                      <div className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span>pp. {result.pages}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* DOI */}
              {result.doi && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Globe className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-gray-700">DOI:</span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {result.doi}
                  </span>
                </div>
              )}

              {/* Keywords */}
              {result.keywords &&
                Array.isArray(result.keywords) &&
                result.keywords.length > 0 && (
                  <div className="flex items-start space-x-2 text-sm text-gray-600">
                    <Tag className="h-4 w-4 mt-0.5 text-orange-500" />
                    <div className="flex-1">
                      <span className="font-medium text-gray-700">
                        Keywords:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {result.keywords.slice(0, 5).map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                        {result.keywords.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            +{result.keywords.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {/* Impact Metrics */}
              {(result.citationCount || result.impactFactor) && (
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Impact Metrics
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
                    {result.citationCount && (
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{result.citationCount} citations</span>
                      </div>
                    )}
                    {result.impactFactor && (
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="h-3 w-3" />
                        <span>IF: {result.impactFactor}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Result Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FileText className="h-4 w-4" />
                <span>Research Paper</span>
              </div>
              <motion.a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="h-4 w-4" />
                <span>View Study</span>
              </motion.a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-3">
          <Globe className="h-5 w-5 text-blue-600" />
          <h4 className="text-lg font-semibold text-gray-900">
            Search Summary
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {recommendations.length}
            </div>
            <div className="text-gray-600">Studies Found</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {recommendations.filter((r) => r.link).length}
            </div>
            <div className="text-gray-600">With Links</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {recommendations.filter((r) => r.summary).length}
            </div>
            <div className="text-gray-600">With Summaries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {(
                (recommendations.reduce(
                  (sum, r) => sum + (r.similarityScore || 0),
                  0
                ) /
                  recommendations.length) *
                100
              ).toFixed(1)}
              %
            </div>
            <div className="text-gray-600">Avg Similarity</div>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <strong>Search Query:</strong> "{searchQuery}"
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecommendationResults;
