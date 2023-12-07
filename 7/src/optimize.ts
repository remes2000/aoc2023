import { countSymbolsInText } from './utils';

export const NOT_POSSIBLE = false;

export const isFiveOfKindPossible = (cards: string): boolean => {
  const { J, ...counts } = countSymbolsInText(cards);
  const requiredNumberOfSameCards = 5 - J;
  return requiredNumberOfSameCards === 0 || Object.values(counts).includes(requiredNumberOfSameCards);
};

export const isFourOfKindPossible = (cards: string): boolean => {
  const { J, ...counts } = countSymbolsInText(cards);
  const requiredNumberOfSameCards = 4 - J;
  return Object.values(counts).includes(requiredNumberOfSameCards);
};

export const isFullHousePossible = (cards: string): boolean => {
  // max 3 jokers
  const { J, ...counts } = countSymbolsInText(cards);
  if (J === 3) {
    return true;
  }
  if (J === 2) {
    return Object.values(counts).includes(3) || (Object.values(counts).includes(1) && Object.values(counts).includes(2))
  }
  // only 1 joker left
  return Object.values(counts).filter((v) => v === 2).length === 2;
};

export const isThreeOfKindPossible = (cards: string): boolean => {
  // max 2 jokers
  const { J, ...counts } = countSymbolsInText(cards);
  if (J === 2) {
    return true;
  }
  // only 1 joker left
  return Object.values(counts).includes(2);
};

export const isTwoPairPossible = (cards: string): boolean => {
  // max 1 joker
  const { J, ...counts } = countSymbolsInText(cards);
  // one joker
  return Object.values(counts).filter((v) => v === 2).length >= 1;
};