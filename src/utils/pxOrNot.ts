function pxOrNot<T>(value: T) {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  return value;
}

export default pxOrNot;
