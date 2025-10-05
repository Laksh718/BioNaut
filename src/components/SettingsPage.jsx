import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Moon,
  Sun,
  Monitor,
  Palette,
  Database,
  Search,
  Bell,
  Shield,
  Info,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Globe,
  Clock,
  HardDrive,
  RefreshCw,
} from "lucide-react";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    theme: "light",
    searchResults: 10,
    autoSave: true,
    notifications: false,
    dataRefresh: "daily",
    language: "en",
    showAdvanced: false,
    cacheSize: "medium",
    apiTimeout: 30,
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("bionaut-settings");
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      setIsDarkMode(parsedSettings.theme === "dark");
      applyTheme(parsedSettings.theme);
    }
  }, []);

  // Apply theme to document
  const applyTheme = (theme) => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const handleSave = () => {
    localStorage.setItem("bionaut-settings", JSON.stringify(settings));
    setIsDarkMode(settings.theme === "dark");
    applyTheme(settings.theme);

    // Show success message
    const saveButton = document.querySelector("[data-save-button]");
    const originalText = saveButton.textContent;
    saveButton.textContent = "Saved!";
    saveButton.classList.add("bg-green-600");
    setTimeout(() => {
      saveButton.textContent = originalText;
      saveButton.classList.remove("bg-green-600");
    }, 2000);
  };

  const handleReset = () => {
    const defaultSettings = {
      theme: "light",
      searchResults: 10,
      autoSave: true,
      notifications: false,
      dataRefresh: "daily",
      language: "en",
      showAdvanced: false,
      cacheSize: "medium",
      apiTimeout: 30,
    };
    setSettings(defaultSettings);
    setIsDarkMode(false);
    applyTheme("light");
  };

  const handleThemeChange = (theme) => {
    setSettings({ ...settings, theme });
  };

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between">
      <div>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Settings className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">
              Customize your HackerNauts research experience
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Theme Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Palette className="h-5 w-5 text-purple-600 mr-2" />
              Appearance
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "light", label: "Light", icon: Sun },
                    { value: "dark", label: "Dark", icon: Moon },
                    { value: "system", label: "System", icon: Monitor },
                  ].map((theme) => {
                    const Icon = theme.icon;
                    return (
                      <button
                        key={theme.value}
                        onClick={() => handleThemeChange(theme.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          settings.theme === theme.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {theme.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Search className="h-5 w-5 text-blue-600 mr-2" />
              Search Preferences
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Search Results
                </label>
                <select
                  value={settings.searchResults}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      searchResults: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5 results</option>
                  <option value={10}>10 results</option>
                  <option value={15}>15 results</option>
                  <option value={20}>20 results</option>
                  <option value={25}>25 results</option>
                </select>
              </div>
              <ToggleSwitch
                enabled={settings.autoSave}
                onChange={() =>
                  setSettings({ ...settings, autoSave: !settings.autoSave })
                }
                label="Auto-save searches"
                description="Automatically save your search history"
              />
            </div>
          </motion.div>

          {/* Data Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="h-5 w-5 text-green-600 mr-2" />
              Data Management
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Refresh Frequency
                </label>
                <select
                  value={settings.dataRefresh}
                  onChange={(e) =>
                    setSettings({ ...settings, dataRefresh: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="realtime">Real-time</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cache Size
                </label>
                <select
                  value={settings.cacheSize}
                  onChange={(e) =>
                    setSettings({ ...settings, cacheSize: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="small">Small (50MB)</option>
                  <option value="medium">Medium (100MB)</option>
                  <option value="large">Large (200MB)</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Privacy Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 text-red-600 mr-2" />
              Privacy & Security
            </h3>
            <div className="space-y-4">
              <ToggleSwitch
                enabled={settings.notifications}
                onChange={() =>
                  setSettings({
                    ...settings,
                    notifications: !settings.notifications,
                  })
                }
                label="Enable notifications"
                description="Get updates about new research"
              />
              <ToggleSwitch
                enabled={settings.showAdvanced}
                onChange={() =>
                  setSettings({
                    ...settings,
                    showAdvanced: !settings.showAdvanced,
                  })
                }
                label="Show advanced options"
                description="Display additional configuration options"
              />
            </div>
          </motion.div>

          {/* Advanced Settings */}
          {settings.showAdvanced && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <HardDrive className="h-5 w-5 text-orange-600 mr-2" />
                Advanced Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={settings.apiTimeout}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        apiTimeout: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Clear Cache
                    </label>
                    <p className="text-xs text-gray-500">
                      Remove cached data to free up space
                    </p>
                  </div>
                  <button className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Info className="h-5 w-5 text-gray-600 mr-2" />
              About HackerNauts
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Version:</strong> 1.0.0
              </p>
              <p className="text-sm text-gray-600">
                <strong>Powered by:</strong> HackerNauts AI & Google Gemini
              </p>
              <p className="text-sm text-gray-600">
                <strong>Data Sources:</strong> NASA Space Biology Publications,
                NSLSL, NASA Task Book, OSDR
              </p>
              <p className="text-sm text-gray-600">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex items-center justify-between bg-white rounded-xl shadow-lg p-6"
      >
        <button
          onClick={handleReset}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset to Default</span>
        </button>
        <button
          data-save-button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          <span>Save Settings</span>
        </button>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
