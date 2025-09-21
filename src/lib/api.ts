const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem("authToken");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAuthToken();

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth API methods
  async register(userData: { name: string; email: string; password: string }) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async verifyEmail(token: string) {
    return this.request(`/api/auth/verify-email?token=${token}`, {
      method: "GET",
    });
  }

  async forgotPassword(email: string) {
    return this.request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  }

  async getProfile() {
    return this.request("/api/auth/profile", {
      method: "GET",
    });
  }

  // Notes API methods
  async createNote(noteData: {
    title: string;
    content: string;
    color: string;
    date: string;
  }) {
    return this.request("/api/notes", {
      method: "POST",
      body: JSON.stringify(noteData),
    });
  }

  async getNotes() {
    return this.request("/api/notes", {
      method: "GET",
    });
  }

  async updateNote(
    noteId: string,
    updateData: {
      title: string;
      content: string;
    }
  ) {
    return this.request(`/api/notes/${noteId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  async deleteNote(noteId: string) {
    return this.request(`/api/notes/${noteId}`, {
      method: "DELETE",
    });
  }

  async generateSummary(content: string) {
    return this.request("/api/notes/summary", {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  }
}

export const apiService = new ApiService();
