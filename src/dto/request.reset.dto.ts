// request-reset.dto.ts
export class RequestResetDto {
  email: string;
}

// reset-password.dto.ts
export class ResetPasswordDto {
  token: string;
  newPassword: string;
}
