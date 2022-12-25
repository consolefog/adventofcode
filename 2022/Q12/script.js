import {readFile} from 'node:fs/promises';

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');
const IS_DEMO = false;

class Queue {
  constructor(maxSize) {
    // Set default max size if not provided
    if (isNaN(maxSize)) {
      maxSize = 10;
    }
    this.maxSize = maxSize;
    // Init an array that'll contain the queue values.
    this.container = [];
  }

  // Helper function to display all values while developing
  display() {
    console.log(this.container);
  }

  // Checks if queue is empty
  isEmpty() {
    return this.container.length === 0;
  }

  // checks if queue is full
  isFull() {
    return this.container.length >= this.maxSize;
  }

  enqueue(element) {
    // Check if Queue is full
    if (this.isFull()) {
      console.log('Queue Overflow!');
      return;
    }
    // Since we want to add elements to end, we'll just push them.
    this.container.push(element);
  }

  dequeue() {
    // Check if empty
    if (this.isEmpty()) {
      console.log('Queue Underflow!');
      return;
    }
    return this.container.shift();
  }

  peek() {
    if (this.isEmpty()) {
      console.log('Queue Underflow!');
      return;
    }
    return this.container[0];
  }

  clear() {
    this.container = [];
  }
}

const canMove = (fromLetter, toLetter) => {
  if (fromLetter === 'S') {
    fromLetter = 'a'
  }

  if (fromLetter === 'E') {
    fromLetter = 'z'
  }

  if (toLetter === 'S') {
    toLetter = 'a'
  }

  if (toLetter === 'E') {
    toLetter = 'z'
  }

  const fromIndex = LETTERS.indexOf(fromLetter);
  const toIndex = LETTERS.indexOf(toLetter);

  return toIndex - fromIndex <= 1;
}

