import stringSimilarity from "string-similarity-js";

export const titleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(" ");
};

export const stringSearch = (
  needle: string,
  haystack: string[],
  resultNum: number = 5
): string[] => {
  const ratings: { target: string; rating: number }[] = haystack.map(
    (target) => ({
      target,
      rating: stringSimilarity(needle, target),
    })
  );
  ratings.sort((a, b) => b.rating - a.rating);

  const definites = ratings.filter((rating) => rating.rating >= 1);
  if (definites.length > 0)
    return definites.map((rating) => rating.target).slice(0, resultNum);

  return ratings
    .filter((rating) => rating.rating > 0)
    .map((rating) => rating.target)
    .slice(0, resultNum);
};
