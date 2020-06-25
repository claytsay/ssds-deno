import { LinkedListDeque } from "../mod.ts";
import { IndexOutOfBoundsError } from "../src/Errors.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

Deno.test("addRemoveFirst", () => {
  let deque: LinkedListDeque<number> = new LinkedListDeque<number>();
  deque.addFirst(3);
  deque.addFirst(2);
  deque.addFirst(1);
  deque.addFirst(0);

  assertEquals(deque.get(0), 0);
  deque.removeFirst();
  assertEquals(deque.get(0), 1);
  deque.removeFirst();
  assertEquals(deque.get(0), 2);
});

Deno.test("addRemoveLast", () => {
  let deque: LinkedListDeque<number> = new LinkedListDeque<number>();
  deque.addLast(0);
  deque.addLast(1);
  deque.addLast(2);
  deque.addLast(3);

  assertEquals(deque.get(0), 0);
  deque.removeLast();
  assertEquals(deque.get(0), 0);
  assertEquals(deque.removeLast(), 2);
  assertEquals(deque.get(1), 1);
  deque.removeLast();
  deque.removeLast();
  assertThrows(() => {
    deque.get(0);
  }, IndexOutOfBoundsError);
});

Deno.test("isEmpty", () => {
});

Deno.test("size", () => {
});

Deno.test("printDeque", () => {
});

Deno.test("get", () => {
});