const getNewVerticesInstance = () => {
  const contents = 'abccccccaaccaaccccaaaaacccccaaaaccccccccccccccccccccccccccccccccaaaaaaaaaaaaaaaaaaaccccccccccccccccaaaccccccccccccaacccccccccccccccccccccccccccccccccccccccccaaaa\n' +
    'abaaaaccaaaaaccccaaaaaccccccaaaaccccccccccccccccccccaaacccccccccccaaaaaaaaaaaaaaaaaaccccccccccccccccaaaaccccccaaacaaccccccccccccccccccccccccccccccccccccccccaaaaa\n' +
    'abaaacccaaaaaaaacaaaaaacccccaaaaccccccccccccccccccccaaaaacccccccccaaaaaaaaaaaaaaaaacccccccccaaccccaaaaaacccccccaaaaaccccaaccccccccccccccacccccccccccccccccccaaaaa\n' +
    'abaaacccccaaaaaccccaaaaccccccaaacccccccccccccccccccaaaaaccccccccccaaaaaacacaaaaaacccccccccccaaccccaaaaacccccccccaaaaaaccaaaaaaccccccccccaaaccccacccccccccccaaaaaa\n' +
    'abaacccccaaaaaccccaacccccccccccccccaaaaacccccccccccaaaaacccccccccaaaaaaaaccaaaaaaacccccccaaaaaaaaccaaaaacccccccaaaaaaaccaaaaacccccccccccaaacccaaaccccccccccccccaa\n' +
    'abaaacccaaacaacccccccccccccccccccccaaaaaccccccccccccaaaaacccccccaaaaaaaaaccaaccaaacccccccaaaaaaaaccaacccccccccaaaaaaccaaaaaaccccccccccccaaaacaaaaccccccccccccccaa\n' +
    'abaaacccccccaaccccccccccccccccccccaaaaaaccccccccccccaaccccccaacccaaaccaaaaccccccaacccccccccaaaacccccccccccccccaacaaaccaaaaaaaccccccccccccajjjjjjjcccccccccccccccc\n' +
    'abcaacccccccccccccccccccccccccccccaaaaaaccccccccccccccccccccaaaaccccccaaaaccccccccccccccaacaaaaaccccccccccccccccccaaccccaaaaaacccccccccccjjjjjjjjjcccccaaaccccccc\n' +
    'abccccccccccccccccccccccccccccccccaaaaaaccaaccccccccccccccaaaaaacccccccaaacccccccccccaacaaaaaaaaccccccccccccccccccccccccaaccaaccccccccaiijjjjojjjjcccccaaacaccccc\n' +
    'abcccccccccccccccccccccccaaacccccccaaacacaaacccccccccccccccaaaaccccaaccccccccccccccccaaaaaaacccaccccccccccccccccccccccccaacccccccccccaiiijjooooojjkccaaaaaaaacccc\n' +
    'abccccccccccccccccccccccaaaaccccccccccaaaaaccccccccccccccccaaaaacccaaaaaccccccccccccccaaaaaacccccccccccccccccccccccccccccccccccccciiiiiiiioooooookkkcaaaaaaaacccc\n' +
    'abccccccccccccccccccccccaaaaccccccccccaaaaaaaacccccccccccccaacaaccaaaaacccccccaaacccaaaaaaaaccccccccccccccccccccccccccccccccccchiiiiiiiiooooouoookkkccaaaaaaccccc\n' +
    'abcccccccccaaccccccccccccaaaccccccccccccaaaaacccccccccccccccccccccaaaaaccccccaaaacccaaaaacaacccccccccccccaacaacccccccccccccccchhhiiiinnnooouuuuoookkkccaaaaaccccc\n' +
    'abcccccccccaaacccccccccccccccccccccccccaaaaacccccccccccccccccccccccaaaaacccccaaaaccccccaaccccccccccccccccaaaaacccccccccccccccchhhnnnnnnnnouuuuuuppkkkkaaaaaaccccc\n' +
    'abccccccaaaaaaaacccaaccccccccccccccccccaacaaccaacaaccccccccccccccccaacccccccccaaaccccccaacccccccccccccccaaaaacccccccccccccccchhhnnnnnnnnntuuxuuupppkkkkkacccccccc\n' +
    'abccccccaaaaaaaacacaaaacccccccccccccccccccaaccaaaaacccccccccccccccccccccccccccccccccccccccccccccccccccccaaaaaacccccccaacccccchhhnnnnttttttuxxxuuppppkkkkkcccccccc\n' +
    'abcccccccaaaaaaccaaaaaaccccccccccaaccccccccccaaaaaccccccccccccccccccccccccaaacccccccccccccccccccccccccccccaaaaccaaccaaacccaaahhhnnntttttttuxxxxuupppppllllccccccc\n' +
    'abcccccccaaaaaacccaaaacccccccccaaaaaaccccccccaaaaaacccccccccccccccccccccccaaacccccccccccccccccccccccccccccacccccaaaaaaacaaaaahhhppntttxxxxxxxxuuuuvpppplllccccccc\n' +
    'abcccccccaaaaaacccaaaacccccccccaaaaaacccccaaaaaaaaaccccccccccccccccccccaaaaaaaacccccccccccccccccccccaaaccccccaacaaaaaaccaaaaahhhpppttxxxxxxxxyuuvvvvvppplllcccccc\n' +
    'abcccccccaaccaacccaacaccaaaaccccaaaaacccccaaaaaaaaaccccccccccccccccccccaaaaaaaacccccccccccccccccccccaaacaaaaaaaccaaaaaaaaaaaaahhppptttxxxxxxyyyyyyvvvppplllcccccc\n' +
    'SbccccccccccccccccccccccaaaacccaaaaacccccccaaaaaaaaacaaaccccccccaacccccccaaaaaccccccccaaaaacccccccccaaaaaaaaaaaaaaaaaaaaaaaaacgggpppttxxxxEzzyyyyyvvvqqqlllcccccc\n' +
    'abccccccccccccccccccccccaaaacccaaaaacccccccaaaaaaaaccaaaccccccccaaacaaccaaaaaaccccccccaaaaacccccccaaaaaaaaaaaaaaaaaaaaaaaaaaacgggpppsssxxxyyyyyyvvvvvqqlllccccccc\n' +
    'abcccaaaccccccccccccccccaaaccccccccccccccccaaaaaaaaaaaaaccccccccaaaaaaccaaaaaacccccccaaaaaacccaaaccaaaaaccaaaaaaaaaaaacccccccccgggppssswwyyyyyyvvvvqqqqlllccccccc\n' +
    'abcaaaaaccccccccccccccccccccccccccccccccccaaaaaaaaaaaaacccccccaaaaaaacccaccaaacccccccaaaaaacccaaacccaaaaaaaaaaaccccaaacccaaaaacgggppsswwwyyyyyyvvqqqqqlllcccccccc\n' +
    'abcaaaaaaccccccccccccccccccccccccccccccccccaaccaaaaaaaaaaaccccaaaaaaacccccccccccccccccaaaaacccaaacaaaacaaaaaaaaccccaaacccaaaaacggpppsswwwywwyyyvvqqqmmmlccccccccc\n' +
    'abcaaaaaacccccccaacaaccccccccccccccccccccccccccaaaaaaaaaaaccccccaaaaacccccccccccccccccaaaccaaaaaaaaaaacccccccaacccccccccaaaaaacggpppsswwwwwwwwyvvqqqmmmcccccccccc\n' +
    'abcaaaaaccccccccaaaaaccccccccccccccccccccccccccccaaaaaaaacccccccaacaaacccccccccccccccccccccaaaaaaaaaccccccccccccccccccccaaaaaagggoossswwwwrrwwwvvqqmmmccccccccccc\n' +
    'abcaaaaacccccccaaaaaccccccccccccccccccccccccccccaaaaaaacccccccccaaccccccccccccccccccccccccccaaaaaaacccccccccccaaaccccccccaaaaagggooosssssrrrrwwwvqqmmmcccaacccccc\n' +
    'abcccccccccccccaaaaaaccccccccccccccccccccaacccccccccaaaccccccccccccccccccccccccccccccccccccccaaaaaaccccccccccccaaaaccccccaaaccgggooosssssrrrrrwwrrqmmmcccaacccccc\n' +
    'abcccccccccccccccaaaacccccccccccccccccccaaaacccccccacaaacccccccccccccccccccccccccccccccccccccaaaaaaacccccccccaaaaaacccccccccccgffoooooosoonrrrrrrrrmmmccaaaaacccc\n' +
    'abcccccccccccccccaccccccccccccccccccccccaaaacccccccaaaaacccccccccccccccccccccccccccccccccccccaaacaaacccccccccaaaaacccccccccccccfffoooooooonnnrrrrrmmmddcaaaaacccc\n' +
    'abccccccccccccccccccccccccccccccccccccccaaaaccccccccaaaaacccccccccccccccccccccccccaaaccccccccaacccccccccccccccaaaaaccccccccccccffffoooooonnnnnnrnnmmmdddaaaaacccc\n' +
    'abcccccccccccccccccccccccccccccccccccccccccccccccccaaaaaacccccccccccccccccaaaaaccaaaacccccccccccccccccccccccccaacccccccccccccccfffffffffeeeennnnnnmmdddaaaacccccc\n' +
    'abcccccccaaaccccccccaccccccccccccccccccccccccccccccaaaaccccccccccccaaaccccaaaaaccaaaaccccccccccccccccccccccccccccccccccccccccccccfffffffeeeeennnnnmddddaaaaaccccc\n' +
    'abcccaaccaaacccccaaaacccccaacccccccccccccccccccccccccaaacccccccccccaaacccaaaaaacccaaaccccccccccccccccccccccccccccccccccccccccccccccffffeeeeeeeedddddddcccaacccccc\n' +
    'abcccaaaaaaacccccaaaaaaccaaacccccccccccccccccccccccccccacccccccccccaaaaccaaaaaaccccccccccccccccccccccccccaacccccccccaaaccccccccccccccaaaaaaeeeeedddddcccccccccccc\n' +
    'abcccaaaaaacccccccaaaacccaaacaaaccccaaaacccccccccaaacaaaccccccaacccaaaacaaaaaaacccccccccccccccccccccccccaaaccccccccaaaacccccccccccccccccccaaaaeeddddccccccccccccc\n' +
    'abccccaaaaaaaacccaaaaaaaaaaaaaaaccccaaaacccccccccaaaaaaacccccaaacccaaaaaaaaaacccccccccccccccccccccccaaacaaaccccccccaaaaccccccccccccccccccccaaaccccccccccccccaaaca\n' +
    'abcccaaaaaaaaacccaacaaaaaaaaaaacccccaaaaccccccccccaaaaaacaaacaaacaaaaaaaaaacccccccccccccccaaacccccccaaaaaaaaaaccccccaaaccccccccccccccccccccaacccccccccccccccaaaaa\n' +
    'abcccaaaaaaaacccccccccccaaaaaacccccccaacccccccccccaaaaaaaaaaaaaaaaaaaaaaaaccccccccccccccccaaaacccccccaaaaaaaaacccccccccccccccccccccccccccccaaacccccccccccccccaaaa\n' +
    'abccaaaaaaacccccccccccccaaaaaaacccccccccccccccccaaaaaaaaaaaaaaaaaaaaaaaaaaacccccccccccccccaaaacccccccaaaaaaaacccccccccccccccccccccccccccccccccccccccccccccccaaaaa\n';
  const lines = contents.split('\n')
  const vertices = []

  let filteredLines = lines.filter(line => line.trim() !== '');
  filteredLines.forEach((line, up) => {
    const row = [];
    line.trim().split('').forEach((letter, index) => {
      const vertex = {
        explored: false,
        letter: letter === 'S' ? 'a' : letter ,
        up: filteredLines.length - 1 - up,
        right: index,
        edgeLeft: false,
        edgeRight: false,
        edgeUp: false,
        edgeDown: false,
        parent: undefined,
      };
      row.push(vertex);
    });
    vertices.unshift(row);
  });

  const defineEdges = (vertices) => {
    for (let i = 0; i < vertices.length; i++) {
      for (let j = 0; j < vertices[i].length; j++) {
        let vertex = vertices[i][j];
        let newI = i;
        let newJ = j;

        newI = i;
        newJ = j - 1;
        vertex.edgeLeft = newJ >= 0
          && canMove(vertex.letter, vertices[newI][newJ].letter)

        newI = i;
        newJ = j + 1
        vertex.edgeRight = newJ <= vertices[i].length - 1
          && canMove(vertex.letter, vertices[newI][newJ].letter)

        newI = i - 1;
        newJ = j;
        vertex.edgeDown = newI >= 0
          && canMove(vertex.letter, vertices[newI][newJ].letter)

        newI = i + 1;
        newJ = j;
        vertex.edgeUp = newI <= (vertices.length - 1)
          && canMove(vertex.letter, vertices[newI][newJ].letter)
      }
    }
  }

  defineEdges(vertices);

  return vertices;
}

