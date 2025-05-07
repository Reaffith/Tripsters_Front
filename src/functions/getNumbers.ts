export const getNumbers = (num: number) => {
  const numbers = [];

  for (let i = 1; i <= num; i++) {
    numbers.push(i);
  }

  return numbers;
}