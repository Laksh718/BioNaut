import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  BarChart3,
  Brain,
  TrendingUp,
  FileText,
  Database,
  Activity,
  Zap,
  Target,
  Globe,
  Satellite,
  ArrowRight,
  BookOpen,
  Microscope,
  Rocket,
} from "lucide-react";
import AIInsights from "./AIInsights";

const DashboardOverview = ({
  searchResults,
  summary,
  isGeneratingAI,
  aiInsights,
  filters,
  showAIInsights,
  setShowAIInsights,
  handleAIInsightsComplete,
  searchQuery,
  setActiveTab,
}) => {
  const quickActions = [
    {
      title: "Search Research",
      description: "Find NASA space biology publications",
      icon: Search,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      action: () => setActiveTab("search"),
    },
    {
      title: "View Trends",
      description: "Analyze research patterns over time",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      action: () => setActiveTab("trends"),
    },
    {
      title: "Get Recommendations",
      description: "Discover related research papers",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      action: () => setActiveTab("recommendations"),
    },
    {
      title: "Explore Data Sources",
      description: "Learn about our data repositories",
      icon: Database,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      action: () => setActiveTab("data-sources"),
    },
  ];

  const features = [
    {
      title: "Advanced Search",
      description:
        "AI-powered semantic search across NASA's space biology research database",
      icon: Search,
      color: "text-blue-600",
    },
    {
      title: "AI Summarization",
      description:
        "HackerNauts Summerizer provides intelligent summaries of research findings",
      icon: Brain,
      color: "text-purple-600",
    },
    {
      title: "Trend Analysis",
      description:
        "Visualize research trends and patterns in space biology over time",
      icon: BarChart3,
      color: "text-green-600",
    },
    {
      title: "Smart Recommendations",
      description:
        "Get personalized research recommendations based on your interests",
      icon: Target,
      color: "text-orange-600",
    },
  ];

  const stats = [
    {
      title: "Research Publications",
      value: "576",
      description: "NASA space biology papers",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Data Sources",
      value: "4",
      description: "Authoritative databases",
      icon: Database,
      color: "text-green-600",
    },
    {
      title: "AI-Powered",
      value: "100%",
      description: "HackerNauts technology",
      icon: Zap,
      color: "text-purple-600",
    },
    {
      title: "Real-time",
      value: "24/7",
      description: "System availability",
      icon: Activity,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="flex items-center justify-center space-x-4 mb-6">
          <img
            src="/hackernauts-logo.png"
            alt="HackerNauts Logo"
            className="w-16 h-16 rounded-xl shadow-lg"
          />
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome to BioNaut
            </h1>
            <p className="text-xl text-gray-600">
              NASA Space Biology Knowledge Base
            </p>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Explore NASA's comprehensive space biology research with AI-powered
          search, intelligent summarization, and advanced analytics. Discover
          the fascinating world of life in space through verified scientific
          data.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <motion.button
            onClick={() => setActiveTab("search")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search className="h-5 w-5" />
            <span>Start Searching</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("overview")}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                onClick={action.action}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className={`h-6 w-6 ${action.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Knowledge Base Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-lg p-6 text-center shadow-lg"
              >
                <div className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center mx-auto mb-4">
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {stat.title}
                </p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      {searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 text-blue-600 mr-2" />
            Recent Search Results
          </h2>
          <div className="space-y-3">
            {searchResults.slice(0, 3).map((result, index) => (
              <motion.div
                key={result.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FileText className="h-5 w-5 text-gray-600" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                    {result.title}
                  </h4>
                  <p className="text-xs text-gray-500">{result.source}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => setActiveTab("search")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All Results →
            </button>
          </div>
        </motion.div>
      )}

      {/* AI Insights */}
      {showAIInsights && aiInsights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <AIInsights
            isOpen={showAIInsights}
            onClose={() => setShowAIInsights(false)}
            searchQuery={searchQuery}
            resultsLength={searchResults.length}
            onComplete={handleAIInsightsComplete}
            preGeneratedInsights={aiInsights}
          />
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 text-white text-center"
      >
        <Rocket className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">
          Ready to Explore Space Biology?
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
          Start your research journey with NASA's comprehensive space biology
          database. Discover groundbreaking research, get AI-powered insights,
          and explore the future of life in space.
        </p>
        <motion.button
          onClick={() => setActiveTab("search")}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Search className="h-5 w-5" />
          <span>Start Researching</span>
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
