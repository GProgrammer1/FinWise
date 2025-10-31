import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { ApiClient } from "../api/ApiClient";
import type {
  LoginFormData,
  SignupFormData,
} from "../utils/validation/authSchemas";

// Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string; // Remove before sending
  agreeToTerms?: boolean; // Remove before sending
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
      await AsyncStorage.setItem("accessToken", response.data.data.accessToken);
      await AsyncStorage.setItem(
        "refreshToken",
        response.data.data.refreshToken
      );
    }

    return response.data;
  }

  /**
   * Register a new user
   */
  static async signup(data: SignupFormData): Promise<AuthResponse> {
    // Remove confirmPassword and agreeToTerms before sending
    const { confirmPassword, agreeToTerms, ...signupData } = data;

    const response = await this.api.post<AuthResponse>(
      `${this.BASE_PATH}/signup`,
      signupData
    );

    // Store tokens if signup successful
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
   * Refresh access token using refresh token
   */
  static async refreshToken(
    refreshToken?: string
  ): Promise<RefreshTokenResponse> {
    const token = refreshToken || (await AsyncStorage.getItem("refreshToken"));

    if (!token) {
      throw new Error("No refresh token available");
    }

    const response = await this.api.post<RefreshTokenResponse>(
      `${this.BASE_PATH}/refresh`,
      { refreshToken: token }
    );

    // Update stored access token if refresh successful
    if (response.data.success && response.data.data) {
      await AsyncStorage.setItem("accessToken", response.data.data.accessToken);
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
      await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);

      return response.data;
    } catch (error) {
      // Even if API call fails, clear local tokens
      await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
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
    return await AsyncStorage.getItem("accessToken");
  }

  /**
   * Get stored refresh token
   */
  static async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem("refreshToken");
  }
}
