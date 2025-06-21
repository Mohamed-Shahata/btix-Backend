export class AppError extends Error {
  status: number;
  error: Object;
  constructor(message: any, status: number, error?: Object) {
    super(message);
    this.status = status || 500;
    this.error = error || {};
  }
}