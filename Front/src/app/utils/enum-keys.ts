export function enumKeys(enumObj): string[] {
  return Object.keys(enumObj)
      .filter(key => !isNaN(enumObj[key]));
}
