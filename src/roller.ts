import { Dice } from "dice-typescript";
import { bold } from "discord.js";

export const roll = (expression: string) => {
  const dice = new Dice();
  return dice.roll(expression);
};

export const formatRoll = (expression: string) => {
  const result = roll(expression);
  return `${result.renderedExpression} = ${bold(`${result.total}`)}`;
};
