import { readFileSync } from "fs";

const firstPuzzle = () => {
  const input: string = readFileSync('src/input.txt', 'utf-8');
  const lines = input.split('\n');
  const seeds = Array.from(lines[0].matchAll(/\d+/g)).map(([n]) => Number(n));
  const { maps }: { maps: number[][][] } = [...lines.slice(2), ''].reduce((result, line, index) => {
    if (line.endsWith('map:')) {
      return { ...result, currentMap: [] };
    }
    if (line === '') {
      return { maps: [ ...result.maps, result.currentMap ], currentMap: [] };
    }
    const numbers = Array.from(line.matchAll(/\d+/g)).map(([n]) => Number(n));
    return { ...result, currentMap: [ ...result.currentMap, numbers ] };
  }, { maps: [], currentMap: [] });

  const locations = seeds.map((seed) => {
    return maps.reduce((value, map) => {
      const range = map.find(([_, sourceRangeStart, rangeLength]) => 
        sourceRangeStart <= value && sourceRangeStart + rangeLength > value);
      if (range) {
        const [destinationRangeStart, sourceRangeStart] = range;
        return destinationRangeStart + (value - sourceRangeStart);
      }
      return value;
    }, seed);
  });
  
  return Math.min(...locations);
};

// I failed
const secondPuzzle = () => {
  const input: string = readFileSync('src/input.txt', 'utf-8');
  const lines = input.split('\n');
  const seeds = Array.from(lines[0].matchAll(/\d+/g)).map(([n]) => Number(n))
    .reduce((result, value, index) => {
      index % 2 == 0 ? result.push([value]) : result[result.length - 1].push(value)
      return result;
    }, []);
  const { maps }: { maps: number[][][] } = [...lines.slice(2), ''].reduce((result, line, index) => {
    if (line.endsWith('map:')) {
      return { ...result, currentMap: [] };
    }
    if (line === '') {
      return { maps: [ ...result.maps, result.currentMap ], currentMap: [] };
    }
    const numbers = Array.from(line.matchAll(/\d+/g)).map(([n]) => Number(n));
    return { ...result, currentMap: [ ...result.currentMap, numbers ] };
  }, { maps: [], currentMap: [] });

  const getIntersection = ([aStart, aLength]: number[], [bStart, bLength]: number[]): number[] => {
    const intersectionStart = Math.max(aStart, bStart);
    const intersectionLastElement = Math.min(aStart + aLength - 1, bStart + bLength - 1);
    const intersectionLength = intersectionLastElement - intersectionStart + 1;
    return [intersectionStart, Math.max(intersectionLength, 0)];
  }

  const getUnmappedRanges = ([seedStart, numberOfSeeds]: number[], mappedRanges: number[][]): number[][] => {
    const unmappedRanges: number[][] = [];

    if (!mappedRanges.length) {
      return [[seedStart, numberOfSeeds]];
    }
    if (seedStart < mappedRanges[0][0]) {
      unmappedRanges.push([seedStart, mappedRanges[0][0] - seedStart]);
    }
    const lastRange = mappedRanges[mappedRanges.length - 1];
    if (lastRange[0] + lastRange[1] - 1 < seedStart + numberOfSeeds - 1) {
      const start = lastRange[0] + lastRange[1];
      const end = seedStart + numberOfSeeds - 1;
      unmappedRanges.push([start, end - start + 1]);
    }
    // jeszcze dziury
    mappedRanges.forEach((currentRange, index) => {
      const nextRange = mappedRanges[index + 1];
      if (!nextRange) {
        return;
      }
      const firstOutOfCurrentRange = currentRange[0] + currentRange[1];
      const lastOutOfNextRange = nextRange[0] - 1;
      if (firstOutOfCurrentRange !== nextRange[0]) {
        unmappedRanges.push([firstOutOfCurrentRange, lastOutOfNextRange - firstOutOfCurrentRange + 1 ]);
      }
    });

    return unmappedRanges;
  };

  const getMinLocation = ([seedStart, numberOfSeeds]: number[], maps: number[][][]): number => {
    if (maps.length === 0) {
      return seedStart;
    }
    const currentMap = maps.shift();

    const newSeeds: number[][] = [];
    const mappedRanges: number[][] = [];

    currentMap.forEach(([destinationStart, sourceStart, rangeLength]) => {
      const [intersectionStart, intersectionLength] = getIntersection([seedStart, numberOfSeeds], [sourceStart, rangeLength]);
      if (intersectionLength === 0) {
        return;
      }
      newSeeds.push([ intersectionStart - sourceStart + destinationStart, intersectionLength ]);
      mappedRanges.push([intersectionStart, intersectionLength]);
    });
    const unmappedRanges = getUnmappedRanges([seedStart, numberOfSeeds], mappedRanges);

    console.log('new seeds', newSeeds);
    console.log('mapped ranges', mappedRanges);
    console.log('get unmapped ranges', unmappedRanges);

    return Math.min(...[...newSeeds, ...unmappedRanges].map((seed) => getMinLocation(seed, [...maps]) ));
  }

  const locations = seeds.map(([seedStart, numberOfSeeds]) => getMinLocation([seedStart, numberOfSeeds], [...maps]));
  return Math.min(...locations);
};

console.log('first puzzle', firstPuzzle());
console.log('second puzzle', secondPuzzle());

