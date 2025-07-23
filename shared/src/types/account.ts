// Account-related shared types

export interface Account {
  id: string;
  username: string;
  // Add more fields as needed (email, createdAt, etc.)
}

export interface AccountCreateRequest {
  username: string;
  password: string;
}

export interface AccountCreateResponse {
  success: boolean;
  message?: string;
  account?: Account;
} 