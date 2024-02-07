class APIError extends Error {
  constructor(message: string, public code: number) {
    super(message);
  }
}

export default APIError;
