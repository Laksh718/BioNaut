import React, { useState, useEffect } from "react";
import { TrendingUp, BarChart3, Calendar, Target } from "lucide-react";
import { apiService, formatTrendAnalysis } from "../services/api.js";

const TrendAnalysis = () => {
  const [trendData, setTrendData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("summary");

  useEffect(() => {
    loadTrendData();
  }, []);

  const loadTrendData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Only load summary data for now, skip forecast due to server error
      const summaryResponse = await apiService.getTrendSummary();
      setTrendData(summaryResponse.summary);

      // Try to load forecast, but don't fail if it errors
      try {
        const forecastResponse = await apiService.getTrendForecast(2);
        setForecastData(forecastResponse.forecast);
      } catch (forecastError) {
        console.warn("Forecast not available:", forecastError.message);
        setForecastData(null);
      }
    } catch (error) {
      setError(error.message || "Failed to load trend data");
      console.error("Trend analysis error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadForecast = async (yearsAhead = 2) => {
    try {
      const response = await apiService.getTrendForecast(yearsAhead);
      setForecastData(response.forecast);
    } catch (error) {
      console.error("Forecast error:", error);
      setForecastData(null);
      // Show a user-friendly message
      alert(
        "Forecast feature is currently unavailable. Please try again later."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nasa-blue"></div>
          <span className="ml-3 text-gray-600">Loading trend analysis...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">{error}</div>
          <button onClick={loadTrendData} className="mt-3 btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Trend Analysis
            </h2>
            <p className="text-sm text-gray-600">
              Analysis of NASA space biology research trends
            </p>
          </div>
          <button onClick={loadTrendData} className="btn-secondary">
            Refresh Data
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="card">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveView("summary")}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium ${
              activeView === "summary"
                ? "bg-white text-nasa-blue shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Summary</span>
          </button>
          <button
            onClick={() => setActiveView("forecast")}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium ${
              activeView === "forecast"
                ? "bg-white text-nasa-blue shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Forecast</span>
          </button>
        </div>
      </div>

      {/* Summary View */}
      {activeView === "summary" && trendData && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card text-center">
              <div className="text-2xl font-bold text-nasa-blue">
                {trendData.total_records || "N/A"}
              </div>
              <div className="text-sm text-gray-600">Total Records</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-nasa-blue">
                {trendData.unique_organisms || "N/A"}
              </div>
              <div className="text-sm text-gray-600">Organisms Studied</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-nasa-blue">
                {trendData.unique_topics || "N/A"}
              </div>
              <div className="text-sm text-gray-600">Research Topics</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-nasa-blue">
                {trendData.unique_sources || "N/A"}
              </div>
              <div className="text-sm text-gray-600">Data Sources</div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Detailed Analysis
            </h3>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                {formatTrendAnalysis(trendData)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Forecast View */}
      {activeView === "forecast" && (
        <div className="space-y-6">
          {/* Forecast Controls */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Future Trends Forecast
            </h3>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Years Ahead:
              </label>
              <select
                onChange={(e) => loadForecast(parseInt(e.target.value))}
                className="input-field w-32"
                defaultValue="2"
              >
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
                <option value="5">5 Years</option>
              </select>
            </div>
          </div>

          {/* Forecast Results */}
          {forecastData ? (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Forecast Results
              </h3>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {typeof forecastData === "object"
                    ? JSON.stringify(forecastData, null, 2)
                    : forecastData}
                </pre>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No forecast data available</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrendAnalysis;
