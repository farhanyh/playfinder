const isNumber = (value: string | number) => {
  return typeof value === "number" || !isNaN(parseInt(value));
};

export const formatMod = (mod: string | number) => {
  if (!isNumber(mod)) return `${mod}`;
  const value = typeof mod === "number" ? mod : parseInt(mod);
  if (value >= 0) return `+${value}`;
  return `${value}`;
};
