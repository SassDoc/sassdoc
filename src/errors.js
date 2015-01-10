export class SassDocError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
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
