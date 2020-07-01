/**
 * Contains various utility classes and methods.
 */

/**
 * Represents a node in a priority queue.
 * 
 * Contains an item and a numeric priority.
 */
export class PQNode<T> {
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

/**
 * Represents a node in a k-d tree.
 */
export class KDNode {
  // - - - - - - - - - - - - -
  // Class/Instance Variables
  vector: Array<number>;
  /**
   * The dimension with which the node "compares with."
   */
  compDim: number;
  lesserChild: KDNode | null;
  greaterChild: KDNode | null;

  // - - - - - - - - - - - - -
  // Constructor(s)
  constructor(vector: Array<number> , compDim: number) {
    this.vector = vector;
    this.compDim = compDim;
    this.lesserChild = null;
    this.greaterChild = null;
  }

  // - - - - - - - - - - - - -
  // Utility Methods
  compareTo(o: KDNode | Array<number>): number {
    let delta: number = 0;

    if (o instanceof KDNode) {
      let n: KDNode = o;
      delta = this.vector[this.compDim] - n.vector[n.compDim];
    } else if (o instanceof Array) {
      // FIXME: This seems kinda dangerous.
      let v: Array<number> = o;
      delta = this.vector[this.compDim] - v[this.compDim];
    } else {
      throw new Error("only accepts KDNode and Arary<number> objects");
    }

    // TODO: Figure this out
    return NaN; //Double.compare(delta, 0.0);
  }
}
