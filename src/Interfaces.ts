/**
 * Defines the behaviour of a double-ended queue (deque).
 */
export interface Deque<T> {
  /**
   * Adds an item of type T to the front of the deque.
   * @param item The item to add to the deque's front.
   */
  addFirst(item: T): void;

  /**
   * Adds an item of type T to the back of the deque.
   * @param item The item to add to the deque's back.
   */
  addLast(item: T): void;

  /**
   * Returns true if deque is empty, false otherwise.
   */
  isEmpty(): boolean;

  /**
   * Returns the number of items in the deque.
   */
  size(): number;

  /**
   * Prints the items in the deque from first to last, separated by a space.
   */
  printDeque(): void;

  /**
   * Removes and returns the item at the front of the deque.
   * 
   * If no such item exists, throws an error.
   * 
   */
  removeFirst(): T;

  /**
   * Removes and returns the item at the back of the deque.
   * 
   * If no such item exists, throws an error.
   */
  removeLast(): T;

  /**
   * Gets the item at the given index.
   * 
   * 0 is the front, 1 is the next item, and so forth. If no such item exists,
   * throws an error. Does not alter the deque.
   * @param index The index from which to get the item from.
   */
  get(index: number): T;
}

/**
 * Priority queue where objects have a priority that is provided
 * extrinsically.
 */
export interface ExtrinsicPQ<T> {

  /**
   * Adds an item with the given priority value.
   * 
   * If the item is alread present in the queue, throws an error.
   * 
   * @param item 
   * @param priority 
   */
  add(item: T, priority: number): void;

  /**
   * Returns 'true' if the PQ contains the given item.
   *
   * @param item The item to test membership of.
   * @return 'true' if the item is in the PQ; 'false' otherwise
   */
  contains(item: T): boolean;

  /**
   * Returns the minimum or maximum item.
   * 
   * Depends on if the priority queue is 'maximum' or 'minimum'.
   *
   * @return The minimum or maximum item.
   * @throws NoElementError if the PQ is empty.
   */
  get(): T;

  /**
   * Removes and returns the minimum or maximum item.
   * 
   * Depends on if the priority queue is 'maximum' or 'minimum'.
   *
   * @return The minimum or maximum item.
   * @throws NoElementError if the PQ is empty.
   */
  remove(): T;

  /**
   * Returns the number of items in the queue.
   *
   * @return The number of items in the queue.
   */
  size(): number;

  /**
   * Changes the priority of the given item.
   * 
   * Updates the queue accordingly to account for te change.
   *
   * @param item     The item to modify the priority of.
   * @param priority The new priority to set 'item' to.
   * @throws NoElementError if the item doesn't exist.
   */
  changePriority(item: T, priority: number): void;
}
