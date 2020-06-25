import { ExtrinsicPQ } from "./Interfaces.ts";
import { Node } from "./Utilities.ts";
import { RemoveFromEmptyError, NoElementError } from "./Errors.ts";

/**
 * A reference implementation of a priority queue.
 * 
 * Inefficient, but works. Used to verify integrity and evaluate performance
 * of better priority queue implementations.
 */
export class ReferencePQ<T> implements ExtrinsicPQ<T> {
  private _nodes: Array<Node<T>>;
  private _max: boolean;

  /**
   * Constructs a priority queue.
   * 
   * If the parameter 'isMax' is 'true', will be a maximum priority queue.
   * If not, will default to a minimum priority queue.
   * 
   * @param isMax whether to make a maximum priority queue or not
   */
  constructor(isMax?: boolean) {
    this._nodes = new Array<Node<T>>();
    this._max = isMax ? true : false;
  }

  add(item: T, priority: number): void {
    if (this._max) {
      priority *= -1;
    }
    this._nodes.push(new Node(item, priority));
  }

  contains(item: T): boolean {
    for (let i: number = 0; i < this._nodes.length; i++) {
      if (this._nodes[i].item === item) {
        return true;
      }
    }
    return false;
  }

  get(): T {
    if (this.size() === 0) {
      // TODO: Maybe define a new class of error for this
      throw new RemoveFromEmptyError();
    }
    let minPriority: number = this._nodes[0].priority;
    let minItem: T = this._nodes[0].item;
    for (let i: number = 1; i < this._nodes.length; i++) {
      if (this._nodes[i].priority < minPriority) {
        minPriority = this._nodes[i].priority;
        minItem = this._nodes[i].item;
      }
    }
    return minItem;
  }

  remove(): T {
    if (this.size() === 0) {
      throw new RemoveFromEmptyError();
    }
    let index: number = this._indexOf(this.get());
    return this._nodes.splice(index, 1)[0].item;
  }

  changePriority(item: T, priority: number): void {
    if (this.contains(item) === false) {
      throw new NoElementError();
    }
    if (this._max) {
      priority *= -1;
    }
    this._nodes[this._indexOf(item)].priority = priority;
  }

  size(): number {
    return this._nodes.length;
  }

  private _indexOf(item: T): number {
    for (let i: number = 0; i < this._nodes.length; i++) {
      if (this._nodes[i].item === item) {
        return i;
      }
    }
    throw new NoElementError();
  }
}
