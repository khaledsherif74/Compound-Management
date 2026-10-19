import i18n from '@/config/i18n';

/** Error carrying the HTTP status and the backend's message. statusCode 0 means no response. */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/** Converts any axios failure into an ApiError ({ statusCode, message }). */
export const normalizeApiError = error => {
  if (error instanceof ApiError) return error;
  const response = error?.response;
  if (!response) return new ApiError(0, i18n.t('errors.network'));
  return new ApiError(response.status, response.data?.message || i18n.t('errors.unknown'));
};

/** Message safe to show in a toast or inline alert. */
export const getErrorMessage = error => error?.message || i18n.t('errors.unknown');
