/**
 * Represents a generic response from an API route handler.
 */
export type ApiResponse<T> = {
  data: T,
  message?: string,
  ok: true,
} | {
  message: string,
  ok: false,
};