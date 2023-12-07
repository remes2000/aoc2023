export const countSymbolsInText = (text: string) => {
  return text.split('').reduce<{ [key: string]: number }>((result, symbol) => {
    return { ...result, [symbol]: result.hasOwnProperty(symbol) ? result[symbol] + 1 : 1 };
  }, {});
};
