import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3001';

class ApiService {
    private getToken: () => Promise<string | null>

    constructor(getToken: () => Promise<string | null>) {
        this.getToken = getToken;
    }

    async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
        const token = await this.getToken();

        const config: RequestInit = {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options
        }

        // add jwt token to request header
        if (token) {
            (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "HTTP Error");
        }

        return response.json()
    }

    async get(endpoint: string): Promise<Response> {
        return this.makeRequest(endpoint, { method: "GET" });
    }

    async post(endpoint: string, data: any): Promise<Response> {
        return this.makeRequest(endpoint, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async put(endpoint: string, data: any): Promise<Response> {
        return this.makeRequest(endpoint, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    async delete(endpoint: string): Promise<Response> {
        return this.makeRequest(endpoint, { method: "DELETE" });
    }
}

export const useApiService = () => {
    const { getAccessToken } = useAuth();
    return new ApiService(getAccessToken);
}