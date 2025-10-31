// Setup for Jest tests

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock NetInfo
jest.mock("@react-native-community/netinfo", () => ({
  fetch: jest.fn(() =>
    Promise.resolve({
      isConnected: true,
      isInternetReachable: true,
    })
  ),
  addEventListener: jest.fn(),
}));

// Mock OfflineQueueManager
jest.mock("./src/network/OfflineQueueManager", () => ({
  OfflineQueueManager: {
    enqueue: jest.fn(() => Promise.resolve()),
  },
}));
