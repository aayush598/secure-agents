export class SDKError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'SDKError';
  }
}

export class UnauthorizedError extends SDKError {
  constructor() {
    super('Unauthorized', 401);
  }
}
