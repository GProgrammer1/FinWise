import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { ApiClient } from "../api/ApiClient";
import type {
  LoginFormData,
  SignupStep1FormData,
  SignupStep2ParentFormData,
} from "../utils/validation/authSchemas";

// Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  role: "PARENT" | "CHILD";
  name: string;
  email: string;
  password: string;
  // PARENT only fields
  country?: string;
  numberOfChildren?: number;
  monthlyIncomeBase?: number;
  monthlyRentBase?: number;
  monthlyLoansBase?: number;
  otherNotes?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword?: string; // Remove before sending
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string; // Remove before sending
}

// Response types
export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  message?: string;
  data?: {
    accessToken: string;
  };
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}

/**
 * Auth Service - Handles all authentication-related API calls
 */
export class AuthService {
  private static api = ApiClient.getInstance();
  private static readonly BASE_PATH = "/auth";

  /**
   * Login with email and password
   */
  static async login(credentials: LoginFormData): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>(
      `${this.BASE_PATH}/login`,
      {
        email: credentials.email,
        password: credentials.password,
      }
    );

    // Store tokens if login successful
    if (response.data.success && response.data.data) {
      console.log(
        "[AuthService] Login successful - Storing tokens in AsyncStorage"
      );
      await AsyncStorage.setItem("accessToken", response.data.data.accessToken);
      await AsyncStorage.setItem(
        "refreshToken",
        response.data.data.refreshToken
      );
      console.log(
        "[AuthService] Access token stored (length:",
        response.data.data.accessToken.length,
        ")"
      );
      console.log(
        "[AuthService] Refresh token stored (length:",
        response.data.data.refreshToken.length,
        ")"
      );
    }

