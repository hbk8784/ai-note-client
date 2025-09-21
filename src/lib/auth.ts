import { apiService } from "./api";

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export const auth = {
  async signUp(userData: SignUpData): Promise<{ message: string; user: User }> {
    try {
      const response = (await apiService.register(userData)) as {
        message: string;
        user: User;
      };
      return response;
    } catch (error) {
      throw error;
    }
  },

  async signIn(credentials: SignInData): Promise<AuthResponse> {
    try {
      const response = (await apiService.login(credentials)) as AuthResponse;

      // Store token and user data
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      return response;
    } catch (error) {
      throw error;
    }
  },

  async signOut() {
    // Clear localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  // Get current user from localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  },

  // Get user ID
  getUserId(): string | null {
    const user = this.getCurrentUser();
    return user?.id || null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem("authToken");
  },

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem("authToken");
  },
};
