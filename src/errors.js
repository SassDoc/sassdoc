export class Error extends this.Error {
  constructor(message) {
    super(message);
    this.message = message;
  }
}

export class Warning extends Error {
  constructor(message) {
    super(message);
    this.message = message;
  }

  get name() {
    return 'Warning';
  }
}
