export const isEmpty = (data: unknown) => {
  if (data === null || data === undefined) {
    return 'It is Empty!!';
  }
  return 'It is not Empty!!';
};
