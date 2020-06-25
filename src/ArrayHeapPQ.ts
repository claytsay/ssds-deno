import { ExtrinsicPQ } from "./Interfaces.ts";
import { RemoveFromEmptyError, NoElementError } from "./Errors.ts";
import { Node } from "./Utilities.ts";

enum Relation {
  PARENT,
  CHILD_LEFT,
  CHILD_RIGHT,
}

export class ArrayHeapPQ<T> implements ExtrinsicPQ<T> {
  // = = = = = = = = = = = = =
  // CLASS/INSTANCE VARIABLES
  // = = = = = = = = = = = = =

  private _nodes: Array<Node<T>>;
  private _locations: Map<T, number>;
  private _max: boolean;

  // = = = = = = = = = = = = =
  // CONSTRUCTOR
  // = = = = = = = = = = = = =

  /**
   * Constructs a priority queue.
   * 
   * If the parameter 'isMax' is 'true', will be a maximum priority queue.
   * If not, will default to a minimum priority queue.
   * 
   * @param isMax whether to make a maximum priority queue or not
   */
  constructor(isMax?: boolean) {
    this._nodes = new Array<Node<T>>(1);
    // this._nodes.push(null); // Invariant: First element is always null
    this._locations = new Map<T, number>();
    this._max = isMax ? true : false;
    return this;
  }

  // = = = = = = = = = = = = =
  // PUBLIC METHODS
  // = = = = = = = = = = = = =

  add(item: T, priority: number): void {
    if (this.contains(item)) {
      // TODO: Maybe change this to simply update the priority?
      throw new Error("Item already present.");
    }
    if (this._max) {
      priority *= -1;
    }
    this._nodes.push(new Node(item, priority));
    this._locations.set(item, this._nodes.length - 1);
    this._swim(this._nodes.length - 1);
  }

  contains(item: T): boolean {
    return this._locations.has(item);
  }

  get(): T {
    this._validateSize();
    return this._nodes[1].item;
  }

  remove(): T {
    this._validateSize();
    let smallest: Node<T>;
    if (this.size() === 1) {
      smallest = this._nodes.splice(1, 1)[0];
    } else {
      this._swap(1, this._nodes.length - 1);
      smallest = this._nodes.splice(this._nodes.length - 1, 1)[0];
      this._swim(1);
    }
    this._locations.delete(smallest.item);
    return smallest.item;
  }

  size(): number {
    return this._locations.size;
  }

  changePriority(item: T, priority: number): void {
    let index: number | undefined = this._locations.get(item);
    if (index === undefined) {
      throw new NoElementError(`item '${item}' does not exist`);
    }
    if (this._max) {
      priority *= -1;
    }
    this._nodes[index].priority = priority;
    this._swim(index);
  }

  // = = = = = = = = = = = = =
  // PRIVATE METHODS
  // = = = = = = = = = = = = =

  // - - - - - - - - - - - - -
  // Parent/Child Utility Methods
  // - - - - - - - - - - - - -

  /**
   * Determines whether the node at the given index has a given
   * relation or not.
   * 
   * If the provided Relation is invalid, will return 'false' by default.
   *
   * @param index    The index whose relation is to be queried.
   * @param relation The relation to be queried about.
   * @return 'true' if the relation node exists; 'false' otherwise.
   */
  private _hasRelation(index: number, relation: Relation): boolean {
    switch (relation) {
      case Relation.PARENT:
        return this._getRelationIndex(index, relation) !== 0;
      case Relation.CHILD_LEFT:
        return this._isValidIndex(this._getRelationIndex(index, relation));
      case Relation.CHILD_RIGHT:
        return this._isValidIndex(this._getRelationIndex(index, relation));
      default:
        return false;
    }
  }

  /**
   * Gets the index of the specified relation.
   * 
   * Is not safe (i.e. might cause an error by trying to access an index 
   * not present in the list of Nodes). If the given Relation is invalid,
   * returns 0.
   *
   * @param index    The index whose relation's index is to be queried.
   * @param relation The relation to be queried about.
   * @return The index of the specified relation of the given index.
   */
  private _getRelationIndex(index: number, relation: Relation): number {
    switch (relation) {
      case Relation.PARENT:
        return Math.floor(index / 2);
      case Relation.CHILD_LEFT:
        return index * 2 + 1;
      case Relation.CHILD_RIGHT:
        return index * 2;
      default:
        // TODO: Maybe make this throw an error
        return 0;
    }
  }

