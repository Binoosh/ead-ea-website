export function responseExtractError(err, fallbackMessage = "An unknown error occurred") {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    (typeof err?.response?.data === "string" ? err.response.data : null) ||
    err?.message ||
    fallbackMessage
  );
}