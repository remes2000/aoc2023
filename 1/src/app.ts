import { readFileSync } from "fs";

const result = readFileSync('src/input.txt', 'utf-8').split('\n').reduce(
  (result, line) => {
    const numbers = line.match(/\d/g);
    return result + Number(numbers[0]+numbers[numbers.length - 1])
  }, 0
);
console.log('first puzzle', result);

const digitSpell = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const regexp = new RegExp(`(?=(${['\\d', ...digitSpell].join('|')}))`, 'g');

const toDigit = (digit: string): string =>
  digitSpell.includes(digit) ? `${digitSpell.indexOf(digit) + 1}` : digit;

const resultSecondPuzzle = readFileSync('src/input.txt', 'utf-8').split('\n').reduce(
  (result, line) => {
    const numbers = Array.from(line.matchAll(regexp)).map(([_, spell]) => spell);
    return result + Number( toDigit(numbers[0]) + toDigit(numbers[numbers.length - 1]) );
  }, 0
);
console.log('second puzzle', resultSecondPuzzle);