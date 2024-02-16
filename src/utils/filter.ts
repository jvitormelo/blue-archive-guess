function simpleOperatorFilter(
  operator: string,
  value1: number,
  value2: number
) {
  if (operator === ">") {
    return value1 > value2;
  }
  if (operator === "<") {
    return value1 < value2;
  }
  if (operator === "=") {
    return value1 === value2;
  }
  if (operator === ">=") {
    return value1 >= value2;
  }
  if (operator === "<=") {
    return value1 <= value2;
  }
}

function splitOperatorAndValue(input: string) {
  const regex = /([<>]=?)(\d+)/;
  const match = input.match(regex);

  if (!match) return null;

  return [match[1], parseInt(match[2])] as const;
}

export { simpleOperatorFilter, splitOperatorAndValue };
