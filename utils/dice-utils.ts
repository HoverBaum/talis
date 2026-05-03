/**
 * Returns a random integer between 1 and `sides` (inclusive).
 */
export const rollDie = (sides: number) => {
  return Math.floor(Math.random() * sides) + 1
}

/**
 * Rolls `count` dice with `sides` sides each.
 */
export const rollManyDice = (sides: number, count: number) => {
  return Array.from({ length: count }, () => rollDie(sides))
}
