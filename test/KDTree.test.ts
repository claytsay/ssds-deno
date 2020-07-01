import { KDTree } from "../src/KDTree.ts";
import { ReferencePointSet } from "../src/ReferencePointSet.ts";
import { PointSet } from "../src/Interfaces.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

Deno.test("KDTree.testReferencePointSet", () => {
  let p1: Array<number> = [1.1, 2.2];
  let p2: Array<number> = [3.3, 4.4];
  let p3: Array<number> = [-2.9, 4.2];

  let nn: ReferencePointSet = new ReferencePointSet([p1, p2, p3]);
  let ret: Array<number> = nn.nearest([3.0, 4.0]);
  assertEquals(3.3, ret[0]);
  assertEquals(4.4, ret[1]);
});

Deno.test("KDTree.testBasic", () => {
  let points: Array<Array<number>> = [
    [2, 3],
    [4, 2],
    [4, 5],
    [3, 3],
    [4, 4],
    [1, 5],
  ];

  let kdt: PointSet = new KDTree(points);
  let expected: Array<number> = [1, 5];
  let actual: Array<number> = kdt.nearest([0, 7]);
  assertEquals(expected, actual);
});

Deno.test("KDTree.testAccuracy", () => {
  let size: number = 5000;
  let points: Array<Array<number>> = genRandPoints(size);
  let nps: PointSet = new ReferencePointSet(points);
  let kdt: PointSet = new KDTree(points);

  for (let i: number = 0; i < size; i++) {
    let randX: number = Math.random() * size;
    let randY: number = Math.random() * size;
    assertEquals(nps.nearest([randX, randY]), kdt.nearest([randX, randY]));
  }
});

Deno.test("KDTree.testSpeed", () => {
  let maxSize: number = Math.pow(2, 10);
  let numOps: number = 10000;
  let numTrials: number = 5;
  console.log();
  console.log("----------+----------");
  console.log(" size     | Time (s) ");
  console.log("----------+----------");

  for (let size: number = 128; size <= maxSize; size *= 2) {
    let sum: number = 0.0;
    let kdt: PointSet = new KDTree(genRandPoints(size, 4));

    for (let trial: number = 0; trial < numTrials; trial++) {
      let points: Array<Array<number>> = genRandPoints(numOps, 4);

      let startTime: number = Date.now();
      points.forEach((point) => {
        kdt.nearest(point);
      });
      let endTime: number = Date.now();

      sum += ((endTime - startTime) / 1000.0);
    }

    let mean: number = sum / numTrials;
    console.log(
      ` ${size.toString().padEnd(8, " ").substr(0, 8)} | ${
        mean.toFixed(8).toString().substr(0, 8)
      } `,
    );
  }
});

Deno.test("KDTree.testAccurateSpeed", () => {
});

/**
 * Generates an array of points with random coordinates.
 * 
 * The coordinates will have a maximum value of 'size'.
 *
 * @param size The number of random points to generate.
 * @param dimension The dimensionality of the points.
 * @return an array of random points.
 */
function genRandPoints(size: number, dimension?: number): Array<Array<number>> {
  dimension = dimension ? dimension : 2;
  let points: Array<Array<number>> = new Array<Array<number>>(size);
  let point: Array<number>;
  for (let i: number = 0; i < size; i++) {
    point = new Array<number>(dimension);
    for (let j: number = 0; j < dimension; j++) {
      point[j] = Math.random() * size;
    }
    points[i] = point;
  }
  return points;
}
