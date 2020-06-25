import { ArrayHeapPQ } from "../src/ArrayHeapPQ.ts";
import { ReferencePQ } from "../src/ReferencePQ.ts";
import { ExtrinsicPQ } from "../src/Interfaces.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { RemoveFromEmptyError } from "../src/Errors.ts";

// = = = = = = = = = = = = =
// GLOBAL CONSTANTS
// = = = = = = = = = = = = =

const MAX_VAL: number = 1000;
const MAX_PRIORITY: number = 1000;

enum Method {
  ADD,
  CONTAINS,
  GET_SMALLEST,
  REMOVE_SMALLEST,
  SIZE,
  CHANGE_PRIORITY,
}
const METHOD_ENUMS: Array<Method> = [
  Method.ADD,
  Method.CONTAINS,
  Method.GET_SMALLEST,
  Method.REMOVE_SMALLEST,
  Method.SIZE,
  Method.CHANGE_PRIORITY,
];

// = = = = = = = = = = = = =
// TESTS
// = = = = = = = = = = = = =

Deno.test("testBasicTree", () => {
  /* This method is meant to be used with a debugger to see what
        happens inside the ArrayHeapMinPQ. */
  let ahpq: ExtrinsicPQ<number> = new ArrayHeapPQ<number>();

  ahpq.add(6, 6);
  ahpq.add(4, 4);
  ahpq.add(1, 1);
  ahpq.add(3, 3);
  ahpq.add(5, 5);
  ahpq.add(2, 2);
});

Deno.test("testRandom", () => {
  let ahpq: ExtrinsicPQ<number> = new ArrayHeapPQ<number>();
  let npq: ExtrinsicPQ<number> = new ReferencePQ<number>();
  let map: Map<number, number> = new Map<number, number>();
  let val: number = 0;
  let priority: number;

  for (let i: number = 0; i < 100000; i++) {
    switch (Math.floor((Math.random() * 5))) {
      case 0: // add
        val = Math.floor((Math.random() * MAX_VAL));
        priority = Math.random() * MAX_PRIORITY;
        if (npq.contains(val)) {
          assertThrows(() => {
            ahpq.add(val, priority);
          }, Error);
        } else {
          ahpq.add(val, priority);
          npq.add(val, priority);
          map.set(val, priority);
        }
        break;

      case 1: // contains
        if (Math.random() < 0.5) { // Test item not in map
          do {
            val = Math.floor((Math.random() * MAX_VAL));
          } while (map.has(val));
        } else { // Test item in map
          val = getRandomIntegerFromSet(new Set(map.keys()));
        }
        assertEquals(npq.contains(val), ahpq.contains(val));
        break;

      case 2: // getSmallest
        if (npq.size() == 0) {
          assertThrows(() => {
            ahpq.get();
          }, RemoveFromEmptyError);
        } else {
          assertEquals(npq.get(), ahpq.get());
        }
        break;

      case 3: // removeSmallest
        if (npq.size() === 0) {
          assertThrows(() => {
            ahpq.remove();
          }, RemoveFromEmptyError);
        } else {
          map.delete(npq.get());
          assertEquals(npq.remove(), ahpq.remove());
        }
        break;

      case 4: // size
        assertEquals(npq.size(), ahpq.size());
        break;

      case 5: // changePriority
        priority = Math.random() * MAX_PRIORITY;
        val = getRandomIntegerFromSet(new Set(map.keys()));
        npq.changePriority(val, priority);
        ahpq.changePriority(val, priority);
        break;

      default:
        break;
    }
  }
});

Deno.test("testTime", () => {
  // Test parameters
  let maxOps: number = 5000;
  let numTrials: number = 6;

  // Other variables
  let header: string =
    " numOps   | add      | contains | size     | getSmall | removeSm | changePr ";
  let hline: string =
    "----------+----------+----------+----------+----------+----------+----------";
  let times: Map<Method, number> = new Map<Method, number>();
  times.set(Method.GET_SMALLEST, 0.0);
  times.set(Method.REMOVE_SMALLEST, 0.0);
  times.set(Method.CHANGE_PRIORITY, 0.0);

  // Do the timing and print as well
  console.log();
  console.log(hline);
  console.log(header);
  console.log(hline);
  for (let numOps: number = 10; numOps <= maxOps; numOps *= 2) {
    let numOpsString: string = "";
    testTimePart1(numOps, numTrials, times);
    testTimePart2(numOps, numTrials, times);
    numOpsString += ` ${numOps.toString().padEnd(8, " ").substr(0, 8)} `;
    METHOD_ENUMS.forEach((key) => {
      numOpsString += `| ${Number(times.get(key)).toFixed(8).toString().substr(0, 8)} `;
    });
    console.log(numOpsString);
  }
});

/**
 * Tests the speed of the add, contains, and size methods of the 
 * ArrayHeapPQ.
 *
 * @param numOps    The number of operations to perform.
 * @param numTrials The number of trials to perform.
 * @param times     The data structure which to update with the average 
 *                  time across the trials.
 */
