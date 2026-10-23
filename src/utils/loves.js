const lovesLetters = [...'LOVES'];
const maxRows = 60;
const maxRowLength = 256;
const maxPyramidCells = 1200;

export function calculateLovesPyramid(firstName, secondName) {
  const combinedName = `${firstName} ${secondName}`
    .normalize('NFKD')
    .toLocaleUpperCase()
    .replace(/\p{M}/gu, '');
  const initialRow = lovesLetters.map((letter) => [...combinedName].filter((char) => char === letter).length);
  const rows = [initialRow];
  let totalCells = initialRow.length;
  const seenRows = new Set();

  while (rows.at(-1).length > 2) {
    const currentRow = rows.at(-1);
    const rowKey = currentRow.join(',');
    if (seenRows.has(rowKey)) {
      throw new Error('This name pair makes a repeating pyramid. Try different names.');
    }
    seenRows.add(rowKey);

    const nextRow = [];
    for (let index = 0; index < currentRow.length - 1; index += 1) {
      const sum = currentRow[index] + currentRow[index + 1];
      if (sum >= 10) {
        nextRow.push(...String(sum).split('').map(Number));
      } else {
        nextRow.push(sum);
      }
    }

    totalCells += nextRow.length;
    if (rows.length >= maxRows || nextRow.length > maxRowLength || totalCells > maxPyramidCells) {
      throw new Error('This name pair makes the pyramid grow too large to show. Try another pair.');
    }
    rows.push(nextRow);
  }

  return rows;
}
