export class SassDocError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
  }

  get name() {
    return 'SassDocError';
  }
}

export class Warning extends SassDocError {
  constructor(message) {
    super(message);
    this.message = message;
  }

  get name() {
    return 'Warning';
  }
}
