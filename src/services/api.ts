import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    createApi,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "@/store/slices/authSlice";
import handleApiError from "@/lib/handleApiError";
import { UserType } from "@/constants/Types";
import { ApiError } from "next/dist/server/api-utils";
interface RefreshResult {
    data: {
        user: UserType;
        accessToken: string;
        refreshToken: string;
    };
    // Add other properties as needed
}
const baseUrl =
    process.env.MODE === "production"
        ? process.env.NEXT_API_BASE_URL_PRO
        : process.env.NEXT_API_BASE_URL_DEV;
const baseQueryWithAccessToken = fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("accessToken"); // Access // Refresh Token
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithRefreshToken = fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
        const refreshToken = localStorage.getItem("refreshToken"); // Refresh Token
        if (refreshToken) {
            headers.set("authorization", `Bearer ${refreshToken}`);
        }
        return headers;
    },
});

const baseQueryWithReAuth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await baseQueryWithAccessToken(args, api, extraOptions);

    if (result?.error?.status === 401) {
        try {
            const refreshResult = await baseQueryWithRefreshToken(
                "/auth/refresh",
                api,
                extraOptions
            );

            if (refreshResult?.error?.status == 401) {
                api.dispatch(logOut());
            } else {
                const { user, accessToken, refreshToken } = (
                    refreshResult as RefreshResult
                )?.data;
                api.dispatch(setCredentials({ user }));
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
            }
        } catch (error) {
            const errMessage = handleApiError(error as ApiError);
            console.log(errMessage);
        }
    }
    return result;
};

// To use in Store and injectEndpoints.
export const authApi = createApi({
    tagTypes: ["AUTH"],
    reducerPath: "authApi",
    baseQuery: baseQueryWithReAuth,
    endpoints: () => ({}),
});

export const userApi = createApi({
    // tagTypes: ["PRINT_JOB"],
    reducerPath: "userApi",
    baseQuery: baseQueryWithAccessToken, // In User API's Access Token will not used, It used here because we don't want to create new baseQuery.
    endpoints: () => ({}),
});
