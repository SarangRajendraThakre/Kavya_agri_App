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
    $otp: String!,
    
  ) {
    verifyOtpAndRegister(
      input: {
        email: $email,
        otp: $otp,
       
      }
    ) {
      user{id email role}
      success
      message
      accessToken
      refreshToken
      purpose
    }
  }
`;
