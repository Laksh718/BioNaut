import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  TrendingUp,
  Clock,
  Star,
  Zap,
  Microscope,
  Atom,
  Satellite,
  Globe,
  Rocket,
} from "lucide-react";

const SearchSuggestions = ({ onSelectSuggestion, isVisible }) => {
  const [selectedCategory, setSelectedCategory] = useState("popular");

  const predefinedSearches = {
    popular: [
      {
        title: "Microgravity effects on bone density",
        description: "Research on bone loss in space environments",
        icon: Microscope,
        category: "Human Biology",
        trending: true,
      },
      {
        title: "Plant growth experiments on ISS",
        description: "Studies on plant development in microgravity",
        icon: Atom,
        category: "Plant Biology",
        trending: true,
      },
      {
        title: "Space radiation effects on DNA",
        description: "Impact of cosmic radiation on genetic material",
        icon: Zap,
        category: "Radiation Biology",
        trending: false,
      },
      {
        title: "Muscle atrophy in astronauts",
        description: "Muscle loss patterns during space missions",
        icon: TrendingUp,
        category: "Human Biology",
        trending: true,
      },
      {
        title: "Circadian rhythm disruption in space",
        description: "Sleep patterns and biological clocks in space",
        icon: Clock,
        category: "Human Biology",
        trending: false,
      },
    ],
    recent: [
      {
        title: "ISS Expedition 65 biology experiments",
        description: "Latest biological research from ISS",
        icon: Satellite,
        category: "Mission Data",
        trending: false,
      },
      {
        title: "Mars mission health considerations",
        description: "Health challenges for long-duration Mars missions",
        icon: Rocket,
        category: "Future Missions",
        trending: true,
      },
      {
        title: "Space food production systems",
        description: "Sustainable food production for space travel",
        icon: Globe,
        category: "Life Support",
        trending: false,
      },
    ],
    trending: [
      {
        title: "CRISPR gene editing in space",
        description: "Genetic modification techniques in microgravity",
        icon: Atom,
        category: "Biotechnology",
        trending: true,
      },
      {
        title: "Artificial gravity effects on biology",
        description: "Impact of simulated gravity on biological systems",
        icon: Globe,
        category: "Physics Biology",
        trending: true,
      },
      {
        title: "Space medicine advancements",
        description: "Medical innovations from space research",
        icon: Microscope,
        category: "Medicine",
        trending: true,
      },
    ],
  };

  const categories = [
    { id: "popular", label: "Popular", icon: Star },
    { id: "recent", label: "Recent", icon: Clock },
    { id: "trending", label: "Trending", icon: TrendingUp },
  ];

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-2"
    >
      {/* Category Tabs */}
      <div className="flex border-b border-gray-200">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="h-4 w-4" />
              <span>{category.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Suggestions List */}
      <div className="max-h-80 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="p-2"
          >
            {predefinedSearches[selectedCategory].map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectSuggestion(suggestion.title)}
                  className="w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        suggestion.trending
                          ? "bg-gradient-to-r from-orange-500 to-red-500"
                          : "bg-gray-100 group-hover:bg-gray-200"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          suggestion.trending ? "text-white" : "text-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {suggestion.title}
                      </h4>
                      {suggestion.trending && (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="flex-shrink-0"
                        >
                          <TrendingUp className="h-3 w-3 text-orange-500" />
                        </motion.div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                      {suggestion.description}
                    </p>
                    <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                      {suggestion.category}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-lg">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Click any suggestion to search instantly
          </p>
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <Search className="h-3 w-3" />
            <span>Powered by NASA Space Biology</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchSuggestions;

