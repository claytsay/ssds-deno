import { Deque } from "./Interfaces.ts";
import { IndexOutOfBoundsError, RemoveFromEmptyError } from "./Errors.ts";

/**
 * Represents a link in a linked list.
 */
class Link<E> {
  next: Link<E>;
  item: E | null;
  prev: Link<E>;

  /**
   * Creates an instance of Link.
   * 
   * If either 'next' or 'prev' is not specified, those values are set so
   * that they point to the link itself.
   *
   * @param item The item "represented" by the link.
   * @param prev The previous ink in the linked list.
   * @param next The next link in the linked list.
   */
  constructor(item: E | null, prev?: Link<E>, next?: Link<E>) {
    this.item = item;
    this.prev = prev ? prev : this;
    this.next = next ? next : this;
  }
}

/**
 * A deque implementation using a linked list as its principle data structure.
 */
export class LinkedListDeque<T> implements Deque<T> {
  private _sentinel: Link<T>;
  private _length: number;

  // = = = = = = = = = = =
  // Constructor
  // = = = = = = = = = = =

  /**
   * Constructs a LinkedListDeque.
   * 
   * If 'other' is not specified, will make an empty LinkedListDeque.
   * Otherwise, makes a deep copy of 'other'.
   * 
   * @param other a LinkedListDeque to make a deep copy of.
   */
  constructor(other?: LinkedListDeque<T>) {
    this._sentinel = new Link<T>(null);
    this._length = 0;

    if (other) {
      let pointer: Link<T> = other._first();
      if (pointer === null) {
        return this;
      }
      while (pointer !== other._sentinel && pointer !== null) {
        let item: T | null = pointer.item;
        if (item !== null) {
          this.addLast(item);
        }
        if (pointer.next !== null) {
          pointer = pointer.next;
        }
      }
    }

    return this;
  }

  // = = = = = = = = = = =
  // Deque Information
  // = = = = = = = = = = =

  get(index: number): T {
    if (!this._isValidIndex(index)) {
      throw new IndexOutOfBoundsError();
    }

    let pointer: Link<T>;
    if (index < this._length / 2) {
      pointer = this._first();
      while (index !== 0 && pointer !== null) {
        pointer = pointer.next;
        index--;
      }
    } else {
      pointer = this._last();
      index = index - this._length + 1;
      while (index !== 0 && pointer !== null) {
        pointer = pointer.prev;
        index++;
      }
    }

    if (pointer.item !== null) {
      return pointer.item;
    } else {
      throw new Error("attempted to get null element");
    }
  }

  size(): number {
    return this._length;
  }

  // TODO: Replace with toString or something like that
  printDeque(): void {
    // let pointer: Link<T> = this._first();
    // while (pointer != this._sentinel) {
    //     System.out.print(pointer.item.toString() + " ");
    //     pointer = pointer.next;
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
    let link: Link<T> = new Link<T>(item, this._sentinel, this._sentinel.next);
    this._sentinel.next.prev = link;
    this._sentinel.next = link;
    this._length++;
  }

  addLast(item: T): void {
    let link: Link<T> = new Link<T>(item, this._sentinel.prev, this._sentinel);
    this._sentinel.prev.next = link;
    this._sentinel.prev = link;
    this._length++;
  }

  removeFirst(): T {
    if (this.isEmpty()) {
      throw new RemoveFromEmptyError("deque is empty");
    }
    let removed: Link<T> = this._first();
    removed.next.prev = this._sentinel;
    this._sentinel.next = removed.next;
    this._length--;
    if (removed.item !== null) {
      return removed.item;
    } else {
      throw new Error("attempted to get null element");
    }
  }

  removeLast(): T {
    if (this.isEmpty()) {
      throw new RemoveFromEmptyError("deque is empty");
    }
    let removed: Link<T> = this._last();
    removed.prev.next = this._sentinel;
    this._sentinel.prev = removed.prev;
    this._length--;
    if (removed.item !== null) {
      return removed.item;
    } else {
      throw new Error("attempted to get null element");
    }
  }

  // = = = = = = = = = = =
  // Private Utility Methods
  // = = = = = = = = = = =

  private _first(): Link<T> {
    return this._sentinel.next;
  }

  private _last(): Link<T> {
    return this._sentinel.prev;
  }

  /**
     * Determines if an index is valid or not.
     *
     * @return 'true' if the index is non-negative and less than this.length.
     */
  private _isValidIndex(index: number): boolean {
    return 0 <= index && index < this._length;
  }
}
