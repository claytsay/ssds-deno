import { ArrayDeque } from "../mod.ts";
import { IndexOutOfBoundsError } from "../src/Errors.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

Deno.test("ArrayDeque.addRemoveFirst", () => {
  let deque: ArrayDeque<number> = new ArrayDeque<number>();
  deque.addFirst(3);
  deque.addFirst(2);
  deque.addFirst(1);
  deque.addFirst(0);

  assertEquals(0, deque.get(0));
  deque.removeFirst();
  assertEquals(1, deque.get(0));
  deque.removeFirst();
  assertEquals(2, deque.get(0));
});

Deno.test("ArrayDeque.addRemoveLast", () => {
  let deque: ArrayDeque<number> = new ArrayDeque<number>();
  deque.addLast(0);
  deque.addLast(1);
  deque.addLast(2);
  deque.addLast(3);

  assertEquals(0, deque.get(0));
  deque.removeLast();
  assertEquals(0, deque.get(0));
  assertEquals(2, deque.removeLast());
  assertEquals(1, deque.get(1));
  deque.removeLast();
  deque.removeLast();
  assertThrows(() => {
    deque.get(0);
  }, IndexOutOfBoundsError);
});

Deno.test("ArrayDeque.isEmpty", () => {
});

Deno.test("ArrayDeque.size", () => {
});

Deno.test("ArrayDeque.printDeque", () => {
});

Deno.test("ArrayDeque.get", () => {
  let deque: ArrayDeque<number> = new ArrayDeque<number>();
  for (let i: number = 0; i < 100; i++) {
    deque.addLast(i);
  }

  for (let i: number = 0; i < 5; i++) {
    let n: number = Math.floor(Math.random() * deque.size());
    assertEquals(deque.get(n), n);
  }

  let deque2: ArrayDeque<number> = new ArrayDeque<number>();
  deque2.addLast(0);
  assertEquals(0, deque2.removeLast());
  deque2.addLast(2);
  assertEquals(2, deque2.removeLast());
  deque2.addLast(4);
  deque2.addFirst(5);
  assertEquals(5, deque2.removeFirst());
  assertEquals(4, deque2.removeLast());
});

Deno.test("ArrayDeque.addMega", () => {
  let deque: ArrayDeque<number> = new ArrayDeque<number>();
  for (let i: number = 0; i < 65536; i++) {
    deque.addLast(i);
  }
});

Deno.test("ArrayDeque.addRemoveMega", () => {
  let n: number = 65536;
  let deque: ArrayDeque<number> = new ArrayDeque<number>();
  for (let i: number = 0; i < n; i++) {
    deque.addLast(i);
  }
  for (let i: number = 0; i < n; i++) {
    deque.removeLast();
  }
});

Deno.test("AraryDeque.randomMega", () => {
  let deque: ArrayDeque<number> = new ArrayDeque<number>();
  for (let i: number = 0; i < 65536; i++) {
    switch (Math.floor(Math.random() * 4)) {
      case (0):
        deque.addFirst(i);
        break;
      case (1):
        deque.addLast(i);
        break;
      case (2):
        if (deque.size() === 0) {
          assertThrows(() => {
            deque.removeFirst();
          }, Error);
        } else {
          deque.removeFirst();
        }
        break;
      case (3):
        if (deque.size() === 0) {
          assertThrows(() => {
            deque.removeLast();
          }, Error);
        } else {
          deque.removeLast();
        }
        break;
    }
  }
});

Deno.test("ArrayDeque.deepCopy", () => {
  let deque: ArrayDeque<number> = new ArrayDeque<number>();
  for (let i: number = 0; i < 20; i++) {
    deque.addLast(i);
  }
  let copy: ArrayDeque<number> = new ArrayDeque<number>(deque);
  for (let i: number = 0; i < 20; i++) {
    assertEquals(deque.get(i), copy.get(i));
  }
});
