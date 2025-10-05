import React from "react";
import { motion } from "framer-motion";
import { FileText, TrendingUp, Target, Users } from "lucide-react";

const SummarySection = ({ summary }) => {
  if (!summary) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Summary</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-600">
            Search for research to see an AI-generated summary
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">ML Summary</h3>
      </div>

      <div className="prose max-w-none">
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">Key Findings</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              ML-powered research insights
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-900">Research Focus</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Targeted space biology research
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-900">
                Expert Analysis
              </span>
            </div>
            <p className="text-sm text-purple-700 mt-1">
              ML-powered research synthesis
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default SummarySection;
