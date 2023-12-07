import { countSymbolsInText } from './utils';

export const isFiveOfKind = (cards: string) => Object.values(countSymbolsInText(cards)).some((v) => v === 5);
export const isFourOfKind = (cards: string) => Object.values(countSymbolsInText(cards)).some((v) => v === 4);
export const isThreeOfKind = (cards: string) => Object.values(countSymbolsInText(cards)).some((v) => v === 3);
export const isFullHouse = (cards: string) => {
  const counts = Object.values(countSymbolsInText(cards));
  return counts.includes(2) && counts.includes(3);
};
export const isTwoPair = (cards: string) => Object.values(countSymbolsInText(cards)).filter((v) => v === 2).length === 2;
export const isOnePair = (cards: string) => Object.values(countSymbolsInText(cards)).filter((v) => v === 2).length === 1;
export const isHighCard = (cards: string) => Object.values(countSymbolsInText(cards)).every((v) => v === 1);