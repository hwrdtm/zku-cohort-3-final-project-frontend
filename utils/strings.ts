export const shortenedWithEllipses = (str: string) => {
  const strLen = str.length;
  return `${str.slice(0, 6)}......${str.slice(strLen - 7)}`;
};
