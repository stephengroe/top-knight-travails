function knightMoves(start, end) {
  const move = new Move(start);
  console.log(move);
}

const movesSet = new Set();

class Move {
  constructor(position) {
    this.position = this.verifyCoordinate(position);
    this.calculateMoves();
  }

  calculateMoves(position = this.position) {

    if (position === null) return;

    this.topLeft = new Move([position[0] + 2, position[1] - 1]);
    this.topRight = new Move([position[0] + 2, position[1] + 1]);

    this.bottomLeft = new Move([position[0] - 2, position[1] - 1]);
    this.bottomRight = new Move([position[0] - 2, position[1] + 1]);

    this.leftTop = new Move([position[0] + 1, position[1] - 2]);
    this.leftBottom = new Move([position[0] - 1, position[1] - 2]);

    this.rightTop = new Move([position[0] + 1, position[1] + 2]);
    this.rightBottom = new Move([position[0] - 1, position[1] + 2]);
  }

  verifyCoordinate(coord) {
    if (coord[0] < 0 || coord[0] > 7 || coord[1] < 0 || coord[1] > 7) return null;

    // .join() required, otherwise all array instances are unique (and Set will fill indefinitely)
    if (movesSet.has(coord.join())) return null;
    movesSet.add(coord.join());
    console.log(movesSet);
    return coord;
  }
  
}


// Tests
console.log(knightMoves([0,0],[1,2])); // [[0,0],[1,2]]
console.log(knightMoves([0,0],[3,3])); // [[0,0],[1,2],[3,3]]
console.log(knightMoves([3,3],[0,0])); // [[3,3],[1,2],[0,0]]