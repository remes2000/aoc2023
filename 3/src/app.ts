import { readFileSync } from "fs";

const firstPuzzle = () => {
  const lines: string[] = readFileSync('src/input.txt', 'utf-8').split('\n');
  const isEmpty = (s: string) => s === '' || s === '.';
  
  return lines.reduce((result, line, index) => {
    const lineAbove = lines[index - 1] ?? '';
    const lineBelow = lines[index + 1] ?? '';
    const subResult = Array.from(line.matchAll(/\d+/g)).reduce((currentValue, match) => {
      const matchedNumber = match[0];
      const valueIfTrue = currentValue + Number(matchedNumber);
  
      // left
      if (!isEmpty(line.charAt(match.index - 1))) {
        return valueIfTrue;
      }
      // left top
      if (!isEmpty(lineAbove.charAt(match.index - 1))) {
        return valueIfTrue;
      }
      // left bottom
      if (!isEmpty(lineBelow.charAt(match.index - 1))) {
        return valueIfTrue;
      }
      for (let i = 0; i < matchedNumber.length; i++) {
        if (!isEmpty(lineAbove.charAt(match.index + i))) {
          return valueIfTrue;
        }
        if (!isEmpty(lineBelow.charAt(match.index + i))) {
          return valueIfTrue;
        }
      }
      // right
      if (!isEmpty(line.charAt(match.index + matchedNumber.length))) {
        return valueIfTrue;
      }
      // right top
      if (!isEmpty(lineAbove.charAt(match.index + matchedNumber.length))) {
        return valueIfTrue;
      }
      // right bottom
      if (!isEmpty(lineBelow.charAt(match.index + matchedNumber.length))) {
        return valueIfTrue;
      }
  
      return currentValue;
    }, 0);
    return result + subResult;
  }, 0);
};

const secondPuzzle = () => {
  const isDigit = (digit: string) => digit.charCodeAt(0) >= 48 && digit.charCodeAt(0) <= 57;
  const getNumbersPresent = (line: string, from: number, to: number): number[] => {
    const characters = line.substring(from, to).split('');
    const numbersMap: { [key: string]: number } = characters.reduce((result, character, index) => {
      if (!isDigit(character)) {
        return result;
      };
      let startIndex = from + index;
      while (isDigit(line.charAt(startIndex - 1))) {
        startIndex--;
      }
      let endIndex = from + index;
      while (isDigit(line.charAt(endIndex + 1))) {
        endIndex++;
      }
      return { ...result, [startIndex]: Number(line.substring(startIndex, endIndex + 1)) };
    }, {});
    return Object.keys(numbersMap).map((key) => numbersMap[key]);
  }

  const getGearRatio = (gearIndex: number, [lineAbove, line, lineBelow]: string[]): number => {
    const numbers: number[] = [];
    getNumbersPresent(lineAbove, gearIndex - 1, gearIndex + 2).forEach((n) => numbers.push(n));
    getNumbersPresent(line, gearIndex - 1, gearIndex).forEach((n) => numbers.push(n));
    getNumbersPresent(line, gearIndex + 1, gearIndex + 2).forEach((n) => numbers.push(n));
    getNumbersPresent(lineBelow, gearIndex - 1, gearIndex + 2).forEach((n) => numbers.push(n));
    return numbers.length !== 2 ? 0 : numbers[0] * numbers[1];
  };
  const lines = readFileSync('src/input.txt', 'utf-8').split('\n');
  return lines.reduce((result, line, index) => {
    const lineAbove = lines[index - 1] ?? '';
    const lineBelow = lines[index + 1] ?? '';
    const gears = Array.from(line.matchAll(/\*/g)).map(({ index }) => index);
    return result + gears.reduce((result, gear) => result + getGearRatio(gear, [lineAbove, line, lineBelow]), 0);
  }, 0);
};

console.log('first puzzle', firstPuzzle());
console.log('second puzzle', secondPuzzle());

