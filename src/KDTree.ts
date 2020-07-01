import { PointSet } from "./Interfaces.ts";
import { KDNode } from "./Utilities.ts";

export class KDTree implements PointSet {
  // = = = = = = = = = = = = =
  // CLASS/INSTANCE VARIABLES
  // = = = = = = = = = = = = =

  /**
   * A node at infinity that serves as a sentinel.
   */
  private _sentinel: KDNode;
  private _dimension: number;

  // = = = = = = = = = = = = =
  // CONSTRUCTORS
  // = = = = = = = = = = = = =

  /**
   * Constructs an instance of KDTree.
   * 
   * Throws an error if there is < 2 points in the set. Also, throws an
   * error if the point do not all have the same dimension.
   *
   * @param points The list of points to put in the set.
   */
  constructor(points: Array<Array<number>>) {
    if (points.length < 2) {
      // TODO: Maybe a better error?
      throw new Error("need at least two points in the tree");
    }

    // Initialize the sentinel node
    this._dimension = points[0].length;
    let inf_vector: Array<number> = new Array<number>(this._dimension);
    for (let i: number = 0; i < this._dimension; i++) {
      inf_vector[i] = Infinity;
    }
    this._sentinel = new KDNode(inf_vector, 0);

    // Add the rest of the points in
    let compDim: number;
    let pointer: KDNode;
    points.forEach((point) => {
      point = [...point];
      if (point.length !== this._dimension) {
        // TODO: Maybe custom error
        throw new Error("points are not of the same dimension");
      }
      pointer = this._sentinel;

      while (true) {
        if (pointer.compareTo(point) > 0) {
          if (pointer.lesserChild == null) {
            compDim = pointer.compDim + 1 === this._dimension
              ? 0
              : pointer.compDim + 1;
            pointer.lesserChild = new KDNode(point, compDim);
            break;
          } else {
            pointer = pointer.lesserChild;
          }
        } else {
          if (pointer.greaterChild == null) {
            compDim = pointer.compDim + 1 === this._dimension
              ? 0
              : pointer.compDim + 1;
            pointer.greaterChild = new KDNode(point, compDim);
            break;
          } else {
            pointer = pointer.greaterChild;
          }
        }
      }
    });
  }

  // = = = = = = = = = = = = =
  // PUBLIC METHODS
  // = = = = = = = = = = = = =

  /**
   * Returns the closest vector to the inputted coordinates.
   * 
   * Theoretically takes O(log(N)) time where N is the number of points.
   *
   * @param point the point to find the nearest point to.
   * @return The closest vector to the input coordinates.
   */
  nearest(point: Array<number>): Array<number> {
    return this._investigate(point, this._sentinel).vector;
  }

  // = = = = = = = = = = = = =
  // PRIVATE METHODS/CLASSES
  // = = = = = = = = = = = = =

  // - - - - - - - - - - - - -
  // Utility Methods
  // - - - - - - - - - - - - -

  /**
   * Investigates a branch of the k-d tree starting with a certain node.
   * 
   * Investigates a node and its children, finding the node closest to
   * the specified {@code query} location.
   *
   * @param query The point in question.
   * @param node  The node from which to start investigation.
   * @return The node closest to the given point.
   */
  private _investigate(query: Array<number>, node: KDNode): KDNode {
    // Handle a potentially common base case.
    if (node.lesserChild == null && node.greaterChild == null) {
      return node;
    }

    // Determine which child node is "good" (rectus) and which is "bad" (sinister).
    let rectusChild: KDNode | null;
    let sinisterChild: KDNode | null;
    if (node.compareTo(query) < 0) {
      rectusChild = node.greaterChild;
      sinisterChild = node.lesserChild;
    } else {
      rectusChild = node.lesserChild;
      sinisterChild = node.greaterChild;
    }

    // Begin the investigation.
    let closestChild: KDNode = node;
    let closestRadiusSquared: number = this._squaredDistance(
      node.vector,
      query,
    );

    // Investigate the "good" node first.
    let rectusCandidate: KDNode;
    if (rectusChild !== null) {
      rectusCandidate = this._investigate(query, rectusChild);
      let rectusRadiusSquared: number = this._squaredDistance(
        rectusCandidate.vector,
        query,
      );
      if (rectusRadiusSquared < closestRadiusSquared) {
        closestChild = rectusCandidate;
        closestRadiusSquared = rectusRadiusSquared;
      }
    }

    // Figure out if the other side needs to be investigated.
    let distToPlaneSquared: number = Math.pow(
      node.vector[node.compDim] - query[node.compDim],
      2,
    );
    let sinisterCandidate: KDNode;
    if (distToPlaneSquared <= closestRadiusSquared && sinisterChild != null) {
      sinisterCandidate = this._investigate(query, sinisterChild);
      let sinisterRadiusSquared: number = this._squaredDistance(
        sinisterCandidate.vector,
        query,
      );
      if (sinisterRadiusSquared < closestRadiusSquared) {
        closestChild = sinisterCandidate;
      }
    }

    return closestChild;
  }

  /**
   * Returns the distance between two vectors, squared.
   *
   * @param v1 The first vector.
   * @param v2 The second vector.
   * @return The Euclidean distance between the vectors, squared.
   * @throws Error If the vectors are of different dimensions.
   */
  private _squaredDistance(v1: Array<number>, v2: Array<number>): number {
    if (v1.length !== v2.length) {
      throw new Error("Vectors differ in dimension.");
    }
    let total: number = 0.0;
    for (let i: number = 0; i < v1.length; i++) {
      total += Math.pow(v1[i] - v2[i], 2);
    }
    return total;
  }
}
