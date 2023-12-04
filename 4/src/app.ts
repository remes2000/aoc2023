import { readFileSync } from "fs";

const firstPuzzle = () => {
  const lines: string[] = readFileSync('src/input.txt', 'utf-8').split('\n');
  return lines.reduce((value, line) => {
    const [left, right] = line.substring(line.indexOf(':')).split('|').map((numbers) => {
      return Array.from(numbers.matchAll(/\d+/g)).map((match) => Number(match[0]))
    });
    const intersection = right.filter((number) => left.includes(number));
    return value + (intersection.length ? Math.pow(2, intersection.length - 1) : 0)
  }, 0);
};

const secondPuzzle = () => {
  const lines: string[] = readFileSync('src/input.txt', 'utf-8').split('\n');
  const map = new Map<number, number>();
  lines.forEach((line) => {
    const cardNumber = Number(line.match(/\d+/)[0]);
    map.set(cardNumber, (map.get(cardNumber) ?? 0) + 1);

    const [left, right] = line.substring(line.indexOf(':')).split('|').map((numbers) => {
      return Array.from(numbers.matchAll(/\d+/g)).map((match) => Number(match[0]))
    });
    const intersection = right.filter((number) => left.includes(number));

    intersection.forEach((_, index) => {
      const copyCardNumber = cardNumber + index + 1;
      map.set(copyCardNumber, (map.get(copyCardNumber) ?? 0) + map.get(cardNumber) );
    });
  });
  return Array.from(map.values()).reduce((result, value) => result + value, 0);
};

console.log('first puzzle', firstPuzzle());
console.log('second puzzle', secondPuzzle());