  /**
   * Gets the priority value of the specified relation.
   * 
   * If the relation is invalid (e.g. does not exist), will return positive 
   * infinity for the priority.
   *
   * @param index    The index whose relation's priority is to be queried.
   * @param relation The relation to be queried about.
   * @return The priority value of the specified relation to the given index.
   */
  private _getRelationPriority(index: number, relation: Relation): number {
    if (!this._hasRelation(index, relation)) {
      return Number.POSITIVE_INFINITY;
    } else {
      return this._nodes[this._getRelationIndex(index, relation)].priority;
    }
  }

  /**
   * Determines if the node should be swapped with its relation or not.
   * 
   * The method will return 'true' if the relation exists and comparison
   * of the priorities shows that the two should be swapped.
   *
   * @param index    The index whose relation's "swappiness" is to be queried.
   * @param relation The relation to be queried about.
   * @return Whether the node should be swapped with its relation.
   */
  private _shouldSwap(index: number, relation: Relation): boolean {
    let nodePriority: number = this._nodes[index].priority;
    let relationPriority: number = this._getRelationPriority(index, relation);
    if (this._hasRelation(index, relation)) {
      switch (relation) {
        case Relation.PARENT:
          return nodePriority < relationPriority;
        default:
          return nodePriority > relationPriority;
      }
    } else {
      return false;
    }
  }

  // - - - - - - - - - - - - -
  // Heap Manipulation Methods
  // - - - - - - - - - - - - -

  /**
   * Swaps the items at the specified indices of the list.
   *
   * @param i The index of one of the items to swap.
   * @param j The index of the other item to swap.
   */
  private _swap(i: number, j: number): void {
    [this._nodes[i], this._nodes[j]] = [this._nodes[j], this._nodes[i]];

    let iKey: T = this._nodes[i].item;
    let jKey: T = this._nodes[j].item;
    let tempIndex: number | undefined = this._locations.get(iKey);
    if (tempIndex === undefined) {
      throw new NoElementError("internal error: item has no location");
    }
    let tempIndex2: number | undefined = this._locations.get(jKey);
    if (tempIndex2 === undefined) {
      throw new NoElementError("internal error: item has no location");
    }
    this._locations.set(iKey, tempIndex2);
    this._locations.set(jKey, tempIndex);
  }

  /**
   * Attempts to swim a node to its correct position.
   *
   * @param index The index of the node to swim.
   */
  private _swim(index: number): void {
    let swapIndex: number;
    if (this._shouldSwap(index, Relation.PARENT)) {
      swapIndex = this._getRelationIndex(index, Relation.PARENT);
      this._swap(index, swapIndex);
      this._swim(swapIndex);
    } else if (
      this._shouldSwap(index, Relation.CHILD_LEFT) ||
      this._shouldSwap(index, Relation.CHILD_RIGHT)
    ) {
      let leftPriority: number = this._getRelationPriority(
        index,
        Relation.CHILD_LEFT,
      );
      let rightPriority: number = this._getRelationPriority(
        index,
        Relation.CHILD_RIGHT,
      );

      if (rightPriority < leftPriority) {
        swapIndex = this._getRelationIndex(index, Relation.CHILD_RIGHT);
        this._swap(index, swapIndex);
        this._swim(swapIndex);
      } else {
        swapIndex = this._getRelationIndex(index, Relation.CHILD_LEFT);
        this._swap(index, swapIndex);
        this._swim(swapIndex);
      }
    }
  }

  // - - - - - - - - - - - - -
  // Miscellaneous Utility Methods
  // - - - - - - - - - - - - -

  /**
   * Checks whether an index is acceptable or not.
   * 
   * Checks to verify that:
   * - The index is within the bounds of the list
   * - The reference at the index is not 'null'
   *
   * @param index The index to check acceptability of.
   * @return 'true' if the index is acceptable; 'false' otherwise.
   */
  private _isValidIndex(index: number): boolean {
    return 0 <= index && index < this._nodes.length &&
      this._nodes[index] !== null;
  }

  /**
   * Checks to see if the size of the queue is greater than zero.
   *
   * @throws NoSuchElementException if size() <= 0.
   */
  private _validateSize(): void {
    if (this.size() === 0) {
      // TODO: Maybe define a new class of error for this
      throw new RemoveFromEmptyError();
    }
  }
}
