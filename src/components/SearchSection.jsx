import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Microscope,
  X,
  ChevronRight,
  BarChart3,
  FileText,
  Database,
  Activity,
  TrendingUp,
  Star,
  Clock,
  Calendar,
  List,
  User,
  Leaf,
  Zap,
  Orbit,
} from "lucide-react";
import SearchSuggestions from "./SearchSuggestions";

const SearchSection = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleKeyPress,
  isLoading,
  isGeneratingAI,
  filters,
  setFilters,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCustomCount, setIsCustomCount] = useState(false);
  const [showSearchOptions, setShowSearchOptions] = useState(true);

  // Popular search suggestions
  const popularSearches = [
    "microgravity effects on bone density",
    "space radiation and DNA damage",
    "plant growth in space",
    "astronaut muscle atrophy",
    "space medicine research",
    "ISS biology experiments",
    "spaceflight immune system",
    "zero gravity cardiovascular effects",
    "space food and nutrition",
    "space psychology and behavior",
  ];

  // Search categories
  const searchCategories = [
    {
      title: "Human Health",
      icon: User,
      searches: [
        "bone loss in space",
        "muscle atrophy astronauts",
        "cardiovascular changes",
        "immune system space",
      ],
    },
    {
      title: "Plant Biology",
      icon: Leaf,
      searches: [
        "plant growth ISS",
        "space agriculture",
        "microgravity photosynthesis",
        "space farming",
      ],
    },
    {
      title: "Radiation Effects",
      icon: Zap,
      searches: [
        "space radiation DNA",
        "cosmic ray effects",
        "radiation shielding",
        "space radiation biology",
      ],
    },
    {
      title: "Microgravity",
      icon: Orbit,
      searches: [
        "zero gravity effects",
        "microgravity experiments",
        "space environment",
        "weightlessness biology",
      ],
    },
  ];

  // Preset date ranges
  const datePresets = [
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
    { label: "Last 3 months", days: 90 },
    { label: "Last 6 months", days: 180 },
    { label: "Last year", days: 365 },
    { label: "Last 2 years", days: 730 },
    { label: "Last 5 years", days: 1825 },
  ];

  const applyDatePreset = (days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    setFilters({
      ...filters,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    });
  };

  const handleResultsCountChange = (value) => {
    const num = parseInt(value);
    if (!isNaN(num) && num > 0 && num <= 100) {
      setFilters({
        ...filters,
        numResults: num,
      });
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    handleSearch();
  };

  const handleSearchOptionClick = (searchTerm) => {
    setSearchQuery(searchTerm);
    setShowSearchOptions(false);
    handleSearch();
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
          <Microscope className="h-6 w-6 text-blue-600" />
          <span>Semantic Search</span>
        </h2>
        <p className="text-gray-600">
          Discover NASA space biology research with AI-powered semantic search
        </p>
      </div>

      {/* Search Input */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="flex-1 relative">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
          >
            <Microscope className="h-5 w-5 text-gray-400" />
          </motion.div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(e.target.value.length === 0);
            }}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Enter your research query (e.g., 'microgravity effects on bone density')"
            className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900 bg-white placeholder-gray-500"
          />
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}

          {/* Search Suggestions */}
          <SearchSuggestions
            onSelectSuggestion={handleSuggestionSelect}
            isVisible={showSuggestions}
          />
        </div>
        <motion.button
          onClick={handleSearch}
          disabled={isLoading || isGeneratingAI || !searchQuery.trim()}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
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
              <span>Searching...</span>
            </>
          ) : isGeneratingAI ? (
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
              <span>Generating AI...</span>
            </>
          ) : (
            <>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Search className="h-4 w-4" />
              </motion.div>
              <span>Search</span>
              <motion.div
                animate={{ x: [0, 2, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ChevronRight className="h-3 w-3" />
              </motion.div>
            </>
          )}
        </motion.button>
      </div>

      {/* Show Search Options Button */}
      {!showSearchOptions && !searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center"
        >
          <button
            onClick={() => setShowSearchOptions(true)}
            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
          >
            <Star className="h-4 w-4" />
            <span>Show Search Suggestions</span>
          </button>
        </motion.div>
      )}

      {/* Search Options */}
      {showSearchOptions && !searchQuery && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Popular Searches</span>
            </h3>
            <button
              onClick={() => setShowSearchOptions(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Popular Search Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {popularSearches.map((search, index) => (
              <motion.button
                key={search}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSearchOptionClick(search)}
                className="px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {search}
              </motion.button>
            ))}
          </div>

          {/* Search Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {searchCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200"
              >
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <category.icon className="h-5 w-5 text-blue-600" />
                  <span>{category.title}</span>
                </h4>
                <div className="space-y-2">
                  {category.searches.map((search, searchIndex) => (
                    <button
                      key={search}
                      onClick={() => handleSearchOptionClick(search)}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white hover:text-blue-700 rounded-md transition-colors duration-200 border border-transparent hover:border-blue-200"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
            <List className="h-4 w-4" />
            <span>Results Count</span>
          </label>
          <div className="flex space-x-2">
            <select
              value={isCustomCount ? "custom" : filters.numResults}
              onChange={(e) => {
                if (e.target.value === "custom") {
                  setIsCustomCount(true);
                } else {
                  setIsCustomCount(false);
                  const value = parseInt(e.target.value);
                  setFilters({
                    ...filters,
                    numResults: value,
                  });
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              {[3, 5, 10, 15, 20, 25, 50].map((num) => (
                <option key={num} value={num}>
                  {num} results
                </option>
              ))}
              <option value="custom">Custom...</option>
            </select>
            {isCustomCount && (
              <input
                type="number"
                min="1"
                max="100"
                value={filters.numResults}
                onChange={(e) => handleResultsCountChange(e.target.value)}
                className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-gray-900 bg-white"
                placeholder="Custom"
                autoFocus
              />
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
            <FileText className="h-4 w-4" />
            <span>Source Type</span>
          </label>
          <select
            value={filters.sourceType}
            onChange={(e) =>
              setFilters({ ...filters, sourceType: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="All">All Sources</option>
            <option value="Publication">Publications</option>
            <option value="Dataset">Datasets</option>
            <option value="Report">Reports</option>
          </select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
            <Database className="h-4 w-4" />
            <span>Source</span>
          </label>
          <select
            value={filters.source}
            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="All">All Sources</option>
            <option value="NASA">NASA</option>
            <option value="NSLS">NSLS</option>
            <option value="PubMed">PubMed</option>
          </select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Start Date</span>
          </label>
          <input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                startDate: e.target.value || null,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            max={new Date().toISOString().split("T")[0]}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>End Date</span>
          </label>
          <input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                endDate: e.target.value || null,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            max={new Date().toISOString().split("T")[0]}
            min={filters.startDate || undefined}
          />
        </motion.div>
      </div>

      {/* Date Range Presets */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>Quick Date Ranges</span>
        </label>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {datePresets.map((preset, index) => (
            <motion.button
              key={preset.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => applyDatePreset(preset.days)}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-700 rounded-lg transition-colors duration-200 border border-gray-200 hover:border-blue-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {preset.label}
            </motion.button>
          ))}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + datePresets.length * 0.05 }}
            onClick={() =>
              setFilters({
                ...filters,
                startDate: null,
                endDate: null,
              })
            }
            className="px-3 py-2 text-sm bg-red-100 hover:bg-red-200 hover:text-red-700 text-red-600 rounded-lg transition-colors duration-200 border border-red-200 hover:border-red-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Clear Dates
          </motion.button>
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {filters.startDate || filters.endDate ? (
            <span className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>
                {filters.startDate && filters.endDate
                  ? `${filters.startDate} to ${filters.endDate}`
                  : filters.startDate
                  ? `From ${filters.startDate}`
                  : `Until ${filters.endDate}`}
              </span>
            </span>
          ) : (
            <span>All dates</span>
          )}
        </div>

        <motion.button
          onClick={() => {
            setIsCustomCount(false);
            setFilters({
              numResults: 5,
              sourceType: "All",
              source: "All",
              yearRange: null,
              startDate: null,
              endDate: null,
            });
          }}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center space-x-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <X className="h-4 w-4" />
          <span>Clear Filters</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SearchSection;
