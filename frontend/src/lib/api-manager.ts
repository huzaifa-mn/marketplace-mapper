import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { API_ENDPOINTS, getApiBaseUrl } from "./api-endpoints";

const baseUrl = getApiBaseUrl();

// Create axios instance with default config
const apiManager = axios.create({
  baseURL: baseUrl,
  // ❌ don't force Content-Type here
  // headers: { "Content-Type": "application/json" },
});

// Custom logger function with formatted JSON
const apiLogger = {
  logRequest: (config: any) => {
    if (process.env.NODE_ENV === "development") {
      console.groupCollapsed(
        `🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );

      console.log("📤 Headers:", JSON.stringify(config.headers, null, 2));

      if (config.data) {
        if (config.data instanceof FormData) {
          console.log("📦 Request Data: [FormData]");
        } else {
          console.log("📦 Request Data:", JSON.stringify(config.data, null, 2));
        }
      }

      console.log(
        "⚙️ Config:",
        JSON.stringify(
          {
            baseURL: config.baseURL,
            timeout: config.timeout,
            withCredentials: config.withCredentials,
          },
          null,
          2
        )
      );
      console.groupEnd();
    }
  },

  logResponse: (response: any) => {
    if (process.env.NODE_ENV === "development") {
      console.groupCollapsed(
        `✅ API Response: ${response.status} ${response.statusText
        } - ${response.config.method?.toUpperCase()} ${response.config.url}`
      );
      console.log(
        "📥 Response Headers:",
        JSON.stringify(response.headers, null, 2)
      );
      console.log("📦 Response Data:", JSON.stringify(response.data, null, 2));
      console.log(
        "⚙️ Response Config:",
        JSON.stringify(
          {
            baseURL: response.config.baseURL,
            timeout: response.config.timeout,
          },
          null,
          2
        )
      );
      console.groupEnd();
    }
  },

  logError: (error: any) => {
    if (process.env.NODE_ENV === "development") {
      console.groupCollapsed(
        `❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url
        }`
      );

      if (error.response) {
        console.log(
          "🚨 Error Response:",
          JSON.stringify(
            {
              status: error.response.status,
              statusText: error.response.statusText,
              headers: error.response.headers,
              data: error.response.data,
            },
            null,
            2
          )
        );
      } else if (error.request) {
        console.log(
          "📡 No Response Received:",
          JSON.stringify(
            {
              request: error.request,
            },
            null,
            2
          )
        );
      } else {
        console.log("⚡ Error Message:", error.message);
      }

      console.log(
        "⚙️ Request Config:",
        JSON.stringify(
          {
            method: error.config?.method,
            url: error.config?.url,
            baseURL: error.config?.baseURL,
            headers: error.config?.headers,
            data:
              error.config?.data instanceof FormData
                ? "[FormData]"
                : error.config?.data,
          },
          null,
          2
        )
      );

      console.groupEnd();
    }
  },
};

// Request interceptor
apiManager.interceptors.request.use(
  (config) => {
    apiLogger.logRequest(config);
    return config;
  },
  (error) => {
    apiLogger.logError(error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiManager.interceptors.response.use(
  (response) => {
    apiLogger.logResponse(response);
    return response;
  },
  async (error) => {
    apiLogger.logError(error);
    return Promise.reject(error);
  }
);

/* ---------- Helper functions ON TOP of apiManager ---------- */

export const apiGet = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const res = await apiManager.get<T>(url, config);
  return res.data;
};

export const apiPostJson = async <T, B = unknown>(
  url: string,
  body: B,
  config?: AxiosRequestConfig
): Promise<T> => {
  const res = await apiManager.post<T>(url, body, {
    ...config,
    headers: {
      ...(config?.headers ?? {}),
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const apiPostFormData = async <T>(
  url: string,
  formData: FormData,
  config?: AxiosRequestConfig
): Promise<T> => {
  const res = await apiManager.post<T>(url, formData, {
    ...config,
    headers: {
      ...(config?.headers ?? {}),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getApiErrorMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<any>;

  if (axiosError.response?.data?.message) {
    return axiosError.response.data.message;
  }

  if (axiosError.message) return axiosError.message;

  return "Something went wrong. Please try again.";
};

export default apiManager;
