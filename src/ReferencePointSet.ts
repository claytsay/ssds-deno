/**
 * A k-d tree implementation used for testing purposes.
 * 
 * Works, but is really slow (linear time).
 */
export class ReferencePointSet {
  // = = = = = = = = = = = = =
  // CLASS/INSTANCE VARIABLES
  // = = = = = = = = = = = = =

  private _points: Array<Array<number>>;

  // = = = = = = = = = = = = =
  // CONSTRUCTORS
  // = = = = = = = = = = = = =

  constructor(points: Array<Array<number>>) {
    if (points.length < 1) {
      // TODO: Maybe a better error?
      throw new Error("need at least one point in the tree");
    }
    this._points = new Array<Array<number>>();
    points.forEach((point) => this._points.push([...point]));
  }

  // = = = = = = = = = = = = =
  // PUBLIC METHODS
  // = = = = = = = = = = = = =

  nearest(point: Array<number>): Array<number> {
    let nearestPoint: Array<number> | null = null;
    let nearestDistance: number = Infinity;
    for (let i: number = 0; i < this._points.length; i++) {
      let existingPoint: Array<number> = this._points[i];
      let distance: number = 0.0;
      for (let j: number = 0; j < existingPoint.length; j++) {
        distance += Math.pow(existingPoint[j] - point[j], 2);
      }
      if (distance < nearestDistance) {
        nearestPoint = existingPoint;
        nearestDistance = distance;
      }
    }
    if (nearestPoint === null) {
      throw new Error("no nearest point");
    }
    return nearestPoint;
  }
}
