import { Deque } from "./Interfaces.ts";
import { IndexOutOfBoundsError } from "./Errors.ts";

/**
 * A deque implementation using an array as its principle data structure.
 */
export class ArrayDeque<T> implements Deque<T> {
  // = = = = = = = = = = =
  // Instance Attributes
  // = = = = = = = = = = =

  private _array: Array<T | null>;
  /** Always null. Always counterclockwise to _tail.*/
  private _head: number;
  /** Always null. Always clockwise to _head.*/
  private _tail: number;

  // = = = = = = = = = = =
  // Constructor
  // = = = = = = = = = = =

  /**
   * Creates a new ArrayDeque.
   * 
   * If 'other' is not specified, will make an empty ArrayDeque.
   * Otherwise, makes a deep copy of 'other'.
   * 
   * @param other an ArrayDeque to make a deep copy of.
   */
  constructor(other?: ArrayDeque<T>) {
    if (other) {
      this._array = new Array<T>(other._array.length);
      for (let i: number = 0; i < other._array.length; i++) {
        // TODO: Optimize this code
        let val: T | null = other._array[i];
        let valType: string = typeof (val);
        if (valType === "object") {
          this._array[i] = Object.assign({}, val);
        } else {
          this._array[i] = val;
        }
      }
      this._head = other._head;
      this._tail = other._tail;
    } else {
      this._array = new Array<T>(2);
      this._head = 0;
      this._tail = this._array.length - 1;
    }
    return this;
  }

  // = = = = = = = = = = =
  // Deque Information
  // = = = = = = = = = = =

  get(index: number): T {
    if (0 <= index && index < this.size()) {
      index = this._normaliseIndex(this._head - 1 - index);
      let value: T | null = this._array[index];
      if (value === null) {
        throw new Error("attempted to get null element");
      }
      return value;
    } else {
      throw new IndexOutOfBoundsError();
    }
  }

  size(): number {
    if (this._head > this._tail) {
      return this._head - this._tail - 1;
    } else {
      return this._head + (this._array.length - this._tail - 1);
    }
  }

  // TODO: Change this to the correct toString method or something
  printDeque(): void {
    // for (int i = 0; i < this.size(); i++) {
    //     System.out.print(this.get(i).toString() + " ");
    // }
    // System.out.println();
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  // = = = = = = = = = = =
  // Deque Manipulation
  // = = = = = = = = = = =

  addFirst(item: T): void {
    this._resize(this.size() + 1);
    this._set(this._head, item);
    this._head = this._normaliseIndex(this._head + 1);
  }

  addLast(item: T): void {
    this._resize(this.size() + 1);
    this._set(this._tail, item);
    this._tail = this._normaliseIndex(this._tail - 1);
  }

  removeFirst(): T {
    if (this.size() == 0) {
      throw new Error("cannot remove from empty deque");
    }
    this._head = this._normaliseIndex(this._head - 1);
    let original: T | null = this._set(this._head, null);
    if (original === null) {
      throw new Error("attempted to remove null element");
    }
    this._resize(this.size());
    return original;
  }

  removeLast(): T {
    if (this.size() == 0) {
      throw new Error("cannot remove from empty deque");
    }
    this._tail = this._normaliseIndex(this._tail + 1);
    let original: T | null = this._set(this._tail, null);
    if (original === null) {
      throw new Error("attempted to remove null element");
    }
    this._resize(this.size());
    return original;
  }

  // = = = = = = = = = = =
  // Private Utility Methods
  // = = = = = = = = = = =

  /**
   * Resizes the array depending on what its new size needs to be.
   * 
   * Algorithm/mechanism is heavily inspired by the CPython implementation 
   * of lists.
   */
  private _resize(newSize: number): void {
    let newAlloc: number = 0;
    newSize += 2; // Allocate room for head/tail indices.
    if (newSize > this._array.length) {
      newAlloc = newSize + (newSize >> 3) + (newSize < 9 ? 3 : 6);
    } else if (newSize < (0.5 * this._array.length)) {
      newAlloc = (newSize < 2 ? 2 : newSize);
    } else {
      return;
    }

    let newArray: Array<T> = new Array<T>(newAlloc);
    for (let i: number = 0; i < this.size(); i++) {
      newArray[this.size() - 1 - i] = this.get(i);
    }
    this._head = this.size();
    this._tail = newArray.length - 1;
    this._array = newArray;
  }

  /**
   * Sets a "box" in this._array to a certain reference/value.
   * 
   * Not "index-safe" (i.e. will not check to see if the index is acceptable).
   *
   * @param index the index into which to insert the item.
   * @param item  the item to put in the array.
   * @return the object initially at _this.array[index].
   */
  private _set(index: number, item: T | null): T | null {
    let original: T | null = this._array[index];
    this._array[index] = item;
    return original;
  }

  /**
   * Normalises and index so that it is within this._array.length.
   * 
   * Handles negative indices and those that are greater than the array length 
   * via "wrapping" around the array in a circle.
   *
   * @param index the index to be normalised.
   * @return the value of the changed index (this method is non-destructive).
   */
  private _normaliseIndex(index: number): number {
    while (index < 0) {
      index += this._array.length;
    }
    while (index >= this._array.length) {
      index -= this._array.length;
    }
    return index;
  }
}
