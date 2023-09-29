function knightMoves(start, end) {
  console.log(`Traveling from [${start}] to [${end}]`);
  const chessBoard = new Board([8, 8]);
  console.log(chessBoard);
}

const uniqueMoves = new Set();

class Board {
  constructor([width, height] = [8,8]) {
    this.squares = new Map();

    for (let i=0; i<width; i++) {
      for (let j=0; j<height; j++){
        this.squares.set(`${i},${j}`, []);
      }
    }

    this.generateMoves(this.squares);
  }

  generateMoves(squares = this.squares) {
    squares.forEach((validMoves, positionString) => {
      // Convert key (string) to coordinate array
      let position = positionString.split(",");
      position = position.map(num => Number(num));

      // Calculate valid knight moves
      let totalMoves = [
        [position[0] + 2, position[1] - 1],
        [position[0] + 2, position[1] + 1],
        [position[0] - 2, position[1] - 1],
        [position[0] - 2, position[1] + 1],
        [position[0] + 1, position[1] - 2],
        [position[0] + 1, position[1] + 2],
        [position[0] - 1, position[1] - 2],
        [position[0] - 1, position[1] + 2]
      ];

      // Remove invalid coordinates
      totalMoves = totalMoves.map(coordinate => coordinate.join());
      validMoves.push(...totalMoves.filter(coordinate => squares.has(coordinate)));
    });
  }
}

// Tests
console.log(knightMoves([4,4], [6, 3]));