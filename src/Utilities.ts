/**
 * Contains various utility classes and methods.
 */

 /**
  * Represents a node in a priority queue.
  * 
  * Contains an item and a numeric priority.
  */
export class Node<T> {
  // - - - - - - - - - - - - -
  // Class/Instance Variables
  item: T;
  priority: number;

  // - - - - - - - - - - - - -
  // Constructor(s)
  constructor(item: T, priority: number) {
    this.item = item;
    this.priority = priority;
  }
}
