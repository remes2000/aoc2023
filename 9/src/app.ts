import { readFileSync } from "fs";

const firstPuzzle = () => {
  const extrapolate = (series: number[]): number[] => {
    if (series.every((num) => num === 0)) {
      return [...series, 0];
    }
    const newSeries = series.reduce((result, currentNumber, index) => {
      if (index === 0) {
        return result;
      }
      const previousNumber = series[index - 1];
      return [...result, currentNumber - previousNumber];
    }, []);
    return [...series, series[series.length - 1] + extrapolate(newSeries)[newSeries.length]];
  }

  const series = readFileSync('src/input.txt', 'utf-8')
    .split('\n')
    .map((line) => line.split(' ').map(Number));
  return series
    .map(extrapolate)
    .map((series) => series[series.length - 1])
    .reduce((sum, element) => sum + element, 0);
};

const secondPuzzle = () => {
  const extrapolate = (series: number[]): number[] => {
    if (series.every((num) => num === 0)) {
      return [0, ...series];
    }
    const newSeries = series.reduce((result, currentNumber, index) => {
      if (index === 0) {
        return result;
      }
      const previousNumber = series[index - 1];
      return [...result, currentNumber - previousNumber];
    }, []);
    return [series[0] - extrapolate(newSeries)[0], ...series];
  }

  const series = readFileSync('src/input.txt', 'utf-8')
    .split('\n')
    .map((line) => line.split(' ').map(Number));
  return series
    .map(extrapolate)
    .map((series) => series[0])
    .reduce((sum, element) => sum + element, 0);
};

console.log('first puzzle', firstPuzzle());
console.log('second puzzle', secondPuzzle());