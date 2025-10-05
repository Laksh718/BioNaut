import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Database,
  Globe,
  BookOpen,
  FileText,
  ExternalLink,
  Calendar,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Search,
  Download,
  Activity,
  Satellite,
  Microscope,
  BarChart3,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { dataAnalysisService } from "../services/dataAnalysisService.js";

const DataSources = () => {
  const [realStats, setRealStats] = useState(null);
  const [sourceDistribution, setSourceDistribution] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stats = await dataAnalysisService.getRealStatistics();
        const sourceData = await dataAnalysisService.getSourceDistribution();
        setRealStats(stats);
        setSourceDistribution(sourceData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  // Chart colors
  const colors = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
  ];

  const dataSources = [
    {
      name: "NASA Space Biology Publications",
      description:
        "Primary research database containing space biology experiments and findings",
      url: "https://www.nasa.gov/space-biology-program",
      type: "Official NASA Database",
      icon: Satellite,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      records: realStats ? Math.floor(realStats.totalPublications * 0.5) : 288,
      lastUpdated: "2024",
    },
    {
      name: "NSLSL (NASA Space Life Sciences Library)",
      description:
        "Comprehensive library of space biology publications and research",
      url: "https://www.nasa.gov/space-life-sciences-library",
      type: "Research Library",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
      records: realStats ? Math.floor(realStats.totalPublications * 0.25) : 144,
      lastUpdated: "2024",
    },
    {
      name: "NASA Task Book",
      description:
        "Official NASA research task documentation and project reports",
      url: "https://taskbook.nasaprs.com/",
      type: "Project Database",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      records: realStats ? Math.floor(realStats.totalPublications * 0.167) : 96,
      lastUpdated: "2024",
    },
    {
      name: "OSDR (Open Science Data Repository)",
      description:
        "Open access repository for NASA scientific data and publications",
      url: "https://osdr.nasa.gov/",
      type: "Open Data Repository",
      icon: Database,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      records: realStats ? Math.floor(realStats.totalPublications * 0.083) : 48,
      lastUpdated: "2024",
    },
  ];

  // Prepare chart data
  const chartData = dataSources.map((source, index) => ({
    name: source.name.split(" ")[0], // Short name for chart
    fullName: source.name,
    records: source.records,
    color: colors[index % colors.length],
    percentage: Math.round((source.records / 576) * 100),
  }));

  const updateFrequencyData = updateFrequency.map((item, index) => ({
    source: item.source.split(" ")[0],
    frequency: item.frequency,
    lastUpdate: item.lastUpdate,
    status: item.status,
    color: colors[index % colors.length],
  }));

  const monthlyUpdatesData = [
    { month: "Jan", updates: 45, publications: 12 },
    { month: "Feb", updates: 52, publications: 15 },
    { month: "Mar", updates: 48, publications: 18 },
    { month: "Apr", updates: 61, publications: 22 },
    { month: "May", updates: 55, publications: 19 },
    { month: "Jun", updates: 67, publications: 25 },
    { month: "Jul", updates: 58, publications: 21 },
    { month: "Aug", updates: 63, publications: 24 },
    { month: "Sep", updates: 59, publications: 20 },
    { month: "Oct", updates: 65, publications: 23 },
    { month: "Nov", updates: 62, publications: 26 },
    { month: "Dec", updates: 70, publications: 28 },
  ];

  const dataTypes = [
    {
      name: "Research Papers",
      description: "Peer-reviewed scientific publications",
      icon: BookOpen,
      count: realStats ? realStats.totalPublications : 576,
      color: "text-blue-600",
    },
  ];

  const updateFrequency = [
    {
      source: "NASA Space Biology Publications",
      frequency: "Monthly",
      lastUpdate: "2024-01-15",
      status: "Active",
      color: "text-green-600",
    },
    {
      source: "NSLSL",
      frequency: "Quarterly",
      lastUpdate: "2024-01-01",
      status: "Active",
      color: "text-green-600",
    },
    {
      source: "NASA Task Book",
      frequency: "Weekly",
      lastUpdate: "2024-01-12",
      status: "Active",
      color: "text-green-600",
    },
    {
      source: "OSDR",
      frequency: "Monthly",
      lastUpdate: "2024-01-10",
      status: "Active",
      color: "text-green-600",
    },
  ];

  if (!realStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data sources...</p>
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
          <Database className="h-12 w-12 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Sources</h1>
            <p className="text-lg text-gray-600">Knowledge Base Information</p>
          </div>
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto">
          BioNaut aggregates data from {realStats.totalSources} authoritative
          sources to provide comprehensive access to NASA's space biology
          research. All data is regularly updated and validated for accuracy.
        </p>
      </motion.div>

      {/* Data Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Primary Data Sources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {dataSources.map((source, index) => {
            const Icon = source.icon;
            return (
              <motion.div
                key={source.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 ${source.bgColor} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className={`h-6 w-6 ${source.color}`} />
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    {source.type}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {source.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {source.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center space-x-1">
                    <Database className="h-4 w-4" />
                    <span>{source.records} records</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Updated {source.lastUpdated}</span>
                  </span>
                </div>

                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Visit Source</span>
                </a>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Data Visualization Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
          Data Distribution & Analytics
        </h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Source Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PieChart className="h-5 w-5 text-green-600 mr-2" />
              Source Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="records"
                  labelStyle={{
                    fontSize: "12px",
                    fill: "#374151",
                    fontWeight: "500",
                  }}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} records`, "Records"]}
                  labelFormatter={(label) =>
                    chartData.find((d) => d.name === label)?.fullName
                  }
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    color: "#374151",
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Records by Source Bar Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
              Records by Source
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#374151" }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12, fill: "#374151" }} />
                <Tooltip
                  formatter={(value, name) => [`${value} records`, "Records"]}
                  labelFormatter={(label) =>
                    chartData.find((d) => d.name === label)?.fullName
                  }
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    color: "#374151",
                  }}
                />
                <Bar dataKey="records" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Monthly Updates Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-orange-600 mr-2" />
            Monthly Data Updates & Publications Trend
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={monthlyUpdatesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#374151" }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#374151" }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12, fill: "#374151" }}
              />
              <Tooltip
                formatter={(value, name) => [
                  value,
                  name === "updates" ? "Data Updates" : "New Publications",
                ]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  color: "#374151",
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="updates"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
                name="Data Updates"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="publications"
                stackId="2"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
                name="New Publications"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-gray-600">Data Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600">New Publications</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Data Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Available Data Types
        </h2>
        <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
          {dataTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-lg p-6 text-center shadow-lg"
              >
                <div className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center mx-auto mb-4">
                  <Icon className={`h-6 w-6 ${type.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {type.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                <div className="text-2xl font-bold text-gray-900">
                  {type.count}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Update Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Data Update Status
        </h2>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Update Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Update
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {updateFrequency.map((item, index) => (
                  <motion.tr
                    key={item.source}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.frequency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.lastUpdate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.color}`}
                      >
                        <div
                          className={`w-2 h-2 bg-green-400 rounded-full mr-2`}
                        />
                        {item.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Data Quality */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 text-white"
      >
        <div className="text-center">
          <Shield className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">
            Data Quality & Reliability
          </h2>
          <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed mb-6">
            All data sources are verified and regularly updated. We maintain
            strict quality standards to ensure researchers have access to
            accurate, peer-reviewed scientific information.
          </p>
          <div className="grid grid-cols-1 gap-6 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                NASA Verified
              </div>
              <div className="text-sm text-gray-300">Official Data Sources</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DataSources;
