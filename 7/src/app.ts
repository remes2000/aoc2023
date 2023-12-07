import { readFileSync } from "fs";
import { cards, cardsWithJoker, JOKER } from './consts';
import { 
  isHighCard,
  isOnePair,
  isTwoPair,
  isThreeOfKind,
  isFullHouse,
  isFourOfKind,
  isFiveOfKind,
} from './rules';
import { isFiveOfKindPossible, isFourOfKindPossible, isFullHousePossible, isThreeOfKindPossible, isTwoPairPossible } from "./optimize";

interface Hand {
  cards: string;
  bid: number;
}

const cardValueFunctions = [
  isHighCard,
  isOnePair,
  isTwoPair,
  isThreeOfKind,
  isFullHouse,
  isFourOfKind,
  isFiveOfKind,
];

const getValueOfCards = (cards: string): number => {
  for (const fun of [...cardValueFunctions].reverse()) {
    if (fun(cards)) {
      return cardValueFunctions.indexOf(fun) + 1;
    }
  }
  return 0;
}

const getValueOfCardsWithJoker = (cards: string): number => {
  if (isFiveOfKindPossible(cards)) {
    return cardValueFunctions.indexOf(isFiveOfKind) + 1;
  }
  if (isFourOfKindPossible(cards)) {
    return cardValueFunctions.indexOf(isFourOfKind) + 1;
  }
  if (isFullHousePossible(cards)) {
    return cardValueFunctions.indexOf(isFullHouse) + 1;
  }
  if (isThreeOfKindPossible(cards)) {
    return cardValueFunctions.indexOf(isThreeOfKind) + 1;
  }
  if (isTwoPairPossible(cards)) {
    return cardValueFunctions.indexOf(isTwoPair) + 1;
  }
  return cardValueFunctions.indexOf(isOnePair) + 1;
}

const compareCardByCard = (a: string, b: string): number => {
  for (let i = 0; i < a.length; i++) {
    const [aValue, bValue] = [cards.indexOf(a.charAt(i)), cards.indexOf(b.charAt(i))];
    if (aValue !== bValue) {
      return aValue - bValue;
    }
  }
  return 0;
}

const handsCompare = ({ cards: a }: Hand, { cards: b }: Hand): number => {
  const [aValue, bValue] = [getValueOfCards(a), getValueOfCards(b)];
  if (aValue === bValue) {
    return compareCardByCard(a, b);
  }
  return aValue - bValue;
};

const compareCardByCardWithJoker = (a: string, b: string): number => {
  for (let i = 0; i < a.length; i++) {
    const [aValue, bValue] = [cardsWithJoker.indexOf(a.charAt(i)), cardsWithJoker.indexOf(b.charAt(i))];
    if (aValue !== bValue) {
      return aValue - bValue;
    }
  }
  return 0;
}

const handsCompareWithJoker = ({ cards: a }: Hand, { cards: b }: Hand): number => {
  const [aValue, bValue] = [
    a.includes(JOKER) ? getValueOfCardsWithJoker(a) : getValueOfCards(a),
    b.includes(JOKER) ? getValueOfCardsWithJoker(b) : getValueOfCards(b)
  ];
  if (aValue === bValue) {
    return compareCardByCardWithJoker(a, b);
  }
  return aValue - bValue;
};

const firstPuzzle = () => {
  const hands: Hand[] = readFileSync('src/input.txt', 'utf-8')
    .split('\n').map((line) => ({
      cards: line.split(' ')[0],
      bid: Number(line.split(' ')[1])
    }));
  hands.sort(handsCompare);
  return hands.reduce((result, { bid }, index) => result + ( (index + 1) * bid), 0);
};

const secondPuzzle = () => {
  const hands: Hand[] = readFileSync('src/input.txt', 'utf-8')
    .split('\n').map((line) => ({
      cards: line.split(' ')[0],
      bid: Number(line.split(' ')[1])
    }));
  hands.sort(handsCompareWithJoker);
  return hands.reduce((result, { bid }, index) => result + ( (index + 1) * bid), 0);
};

// 248113761
console.log('first puzzle', firstPuzzle());
console.log('second puzzle', secondPuzzle());
