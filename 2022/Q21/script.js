import {readFile} from 'node:fs/promises';

// idea

// set humn to be the complex number (0 + 1.i) then solve the equation 'for i' in...
// sbtm:= x + iy = bmgf = 12725480108701

// this solution has to assume that two sides of a multiplication / division never
// both have non-zero imaginary coefficient.

// it's not clear to me that we can assume this but is possible it falls out from the
// fact that none of the equations can be circular?

const DEMO_INPUT = 'root: pppw + sjmn\n' +
  'dbpl: 5\n' +
  'cczh: sllz + lgvd\n' +
  'zczc: 2\n' +
  'ptdq: humn - dvpt\n' +
  'dvpt: 3\n' +
  'lfqf: 4\n' +
  'humn: 5\n' +
  'ljgn: 2\n' +
  'sjmn: drzm * dbpl\n' +
  'sllz: 4\n' +
  'pppw: cczh / lfqf\n' +
  'lgvd: ljgn * ptdq\n' +
  'drzm: hmdt - zczc\n' +
  'hmdt: 32';

const multiply = (a, b) => {
  return {
    real: a.real * b.real - (a.imaginary * b.imaginary),
    imaginary: a.real * b.imaginary + a.imaginary * b.real
  };
};
const divide = (a, b) => {
  const denominator = b.real * b.real - b.imaginary * b.imaginary;
  //(Ax + iAy)/(Bx + iBy) = (Ax + iAy)(Bx - iBy) / (Bx^2 - By^2)

  return {
    real: (a.real * b.real - (a.imaginary * -b.imaginary)) / denominator,
    imaginary: (a.real * -b.imaginary + a.imaginary * b.real) / denominator
  };
};
const add = (a, b) => {
  return {
    real: a.real + b.real,
    imaginary: a.imaginary + b.imaginary
  };
};
const subtract = (a, b) => {
  return {
    real: a.real - b.real,
    imaginary: a.imaginary - b.imaginary
  };
};

const IS_DEMO = false;

const parseInputValues = async () => {
  const values = {}
  const contents = await readFile('./2022/Q21/input.txt', {encoding: 'utf8'});
  const lines = IS_DEMO ? DEMO_INPUT.split('\n') : contents.split('\n');
  lines.forEach(line => {
    let trimmed = line.trim();
    if (trimmed === '') {
      // do nothing.
    } else {
      const split = trimmed.split(': ');
      const name = split[0];
      const value = split[1];
      if (value.indexOf('+') > 0 ||
        value.indexOf('-') > 0 ||
        value.indexOf('*') > 0 ||
        value.indexOf('/') > 0) {
        const match = value.match(/(.*) ([*/+-]) (.*)/)
        if (!match) {
          throw 'error';
        }
        values[name] = {
          basicNumber: 0,
          dependency: [match[1], match[3]],
          operation: {
            '*': multiply,
            '/': divide,
            '+': add,
            '-': subtract,
          } [match[2]],
          result: name === 'humn' ? {
            real: 0,
            imaginary: 1
          } : undefined,
        }
      } else {
        values[name] = {
          dependency: [],
          operation: undefined,
          result: name === 'humn' ? {
            real: 0,
            imaginary: 1
          } : {
            real: parseInt(value, 10),
            imaginary: 0
          },
        }
      }
    }
  })
  return values;
}

const lookup = (values, name) => {
  if (values[name]) {
    return values[name];
  } else {
    throw 'not found';
  }
}

const setResultAndGet = (values, name) => {
  const value = lookup(values, name);
  if (value.result === undefined) {
    // this monkey has not set their value yet.
    const dependency = value.dependency;
    let math = 0;
    if (dependency.length) {
      let name0 = dependency[0];
      let name1 = dependency[1];

      const dependencyZero = setResultAndGet(values, name0).result;
      const dependencyOne = setResultAndGet(values, name1).result;

      math = value.operation(dependencyZero, dependencyOne)
    }
    value.result = {
      real: math.real,
      imaginary: math.imaginary
    };
  }

  return value;
};

const values = await parseInputValues();

// root: sbtm = bmgf ?

const bmgf = setResultAndGet(values, 'bmgf').result.real;
const complex = setResultAndGet(values, 'sbtm');

console.log((bmgf - complex.result.real) / complex.result.imaginary);
