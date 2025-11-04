import axios from "axios";
import { API_URL } from "@env";

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean;
  type?: string;
}

type NetworkStateCallback = (state: NetworkState) => void;

class NetworkManager {
  private listeners: Set<NetworkStateCallback> = new Set();
  private currentState: NetworkState = {
    isConnected: true,
    isInternetReachable: true,
  };
  private checkInterval: NodeJS.Timeout | null = null;

  /**
   * Check network connectivity by attempting a lightweight request
   */
  async fetch(): Promise<NetworkState> {
    try {
      // Try a HEAD request to a well-known endpoint (or your API health endpoint)
      // Using a short timeout to fail fast
      await axios.head(API_URL, { timeout: 3000 });
      this.currentState = {
        isConnected: true,
        isInternetReachable: true,
        type: "unknown",
      };
    } catch (error: any) {
      // Check if it's a network error (no internet) vs server error (has internet but server down)
      const isNetworkError =
        !error.response && (error.code === "ECONNABORTED" || error.message?.includes("timeout") || error.message?.includes("Network"));

      this.currentState = {
        isConnected: !isNetworkError,
        isInternetReachable: !isNetworkError,
        type: isNetworkError ? "none" : "unknown",
      };
    }

    return { ...this.currentState };
  }

  /**
   * Add a listener for network state changes
   */
  addEventListener(callback: NetworkStateCallback): () => void {
    this.listeners.add(callback);

    // If this is the first listener, start polling
    if (this.listeners.size === 1) {
      this.startPolling();
    }

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
      // If no more listeners, stop polling
      if (this.listeners.size === 0) {
        this.stopPolling();
      }
    };
  }

  /**
   * Start polling network state every 5 seconds
   */
  private startPolling() {
    if (this.checkInterval) return;

    this.checkInterval = setInterval(async () => {
      const previousState = { ...this.currentState };
      await this.fetch();

      // Only notify if state changed
      if (
        previousState.isConnected !== this.currentState.isConnected ||
        previousState.isInternetReachable !== this.currentState.isInternetReachable
      ) {
        this.listeners.forEach((callback) => {
          callback({ ...this.currentState });
        });
      }
    }, 5000);
  }

  /**
   * Stop polling network state
   */
  private stopPolling() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

// Export singleton instance
const Network = new NetworkManager();

export default Network;

