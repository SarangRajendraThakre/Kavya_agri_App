// Auth Mutations

export const REQUEST_OTP_MUTATION = `
  mutation RequestOtp($email: String!) {
    requestOtp(input: { email: $email }) {
      success
      message
      # No user, accessToken, or refreshToken expected here, as it's just an OTP request.
      # If you added 'purpose' to AuthPayload for this, you could include it:
      # purpose 
    }
  }
`;

export const VERIFY_OTP_MUTATION = `
  mutation VerifyOtpAndRegister(
    $email: String!,
    $otp: String!,
    # Add any other required input fields for registration/login here if needed.
    # For example, if you collect app ID at this stage: $appId: String
  ) {
    verifyOtpAndRegister(
      input: {
        email: $email,
        otp: $otp,
        # Map any other input variables here:
        # appId: $appId
      }
    ) {
      user {
        id
        email # Correct: Query for 'email' as per schema, not 'emailId'
        role
        # Include other user fields you want to receive:
        # userId
        # appId
        # referralCode
        # createdAt
        # updatedAt
      }
      success
      message
      accessToken
      refreshToken
      purpose # Ensure this is an enum in your schema (e.g., LOGIN_COMPLETE, REGISTRATION_COMPLETE)
    }
  }
`;

// Profile Details Mutation

export const CREATE_PROFILE_MUTATION = `
  mutation CreateOrUpdateProfileDetails($input: CreateProfileDetailsInput!) {
    createOrUpdateProfileDetails(input: $input) {
      # It's good practice to query for 'id' as well, which maps to MongoDB's _id
      id
      userId
      salutation
      firstName
      lastName
      mobileNo
      whatsAppNumber
      email # Correct: Query for 'email' as per schema, not 'emailId'
      dateOfBirth
      gender
      residenceCity
      education
      collegeName
      collegeCityVillage
      createdAt
      updatedAt # Often useful to query for the updated timestamp too
    }
  }
`;

// --- (Optional) Refresh Token Mutation - Add this if you haven't already ---
// This is the query string that was causing the 'emailId' error previously if not updated.
export const REFRESH_TOKEN_MUTATION = `
  mutation RefreshAccessToken($input: RefreshTokenInput!) {
    refreshAccessToken(input: $input) {
      success
      message
      accessToken
      refreshToken
      user {
        id
        email # Make sure this is 'email' to match your User type in the schema
        role
        # Include other user fields you want to receive
        # userId
        # appId
      }
      purpose # Ensure this is an enum in your schema (e.g., TOKEN_REFRESHED)
    }
  }
`;


export const GET_PROFILE_QUERY = `
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

