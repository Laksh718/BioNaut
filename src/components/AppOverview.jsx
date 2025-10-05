import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  BarChart3,
  Lightbulb,
  Database,
  Globe,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Target,
  BookOpen,
  Satellite,
  Microscope,
  Activity,
  Brain,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { dataAnalysisService } from "../services/dataAnalysisService.js";

const AppOverview = () => {
  const [realStats, setRealStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [focusAreas, setFocusAreas] = useState([]);
  const [sourceDistribution, setSourceDistribution] = useState([]);

  const colors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const stats = await dataAnalysisService.getRealStatistics();
        const trendsData = await dataAnalysisService.getPublicationTrends();
        const focusData = await dataAnalysisService.getResearchFocusAreas();
        const sourceData = await dataAnalysisService.getSourceDistribution();

        setRealStats(stats);
        setTrends(trendsData);
        setFocusAreas(focusData);
        setSourceDistribution(sourceData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  const features = [
    {
      icon: Search,
      title: "Advanced Search",
      description:
        "Powerful semantic search across NASA space biology research with AI-powered relevance scoring",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Brain,
      title: "AI Summarization",
      description:
        "HackerNauts Summerizer provides intelligent summaries of research papers and findings",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: BarChart3,
      title: "Trend Analysis",
      description:
        "Visualize research trends and patterns in space biology over time",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Lightbulb,
      title: "Smart Recommendations",
      description:
        "Get personalized research recommendations based on your interests",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Database,
      title: "Data Sources",
      description:
        "Access to multiple NASA databases and research repositories",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      icon: Globe,
      title: "Real-time Updates",
      description:
        "Stay updated with the latest space biology research and publications",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ];

  if (!realStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading knowledge base data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <img
            src="/hackernauts-logo.png"
            alt="HackerNauts Logo"
            className="w-12 h-12 rounded-xl shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">BioNaut</h1>
            <p className="text-lg text-gray-600">
              NASA Space Biology Knowledge Base
            </p>
          </div>
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto">
          A comprehensive knowledge base powered by HackerNauts AI, providing
          access to NASA's space biology research with{" "}
          {realStats.totalPublications} publications from{" "}
          {realStats.totalSources} authoritative sources.
        </p>
      </motion.div>

      {/* Real Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {realStats.totalPublications}
          </h3>
          <p className="text-sm font-medium text-gray-700 mb-1">
            Research Publications
          </p>
          <p className="text-xs text-gray-500">NASA space biology papers</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Database className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {realStats.totalSources}
          </h3>
          <p className="text-sm font-medium text-gray-700 mb-1">Data Sources</p>
          <p className="text-xs text-gray-500">Authoritative databases</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {realStats.lastUpdated.split("-")[0]}
          </h3>
          <p className="text-sm font-medium text-gray-700 mb-1">Last Updated</p>
          <p className="text-xs text-gray-500">Dataset refresh date</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Activity className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">Active</h3>
          <p className="text-sm font-medium text-gray-700 mb-1">
            System Status
          </p>
          <p className="text-xs text-gray-500">Real-time updates</p>
        </motion.div>
      </motion.div>

      {/* Charts Section - Only show if data is available */}
      {sourceDistribution.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-1 gap-8"
        >
          {/* Source Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="h-5 w-5 text-green-600 mr-2" />
              Data Source Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {sourceDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Knowledge Base Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Data Sources List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Data Sources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {realStats.dataSources.map((source, index) => (
            <motion.div
              key={source}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white rounded-lg p-4 shadow-md flex items-center space-x-3"
            >
              <Database className="h-5 w-5 text-blue-600" />
              <span className="text-gray-900 font-medium">{source}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Mission Statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 text-white text-center"
      >
        <Shield className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Knowledge Base Mission</h2>
        <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
          To provide comprehensive, accurate, and accessible information about
          NASA's space biology research. This knowledge base serves as a central
          repository for researchers, scientists, and enthusiasts to explore the
          fascinating world of life in space through verified, peer-reviewed
          scientific data.
        </p>
      </motion.div>
    </div>
  );
};

export default AppOverview;
