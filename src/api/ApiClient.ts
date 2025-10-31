import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError, AxiosInstance } from "axios";
import NetInfo from "@react-native-community/netinfo";
import { OfflineQueueManager } from "../network/OfflineQueueManager";

export class ApiClient {
  private static instance: AxiosInstance;

  private constructor() {}

  public static getInstance() {
    if (!ApiClient.instance) {
      ApiClient.instance = axios.create({
        baseURL: API_URL,
        timeout: 10000,
        headers: { "Content-Type": "application/json" },
      });

      ApiClient.instance.interceptors.request.use(async (config) => {
        //attach access token to auth header
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });

      ApiClient.instance.interceptors.response.use(
        (res) => res,
        async (err: AxiosError) => {
          const originalRequest: any = err.config;

          // user is unauthorized, refresh access token if request not sent yet
          if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
              const refreshToken = await AsyncStorage.getItem("refreshToken");
              if (!refreshToken) throw new Error("No refresh token found");

              const refreshRes = await axios.post(`${API_URL}/auth/refresh`, {
                refreshToken,
              });
              const { accessToken } = refreshRes.data.data;
              await AsyncStorage.setItem("accessToken", accessToken);

              // retry original
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return ApiClient.instance(originalRequest);
            } catch (refreshErr) {
              console.warn("[ApiClient] Refresh token invalid. Logging out...");
              await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
              // emit event or navigate to login
              return Promise.reject(refreshErr);
            }
          }

          // Network error: if request is write, queue it into device local db to flush back when connectivity is back
          const net = await NetInfo.fetch();
          const isWrite = ["post", "put", "patch", "delete"].includes(
            (originalRequest.method || "").toLowerCase()
          );

          // Offline -> write requests to queue
          if (isWrite && (!net.isConnected || !net.isInternetReachable)) {
            await OfflineQueueManager.enqueue({
              method: originalRequest.method!,
              url: originalRequest.url!,
              body: originalRequest.data
                ? JSON.stringify(originalRequest.data)
                : undefined,
              headers: originalRequest.headers
                ? JSON.stringify(originalRequest.headers)
                : undefined,
            });

            console.log("[ApiClient] Request queued offline in SQLite");
            return Promise.resolve({
              data: {
                ok: false,
                offline: true,
                message: "Request saved to offline queue",
              },
            });
          }

          // Retry transient (5xx / 429) with exponential backoff
          if (
            err.response?.status &&
            (err.response.status >= 500 || err.response.status === 429)
          ) {
            const retries = originalRequest._retries || 0;
            if (retries < 3) {
              originalRequest._retries = retries + 1;
              const delay = 1000 * 2 ** retries + Math.random() * 500; // jitter
              await new Promise((r) => setTimeout(r, delay));
              return ApiClient.instance(originalRequest);
            }
          }

          //  If unrecoverable just reject
          return Promise.reject(err);
        }
      );
    }

    return ApiClient.instance;
  }
}