function testTimePart1(
  numOps: number,
  numTrials: number,
  times: Map<Method, number>,
): void {
  let ahpq: ExtrinsicPQ<number>;
  let trialTimes: Array<Array<number>> = new Array<Array<number>>(3);
  for (let i: number = 0; i < 3; i++) {
    trialTimes[i] = new Array<number>(numTrials);
  }

  let startTime: number;
  let endTime: number;

  for (let trial: number = 0; trial < numTrials; trial++) {
    ahpq = new ArrayHeapPQ<number>();

    // add
    startTime = Date.now();
    for (let i: number = 0; i < numOps; i++) {
      try {
        ahpq.add(
          Math.floor((Math.random() * numOps * 2)),
          Math.random() * MAX_PRIORITY,
        );
      } catch (e) {
        continue;
      }
    }
    endTime = Date.now();
    trialTimes[0][trial] = (endTime - startTime) / 1000.0;

    // contains
    startTime = Date.now();
    for (let i: number = 0; i < numOps; i++) {
      ahpq.contains(Math.floor(Math.random() * numOps));
    }
    endTime = Date.now();
    trialTimes[1][trial] = (endTime - startTime) / 1000.0;

    // size
    startTime = Date.now();
    for (let i: number = 0; i < numOps; i++) {
      ahpq.size();
    }
    endTime = Date.now();
    trialTimes[2][trial] = (endTime - startTime) / 1000.0;
  }

  times.set(Method.ADD, trialTimes[0].reduce((x, y) => x + y, 0) / numTrials);
  times.set(
    Method.CONTAINS,
    trialTimes[1].reduce((x, y) => x + y, 0) / numTrials,
  );
  times.set(Method.SIZE, trialTimes[2].reduce((x, y) => x + y, 0) / numTrials);
}

/**
 * Tests the speed of the 'get', 'removeSmallest', and 'changePriority' 
 * methods of the 'ArrayHeapPQ'.
 *
 * @param numOps    The number of operations to perform.
 * @param numTrials The number of trials to perform.
 * @param times     The data structure which to update with the average 
 *                  time across the trials.
 */
function testTimePart2(
  numOps: number,
  numTrials: number,
  times: Map<Method, number>,
): void {
  let ahpq: ExtrinsicPQ<number>;
  let trialTimes: Array<Array<number>> = new Array<Array<number>>(3);
  for (let i: number = 0; i < 3; i++) {
    trialTimes[i] = new Array<number>(numTrials);
  }
  let values: Set<number> = new Set<number>();

  let startTime: number;
  let endTime: number;

  for (let trial: number = 0; trial < numTrials; trial++) {
    ahpq = new ArrayHeapPQ<number>();

    // Set up the PQ
    for (let i: number = 0; i < numOps; i++) {
      addToPQ(ahpq, values, numOps * 10);
    }

    // getSmallest
    startTime = Date.now();
    for (let i: number = 0; i < numOps; i++) {
      ahpq.get();
    }
    endTime = Date.now();
    trialTimes[0][trial] = (endTime - startTime) / 1000.0;

    // removeSmallest
    let removeTimes: Array<number> = new Array<number>(numOps);
    let removed: number;
    for (let i: number = 0; i < numOps; i++) {
      // Time the operation
      startTime = Date.now();
      removed = ahpq.remove();
      endTime = Date.now();
      removeTimes[i] = (endTime - startTime) / 1000.0;

      // "Reset" PQ.
      values.delete(removed);
      addToPQ(ahpq, values, numOps * 10);
    }
    trialTimes[1][trial] = removeTimes.reduce((x, y) => x + y, 0) / numOps;

    // changePriority
    let cpTimes: Array<number> = new Array<number>(numOps);
    for (let i: number = 0; i < numOps; i++) {
      let value: number = getRandomIntegerFromSet(values);
      startTime = Date.now();
      ahpq.changePriority(value, Math.random() * MAX_PRIORITY);
      endTime = Date.now();
      cpTimes[i] = (endTime - startTime) / 1000.0;
    }
    trialTimes[2][trial] = cpTimes.reduce((x, y) => x + y, 0) / numOps;

    values.clear();
  }

  times.set(
    Method.GET_SMALLEST,
    trialTimes[0].reduce((x, y) => x + y, 0) / numTrials,
  );
  times.set(
    Method.REMOVE_SMALLEST,
    trialTimes[1].reduce((x, y) => x + y, 0) / numTrials,
  );
  times.set(
    Method.CHANGE_PRIORITY,
    trialTimes[2].reduce((x, y) => x + y, 0) / numTrials,
  );
}

// = = = = = = = = = = = = =
// PRIVATE UTILITY METHODS
// = = = = = = = = = = = = =

/**
 * Gets a random integer from a set.
 *
 * @param set The set to get the random integer from.
 * @return A random integer from the specified set.
 */
function getRandomIntegerFromSet(set: Set<number>): number {
  let iter: Iterator<number> = set.keys();
  let result: number = iter.next().value;
  let randIndex = Math.floor(Math.random() * set.size) - 1;
  for (let i = 0; i < randIndex; i++) {
    result = iter.next().value;
  }
  return result;
}

/**
 * Adds a value to the specified priority queue.
 * 
 * If a duplicate value is attempted to be added, will keep on trying to add
 * values until the value is finally added. Uses MAX_PRIORITY to determine
 * the maximum possible priority.
 *
 * @param pq    The priority queue to add the value to.
 * @param set   The set of values in the priority queue.
 * @param upper The maximum value to add.
 */
function addToPQ(
  pq: ExtrinsicPQ<number>,
  set: Set<number>,
  upper: number,
): void {
  let value: number;
  while (true) {
    value = Math.floor(Math.random() * upper);
    if (!set.has(value)) {
      pq.add(value, Math.random() * MAX_PRIORITY);
      set.add(value);
      return;
    }
  }
}
