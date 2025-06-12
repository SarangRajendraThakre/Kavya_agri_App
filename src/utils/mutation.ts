// src/utils/mutation.ts (or src/graphql/definitions.ts)

// NOTE: These are plain string literals. If you are using Apollo Client,
// it is generally recommended to use `gql` from '@apollo/client' to parse
// these strings into ASTs (Abstract Syntax Trees) for better performance
// and tooling integration. However, as requested, they are kept as strings.

// Auth Mutations

export const REQUEST_OTP_MUTATION = `
  mutation RequestOtp($email: String!) {
    requestOtp(input: { email: $email }) {
      success
      message
    }
  }
`;

export const VERIFY_OTP_MUTATION = `
  mutation VerifyOtpAndRegister(
    $email: String!,
    $otp: String!
  ) {
    verifyOtpAndRegister(
      input: {
        email: $email,
        otp: $otp
      }
    ) {
      user {
        id
        email
        role
        isProfileCompleted
        appId
       
      }
      success
      message
      accessToken
      refreshToken
      purpose
       
    }
  }
`;

// Profile Details Mutations

export const CREATE_PROFILE_MUTATION = `
  mutation CreateOrUpdateProfileDetails($input: CreateProfileDetailsInput!) {
    createOrUpdateProfileDetails(input: $input) {
      id
      userId
      profileImage
      salutation
      firstName
      lastName
      mobileNo
      whatsAppNumber
      email
      dateOfBirth
      gender
      residenceCity
      education
      collegeName
      collegeCityVillage
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROFILE_DETAILS_QUERY = `
  query GetProfileDetails($userId: ID!) { # Or String! if your ID is a string
    getProfileDetails(userId: $userId) {
      id
      userId
      profileImage
      salutation
      firstName
      lastName
      mobileNo
      whatsAppNumber
      email
      dateOfBirth
      gender
      residenceCity
      education
      collegeName
      collegeCityVillage
      createdAt
      updatedAt
    }
  }
`;

export const MARK_PROFILE_COMPLETED_MUTATION = `
  mutation MarkProfileAsCompleted($emailId: String!) {
    markProfileAsCompleted(email: $emailId) {
      success
      message
      user {
        id
        email
        isProfileCompleted
      }
    }
  }
`;

// Refresh Token Mutation
export const REFRESH_TOKEN_MUTATION = `
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
`;

// Profile Details Query (using email)
// This is the one you provided and want to be exportable, using 'email'.


// If GET_PROFILE_QUERY (by userId) was truly distinct and needed for some reason,
// and you didn't mean for GET_PROFILE_DETAILS_QUERY to replace it, you'd keep it like this:
/*
export const GET_PROFILE_BY_USER_ID_QUERY = `
  query GetProfileDetails($userId: ID!) {
    getProfileDetails(userId: $userId) {
      id
      userId
      salutation
      firstName
      lastName
      mobileNo
      whatsAppNumber
      email
      dateOfBirth
      gender
      residenceCity
      education
      collegeName
      collegeCityVillage
      createdAt
      updatedAt
    }
  }
`;
*/