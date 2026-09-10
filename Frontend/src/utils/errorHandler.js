export const getApiErrorMessage = (
  error,
  fallback = "Something went wrong.",
) => {
  if (!error) {
    return fallback;
  }

  if (!error.response) {
    return "Unable to connect to the server.";
  }

  const status = error.response.status;

  switch (status) {
    case 400:
      return "Invalid request.";

    case 401:
      return "Your session has expired. Please login again.";

    case 403:
      return "You are not authorized to perform this action.";

    case 404:
      return "The requested resource was not found.";

    case 409:
      return "This operation conflicts with existing data.";

    case 413:
      return "The selected file is too large.";

    case 500:
      return "Something went wrong on the server.";

    default:
      return fallback;
  }
};
