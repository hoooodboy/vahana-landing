type CapitalizeOptions = { restLowerCase?: boolean };

function capitalize(text: string, options: CapitalizeOptions = {}) {
  const firstLetter = text.slice(0, 1).toUpperCase();
  const restLetters = text.slice(1);
  return `${firstLetter}${options.restLowerCase ? restLetters.toLowerCase() : restLetters}`;
}

export default capitalize;
