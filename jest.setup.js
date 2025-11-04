// Setup for Jest tests

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock expo-network
jest.mock("expo-network", () => ({
  getNetworkStateAsync: jest.fn(() =>
    Promise.resolve({
      isConnected: true,
      isInternetReachable: true,
    })
  ),
  addNetworkStateListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
}));

// Mock OfflineQueueManager
jest.mock("./src/network/OfflineQueueManager", () => ({
  OfflineQueueManager: {
    enqueue: jest.fn(() => Promise.resolve()),
  },
}));
