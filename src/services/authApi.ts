/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiError } from "next/dist/server/api-utils";
import { authApi } from "./api";
import handleApiError from "@/lib/handleApiError";

const api = authApi.injectEndpoints({
    endpoints: (builder) => ({
        // Query: <Response, Params> 
        fetchUser: builder.query<object, void>({
            query: () => ({
                url: "auth/user", // Adjust the endpoint URL as needed
                credentials: "include",
                method: "GET",
            }),
            providesTags: ["AUTH"], // For Automatic Refetch
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log("data", data);
                    // const { user } = data as any;
                    // dispatch(setCredentials({ user }));
                } catch (error) {
                    const errorMessage = handleApiError(error as ApiError);
                    console.log("errorMessage", errorMessage);
                }
            },
        }),
        login: builder.mutation({
            query: (userInfo) => ({
                url: "/auth/login",
                method: "POST",
                body: userInfo,
            }),
        }),
    }),
});

export const { useLoginMutation } = api;
