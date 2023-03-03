
export function isBlank(str:string) {
  if (str === undefined) {
    return true;
  }

  if (str === null) {
    return true;
  }
  return (/^\s*$/.test(str));
}
