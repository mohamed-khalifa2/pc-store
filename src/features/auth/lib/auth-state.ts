export type AuthFieldErrors = {
  fullName?: string[];
  email?: string[];
  password?: string[];
};

export type AuthState = {
  status: "idle" | "error" | "success";
  message: string | null;
  fieldErrors: AuthFieldErrors;
};

export const initialAuthState: AuthState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export function authErrorState(message: string, fieldErrors: AuthFieldErrors = {}): AuthState {
  return { status: "error", message, fieldErrors };
}

export function authSuccessState(message: string): AuthState {
  return { status: "success", message, fieldErrors: {} };
}
