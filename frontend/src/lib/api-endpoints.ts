export const getApiBaseUrl = (): string => {
  // Check if we are running on the server (SSR/Server Actions)
  if (typeof window === "undefined") {
    // Inside Docker, the frontend container talks to backend container via service name
    return process.env.INTERNAL_API_BASE_URL || "http://localhost:4000";
  }

  // On the client (Browser), we connect to the public exposed URL (localhost on host)
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
};

// Root API base
export const API_BASE_URL = `${getApiBaseUrl()}/api/v1`;

export const API_ENDPOINTS = {
  /** Marketplace template endpoints */
  MARKETPLACE_TEMPLATES: `${API_BASE_URL}/marketplace-templates`,
  MARKETPLACE_TEMPLATE_BY_ID: (id: number) =>
    `${API_ENDPOINTS.MARKETPLACE_TEMPLATES}/${id}`,

  /** Seller CSV endpoints */
  SELLER_FILES: `${API_BASE_URL}/seller-files`,
  SELLER_FILE_BY_ID: (id: number) => `${API_ENDPOINTS.SELLER_FILES}/${id}`,

  /** Mapping endpoints */
  MAPPINGS: `${API_BASE_URL}/mappings`,
  MAPPING_BY_ID: (id: number) => `${API_ENDPOINTS.MAPPINGS}/${id}`,
};
