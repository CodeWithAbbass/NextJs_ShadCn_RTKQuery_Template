interface ApiError {
    error?: {
        data?: {
            body?: {
                message?: string;
            };
            error?: {
                message?: string;
            };
            message?: string;
        };
        status?: string;
    };
    request?: unknown; // Specify a more precise type if known
    message?: string; // General error message
}

const handleApiError = (err: ApiError): { message: string } => {
    if (err?.error?.data?.body?.message) {
        return { message: err.error.data.body.message };
    }
    if (err?.error?.data?.error?.message) {
        return { message: err.error.data.error.message };
    }
    if (err?.error?.status === "FETCH_ERROR") {
        return { message: "Fetch error occurred" };
    }
    if (err.request) {
        return { message: err.message || "Request error" };
    }
    if (err?.error?.data?.message) {
        return { message: err.error.data.message };
    }
    if (err) {
        return { message: err.message || "Unknown error" };
    }
    // Something happened in setting up the request that triggered an Error
    return { message: "Error setting up the request" };
};

export default handleApiError;
