class Coordinate {
  constructor(coordinates, parent) {
    this.coordinates = coordinates;
    this.parent = parent;
  }

  generateMoves(dimensions) {
    this.nextMoves = [];
    const knightSteps = [
      [2, 1],
      [2, -1],
      [-2, 1],
      [-2, -1],
      [1, 2],
      [1, -2],
      [-1, -2],
      [-1, 2]
    ];

    knightSteps.forEach(step => {
      const x = this.coordinates[0] + step[0];
      const y = this.coordinates[1] + step[1];
      const coordinates = [x, y];

      // Verify move is on the board
      if (x < 0 || x >= dimensions[0] || y < 0 || y >= dimensions[1]) return;

      // Add new moves to element
      this.nextMoves.push(new Coordinate(coordinates, this));
    })
  }
}

function knightMoves(board, startPosition, endPosition) {
  if (startPosition === endPosition) return "No moves necessary!";

  const start = new Coordinate(startPosition, null);
  const uniqueSet = new Set([start.coordinates.join(",")]);
  const stack = [start];
  const path = [endPosition];

  while (stack.length > 0) {
    const current = stack.shift();

    if (current.coordinates.join(",") === endPosition.join(",")) {   
      // If we've found the final square, push all parents to path!
      let coordinate = current;
      while(coordinate.parent !== null) {
        path.unshift(coordinate.parent.coordinates);
        coordinate = coordinate.parent;
      }
      break;
    } else {
      // Otherwise, generate children
      current.generateMoves(board);

      // Eliminate duplicates and add to stack
      let uniqueMoves = current.nextMoves.filter(move => {
        return !uniqueSet.has(move.coordinates.join(","));
      });
      stack.push(...uniqueMoves);

      // Add to unique set
      uniqueMoves = uniqueMoves.map(move => move.coordinates.join(","));
      for (const move of uniqueMoves) {
        uniqueSet.add(move);
      }
    }
  }
  return path;
}

// Tests
let chessBoard = [8,8];

console.log(knightMoves(chessBoard, [2, 2], [4, 1]));
console.log(knightMoves(chessBoard, [4, 4], [6, 3]));
console.log(knightMoves(chessBoard, [4, 0], [6, 3]));
console.log(knightMoves(chessBoard, [0, 0], [7, 7]));