const run = () => {
  const startSearch = getNewVerticesInstance()
  const possibleStartVertices = new Set();

  for (let i = 0; i < startSearch.length; i++) {
    for (let j = 0; j < startSearch[i].length; j++) {
      if (startSearch[i][j].letter === 'a') {
        const possibleStartPoint = {
          up: startSearch[i][j].up,
          right: startSearch[i][j].right
        };
        possibleStartVertices.add(possibleStartPoint);
      }
    }
  }

  let best = 10000000

  possibleStartVertices.forEach(S => {
    const vertices = getNewVerticesInstance();

    const q = new Queue(100000);

    let enqueued = false;

    for (let i = 0; i < vertices.length; i++) {
      for (let j = 0; j < vertices[i].length; j++) {
        if (vertices[i][j].up === S.up && vertices[i][j].right === S.right) {
          vertices[i][j].letter = 'S';
          q.enqueue(vertices[i][j]);
          enqueued = true;
        }
      }
    }

    if (!enqueued) {
      throw 'error';
    }

    let end = undefined;

    while (!q.isEmpty() && end === undefined) {
      const v = q.dequeue();
      if (v.letter === 'E') {
        end = v;
      } else {
        if (v.edgeLeft && !vertices[v.up][v.right - 1].explored) {
          let w = vertices[v.up][v.right - 1];
          w.explored = true;
          w.parent = {
            up: v.up,
            right: v.right
          };
          q.enqueue(w);
        }

        if (v.edgeRight && !vertices[v.up][v.right + 1].explored) {
          let w = vertices[v.up][v.right + 1];
          w.explored = true;
          w.parent = {
            up: v.up,
            right: v.right
          };
          q.enqueue(w);
        }

        if (v.edgeUp && !vertices[v.up + 1][v.right].explored) {
          let w = vertices[v.up + 1][v.right];
          w.explored = true;
          w.parent = {
            up: v.up,
            right: v.right
          };
          q.enqueue(w);
        }

        if (v.edgeDown && !vertices[v.up - 1][v.right].explored) {
          let w = vertices[v.up - 1][v.right];
          w.explored = true;
          w.parent = {
            up: v.up,
            right: v.right
          };
          q.enqueue(w);
        }
      }
    }

    if (end) {
      let current = end;
      let path = [];

      while (current.letter !== 'S') {
        path.push(current.letter);
        current = vertices[current.parent.up][current.parent.right];
      }

      if (path.length < best) {
        best = path.length;
      }
    }
  })

  console.log(best);

}

run();
