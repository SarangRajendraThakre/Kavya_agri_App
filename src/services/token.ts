// src/services/token.ts (or authApi.ts)
import axios from 'axios';
import { API_GRAPHQL_ENDPOINT } from '../utils/Constants';
// import { storage } from '../utils/storage'; // Assuming MMKV is accessible, if still needed here

// Define interfaces for better type safety
interface User {
  id: string;
  emailId: string; // <--- Change this if backend returns 'emailId'
  role: string;
  // Add other user properties if they exist, e.g., appId?: string;
}

interface RefreshTokenResponseData {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
  purpose: string;
}

interface GraphQLResponse {
  data?: { // Make data property optional as errors might be present instead
    refreshAccessToken: RefreshTokenResponseData;
  };
  errors?: Array<{ message: string; locations?: any[]; path?: string[] }>;
}

/**
 * Refreshes authentication tokens by sending a GraphQL mutation to the API endpoint.
 * Uses Axios for making the HTTP request.
 *
 * @param refreshToken The current refresh token.
 * @returns An object indicating success, message, and new tokens/user data if successful.
 */
export const refreshAuthTokens = async (refreshToken: string) => {
  try {
    // Use axios.post to send the GraphQL mutation
    const response = await axios.post<GraphQLResponse>(
      API_GRAPHQL_ENDPOINT, // Use the imported constant for the endpoint URL
      {
        query: `
          mutation RefreshAccessToken($input: RefreshTokenInput!) {
            refreshAccessToken(input: $input) {
              success
              message
              accessToken
              refreshToken
              user {
                id
                email
                role
              }
              purpose
            }
          }
        `,
        variables: {
          input: { refreshToken },
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          // No authorization header needed for refresh token endpoint itself,
          // as the refresh token is sent in the body.
        },
      }
    );

    // FIX: Explicitly type jsonResponse here
    const jsonResponse: GraphQLResponse = response.data;

    // Check for top-level GraphQL errors first
   if (jsonResponse.errors && jsonResponse.errors.length > 0) {
      console.error('GraphQL Errors during token refresh:', jsonResponse.errors); // <-- This logs the full array
      return { success: false, message: jsonResponse.errors[0].message || 'GraphQL error occurred' };
    }

    // Safely access refreshAccessToken using optional chaining and nullish coalescing
    const refreshData = jsonResponse.data?.refreshAccessToken;

    if (refreshData?.success) { // Use optional chaining here as refreshData might be undefined if no data property
      // You might want to save user details if they come back from refresh
      // storage.set('userEmail', refreshData.user.email);
      // storage.set('userId', refreshData.user.id);
      // storage.set('role', refreshData.user.role);
      // storage.set('appId', refreshData.user.appId); // Uncomment if appId is part of user

      return {
        success: true,
        message: refreshData.message,
        accessToken: refreshData.accessToken,
        refreshToken: refreshData.refreshToken,
        user: refreshData.user // If you want to use the updated user data
      };
    } else {
      // Handle cases where 'success' is false or refreshData is undefined
      return { success: false, message: refreshData?.message || 'Failed to refresh token' };
    }
  } catch (error) {
    // Axios errors have a specific structure
    if (axios.isAxiosError(error)) {
      console.error('Axios API Error during token refresh:', error.message);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        // Ensure error.response.data can be safely accessed for message
        return { success: false, message: (error.response.data as any)?.message || 'Server error during token refresh' };
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        return { success: false, message: 'No response from server. Network error.' };
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        return { success: false, message: 'Error setting up token refresh request.' };
      }
    } else {
      // Generic JavaScript error
      console.error('Unexpected error during token refresh:', error);
      return { success: false, message: 'An unexpected error occurred.' };
    }
  }
};