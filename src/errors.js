export class SassDocError extends Error {
  constructor (message) {
    super(message)
    this.message = message // rm when native class support.
  }

  get name () {
    return 'SassDocError'
  }
}

export class Warning extends SassDocError {
  constructor (message) {
    super(message)
    this.message = message // rm when native class support.
  }

  get name () {
    return 'Warning'
  }
}
