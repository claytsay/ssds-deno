/**
 * Represents an index-out-of-bounds error.
 */
export class IndexOutOfBoundsError extends RangeError {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Error when one tries to remove from an empty structure.
 */
export class RemoveFromEmptyError extends RangeError {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Error when one tries to get a non-existent element.
 */
export class NoElementError extends ReferenceError {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
