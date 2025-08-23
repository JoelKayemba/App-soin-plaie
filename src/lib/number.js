export const toNum = (v) => {
  if (v === '' || v === null || v === undefined) return NaN;
  const n = Number(v);
  return isNaN(n) ? NaN : n;
};
