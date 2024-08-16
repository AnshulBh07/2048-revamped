import { coordinates } from "./interfaces";

export const generateStartMatrix: (
  x: number,
  y: number
) => [number[][], coordinates[]] = (rows, columns) => {
  const matrix = new Array(rows)
    .fill(null)
    .map(() => new Array(columns).fill(0));

  const coordsArr: coordinates[] = [];

  // now we need to generate three random numbers between 1 and rows x columns for starter tiles, these starter tiles will contain number 2
  //   while generating make sure that an index that has already been generated is not generated twice, for that we use a set
  const st = new Set<coordinates>();
  let count = 0;

  while (count < 3) {
    const index1 = Math.floor(Math.random() * rows);
    const index2 = Math.floor(Math.random() * columns);

    if (!st.has([index1, index2])) {
      st.add([index1, index2]);
      matrix[index1][index2] = 2;
      coordsArr.push([index1, index2]);
      count++;
    }
  }

  console.log(matrix);

  return [matrix, coordsArr];
};

export const generateNewTile: (
  x: number,
  y: number,
  arr: number[][]
) => [boolean, number[][], coordinates[]] = (rows, columns, matrix) => {
  // a new tile is only generated if there is a zero in the matrix
  // new tile generated is always 2
  // if a new tile is able to generate return true, else return false that will signal game over

  // first check if we can generate a new tile, if no then return false
  // for this maintain an array and traverse the matrix to store indices of all 0s
  type coordinates = [number, number];
  const emptySlots: coordinates[] = [];
  let coordArr: coordinates[] = [[-1, -1]];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (matrix[i][j] === 0) emptySlots.push([i, j]);
    }
  }

  if (emptySlots.length === 0) return [false, matrix, coordArr];

  //   select random coordinate from empty slots
  const index = Math.floor(Math.random() * emptySlots.length);
  const [row, col] = emptySlots[index];

  //   do not do const newMatrix = matrix as it only creates a new reference not a new array
  //   changes made in newMatrix will also be reflected in matrix that way
  const newMatrix = matrix.map((row) => [...row]);
  newMatrix[row][col] = 2;
  coordArr = [[row, col]];

  return [true, newMatrix, coordArr];
};

// function that decides value of bg color and number color based on value
export const decideColorFn: (x: number | null) => [string, string] = (
  value
) => {
  switch (value) {
    case null:
      return ["#cdc1b4", ""];
    case 2:
      return ["#eee4da", "#776e65"];
    case 4:
      return ["#ede0c8", "#776e65"];
    case 8:
      return ["#f2b179", "#f9f6f2"];
    case 16:
      return ["#f59563", "#f9f6f2"];
    case 32:
      return ["#f67c5f", "#f9f6f2"];
    case 64:
      return ["#f65e3b", "#f9f6f2"];
    case 128:
      return ["#edcf72", "#f9f6f2"];
    case 256:
      return ["#edcc61", "#f9f6f2"];
    case 512:
      return ["#edc850", "#f9f6f2"];
    case 1024:
      return ["#edc53f", "#f9f6f2"];
    case 2048:
      return ["#edc22e", "#f9f6f2"];
    case 4096:
      return ["#edc22e", "#f9f6f2"];
    case 8192:
      return ["#edc22e", "#f9f6f2"];
    default:
      return ["#cdc1b4", ""];
  }
};
