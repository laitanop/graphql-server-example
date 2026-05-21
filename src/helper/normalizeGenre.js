export const normalizeGenre = (g) => {
  if (Array.isArray(g)) return g;
  if (typeof g === "string") {
    return g
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};