    return response.data;
  }

  /**
   * Register a new user
   * Supports multipart/form-data for PARENT role with ID image upload
   */
  static async signup(
    step1Data: SignupStep1FormData,
    step2Data?: SignupStep2ParentFormData,
    idImage?: { uri: string; type: string; name: string }
  ): Promise<AuthResponse> {
    // Combine step 1 and step 2 data
    const signupData: SignupRequest = {
      role: step1Data.role,
      name: step1Data.name,
      email: step1Data.email,
      password: step1Data.password,
      ...(step2Data || {}),
    };

    // Create FormData for multipart/form-data
    const formData = new FormData();

    // Add all signup data fields
    Object.entries(signupData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "number") {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value);
        }
      }
    });

    // Add ID image if provided (required for PARENT role)
    if (idImage && step1Data.role === "PARENT") {
      // React Native FormData requires file object with uri, type, and name
      // Note: In React Native, uri can be a local file path (file://) or a remote URL
      formData.append("idImage", {
        uri: idImage.uri,
        type: idImage.type || "image/jpeg",
        name: idImage.name || "id-image.jpg",
      } as any);
    }

    // Use axios directly for multipart/form-data (bypass ApiClient which sets JSON header)
    const axios = (await import("axios")).default;

    const token = await AsyncStorage.getItem("accessToken");
    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // For React Native FormData, axios needs special handling
    // Don't set Content-Type - FormData will set it with the correct boundary
    const response = await axios.post(
      `${API_URL}${this.BASE_PATH}/signup`,
      formData,
      {
        headers,
        // Important: Don't transform FormData - let it be sent as-is
        transformRequest: [],
      }
    );

    // Store tokens if signup successful
    const responseData = response.data as AuthResponse;
    if (responseData.success && responseData.data) {
      console.log(
        "[AuthService] Signup successful - Storing tokens in AsyncStorage"
      );
      await AsyncStorage.setItem("accessToken", responseData.data.accessToken);
      await AsyncStorage.setItem(
        "refreshToken",
        responseData.data.refreshToken
      );
      console.log(
        "[AuthService] Access token stored (length:",
        responseData.data.accessToken.length,
        ")"
      );
      console.log(
        "[AuthService] Refresh token stored (length:",
        responseData.data.refreshToken.length,
        ")"
      );
    }

    return responseData;
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(
    refreshToken?: string
  ): Promise<RefreshTokenResponse> {
    const token = refreshToken || (await AsyncStorage.getItem("refreshToken"));

    console.log("[AuthService] Refresh token check:");
    console.log("[AuthService] Refresh token present:", token ? "YES" : "NO");
    if (token) {
      console.log("[AuthService] Refresh token length:", token.length);
    }

    if (!token) {
      console.error("[AuthService] No refresh token available");
      throw new Error("No refresh token available");
    }

    const response = await this.api.post<RefreshTokenResponse>(
      `${this.BASE_PATH}/refresh`,
      { refreshToken: token }
    );

    // Update stored access token if refresh successful
    if (response.data.success && response.data.data) {
      console.log(
        "[AuthService] Token refresh successful - Storing new access token"
      );
      await AsyncStorage.setItem("accessToken", response.data.data.accessToken);
      console.log(
        "[AuthService] New access token stored (length:",
        response.data.data.accessToken.length,
        ")"
      );
    }

    return response.data;
  }

  /**
   * Logout user and clear tokens
   */
  static async logout(): Promise<LogoutResponse> {
    try {
      // Call logout endpoint to invalidate tokens on server
      const response = await this.api.post<LogoutResponse>(
        `${this.BASE_PATH}/logout`
      );

      // Clear tokens regardless of API response
      console.log("[AuthService] Logout - Clearing tokens from AsyncStorage");
      await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
      console.log("[AuthService] Tokens cleared");

      return response.data;
    } catch (error) {
      // Even if API call fails, clear local tokens
      console.log(
        "[AuthService] Logout error - Clearing tokens from AsyncStorage"
      );
      await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
      console.log("[AuthService] Tokens cleared after error");
      throw error;
    }
  }

  /**
   * Request password reset email
   */
  static async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const response = await this.api.post<ForgotPasswordResponse>(
      `${this.BASE_PATH}/forgot-password`,
      { email }
    );

    return response.data;
  }

  /**
   * Reset password with token from email
   */
  static async resetPassword(
    data: ResetPasswordRequest
  ): Promise<AuthResponse> {
    // Remove confirmPassword before sending
    const { confirmPassword, ...resetData } = data;

    const response = await this.api.post<AuthResponse>(
      `${this.BASE_PATH}/reset-password`,
      resetData
    );

    // Store tokens if reset successful
    if (response.data.success && response.data.data) {
      await AsyncStorage.setItem("accessToken", response.data.data.accessToken);
      await AsyncStorage.setItem(
        "refreshToken",
        response.data.data.refreshToken
      );
    }

    return response.data;
  }

  /**
   * Change password for authenticated user
   */
  static async changePassword(
    data: ChangePasswordRequest
  ): Promise<LogoutResponse> {
    // Remove confirmPassword before sending
    const { confirmPassword, ...changeData } = data;

    const response = await this.api.post<LogoutResponse>(
      `${this.BASE_PATH}/change-password`,
      changeData
    );

    return response.data;
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(token: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>(
      `${this.BASE_PATH}/verify-email`,
      { token }
    );

    // Store tokens if verification successful
    if (response.data.success && response.data.data) {
      await AsyncStorage.setItem("accessToken", response.data.data.accessToken);
      await AsyncStorage.setItem(
        "refreshToken",
        response.data.data.refreshToken
      );
    }

    return response.data;
  }

  /**
   * Resend verification email
   */
  static async resendVerificationEmail(
    email: string
  ): Promise<ForgotPasswordResponse> {
    const response = await this.api.post<ForgotPasswordResponse>(
      `${this.BASE_PATH}/resend-verification`,
      { email }
    );

    return response.data;
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser(): Promise<AuthResponse["data"]> {
    const response = await this.api.get<AuthResponse>(`${this.BASE_PATH}/me`);

    return response.data.data;
  }

  /**
   * Check if user is authenticated (has valid token)
   */
  static async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem("accessToken");
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    console.log("[AuthService] isAuthenticated check:");
    console.log("[AuthService] Access token present:", token ? "YES" : "NO");
    console.log(
      "[AuthService] Refresh token present:",
      refreshToken ? "YES" : "NO"
    );
    return !!token;
  }

  /**
   * Clear all stored tokens (for logout without API call)
   */
  static async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
  }

  /**
   * Get stored access token
   */
  static async getAccessToken(): Promise<string | null> {
    const token = await AsyncStorage.getItem("accessToken");
    console.log(
      "[AuthService] getAccessToken - Token present:",
      token ? "YES" : "NO"
    );
    if (token) {
      console.log("[AuthService] Access token length:", token.length);
    }
    return token;
  }

  /**
   * Get stored refresh token
   */
  static async getRefreshToken(): Promise<string | null> {
    const token = await AsyncStorage.getItem("refreshToken");
    console.log(
      "[AuthService] getRefreshToken - Token present:",
      token ? "YES" : "NO"
    );
    if (token) {
      console.log("[AuthService] Refresh token length:", token.length);
    }
    return token;
  }
}
