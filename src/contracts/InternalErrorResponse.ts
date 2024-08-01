type ErrorItem = {
  message: string;
};

export type ErrorResponse = {
  error: ErrorItem;
};

export const InternalErrorResponse: ErrorResponse = {
  error: { message: 'Internal Server Error' },
};
