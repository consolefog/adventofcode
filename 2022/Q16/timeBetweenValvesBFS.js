import {Queue} from './queue.js';

export const timeBetweenValvesBFS = (from, to, valves) => {
  const q = new Queue(100000);
  const explored = new Set();
  const parents = {}
  q.enqueue(from);

  let end = undefined;

  while (!q.isEmpty() && end === undefined) {
    const v = q.dequeue();

    if (v === to) {
      end = to;
    } else {
      valves[v].neighbors.forEach(neighbor => {
        if (!explored.has(neighbor)) {
          explored.add(neighbor);
          parents[neighbor] = v;
          q.enqueue(neighbor);
        }
      })
    }
  }

  let current = end;
  let path = [];

  if (current === undefined) {
    throw `from ${from} to ${to} are not connected`;
  }

  while (current !== from) {
    path.push(current);
    current = parents[current];
  }

  return path.length;
}
