function partition<T>(array: T[], isValid: (element: T) => boolean) {
  return array.reduce<[T[], T[]]>(
    ([pass, fail]: [T[], T[]], elem: T) => {
      return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    },
    [[], []]
  );
}

export default partition;
