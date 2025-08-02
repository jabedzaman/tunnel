/**
 *
 * @param error - The error object to handle
 * @returns throws an error with the message from the error response
 */
export const handleApiError = (error: any) => {
  throw new Error(error.response.data.error);
};
