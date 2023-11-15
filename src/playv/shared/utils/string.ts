export function compareString(a: string, b: string) {
  const aNum = a.match(/^-?\d+/)?.[0];
  const bNum = b.match(/^-?\d+/)?.[0];
  if (aNum !== undefined && bNum !== undefined) {
    return Number(aNum) - Number(bNum);
  }
  if (aNum !== undefined) {
    return 1;
  }
  if (bNum !== undefined) {
    return -1;
  }

  return a.localeCompare(b);
}
