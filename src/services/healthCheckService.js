// Health Check Service for monitoring external APIs
import axios from "axios";

class HealthCheckService {
  constructor() {
    this.endpoints = {
      bionauts: "https://bionauts.onrender.com/health",
      summarizer: "https://summarizer-model.onrender.com/health",
    };
    this.healthStatus = {
      bionauts: { status: "unknown", lastChecked: null, isHealthy: false },
      summarizer: { status: "unknown", lastChecked: null, isHealthy: false },
    };
    this.listeners = [];
    this.intervalId = null;
    this.checkInterval = 40000; // 40 seconds
  }

  // Add listener for health status changes
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Remove listener
  removeListener(callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  // Notify all listeners of health status changes
  notifyListeners() {
    this.listeners.forEach((callback) => callback(this.healthStatus));
  }

  // Check health of a specific endpoint
  async checkEndpointHealth(endpointName) {
    try {
      const response = await axios.get(this.endpoints[endpointName], {
        timeout: 10000, // 10 second timeout
        headers: {
          "Content-Type": "application/json",
        },
      });

      const isHealthy =
        response.status === 200 && response.data?.status === "ok";
      const timestamp = new Date().toISOString();

      // Update health status
      this.healthStatus[endpointName] = {
        status: isHealthy ? "healthy" : "unhealthy",
        lastChecked: timestamp,
        isHealthy: isHealthy,
        response: response.data,
      };

      // Log to console
      console.log(
        `[Health Check] ${endpointName.toUpperCase()}: ${
          isHealthy ? "HEALTHY" : "UNHEALTHY"
        }`,
        {
          endpoint: this.endpoints[endpointName],
          status: response.status,
          data: response.data,
          timestamp: timestamp,
        }
      );

      return this.healthStatus[endpointName];
    } catch (error) {
      const timestamp = new Date().toISOString();

      // Update health status to unhealthy
      this.healthStatus[endpointName] = {
        status: "unhealthy",
        lastChecked: timestamp,
        isHealthy: false,
        error: error.message,
      };

      // Log error to console
      console.error(`[Health Check] ${endpointName.toUpperCase()}: ERROR`, {
        endpoint: this.endpoints[endpointName],
        error: error.message,
        timestamp: timestamp,
      });

      return this.healthStatus[endpointName];
    }
  }

  // Check health of all endpoints
  async checkAllEndpoints() {
    console.log("[Health Check] Starting health check for all endpoints...");

    const promises = Object.keys(this.endpoints).map((endpointName) =>
      this.checkEndpointHealth(endpointName)
    );

    const results = await Promise.allSettled(promises);

    // Notify listeners of status changes
    this.notifyListeners();

    return this.healthStatus;
  }

  // Start periodic health checks
  startPeriodicChecks() {
    console.log(
      `[Health Check] Starting periodic health checks every ${
        this.checkInterval / 1000
      } seconds`
    );

    // Initial check
    this.checkAllEndpoints();

    // Set up interval
    this.intervalId = setInterval(() => {
      this.checkAllEndpoints();
    }, this.checkInterval);
  }

  // Stop periodic health checks
  stopPeriodicChecks() {
    if (this.intervalId) {
      console.log("[Health Check] Stopping periodic health checks");
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Get current health status
  getHealthStatus() {
    return this.healthStatus;
  }

  // Check if a specific service is healthy
  isServiceHealthy(serviceName) {
    return this.healthStatus[serviceName]?.isHealthy || false;
  }

  // Check if both services are healthy
  areAllServicesHealthy() {
    return Object.values(this.healthStatus).every(
      (service) => service.isHealthy
    );
  }

  // Get unhealthy services
  getUnhealthyServices() {
    return Object.entries(this.healthStatus)
      .filter(([name, status]) => !status.isHealthy)
      .map(([name]) => name);
  }
}

// Create singleton instance
const healthCheckService = new HealthCheckService();

export default healthCheckService;

