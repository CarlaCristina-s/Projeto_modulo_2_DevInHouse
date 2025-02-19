class AppError extends Error {
  public statusCode;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default AppError;
