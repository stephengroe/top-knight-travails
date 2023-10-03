// Travails class and function
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

function generateMoves(board, startPosition, endPosition) {
  if (startPosition === endPosition) return "No moves necessary!";

  const start = new Coordinate(startPosition, null);
  const uniqueSet = new Set([start.coordinates.toString()]);
  const stack = [start];
  const path = [endPosition];

  while (stack.length > 0) {
    const current = stack.shift();

    if (current.coordinates.toString() === endPosition.toString()) {   
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
        return !uniqueSet.has(move.coordinates.toString());
      });
      stack.push(...uniqueMoves);

      // Add to unique set
      uniqueMoves = uniqueMoves.map(move => move.coordinates.toString());
      for (const move of uniqueMoves) {
        uniqueSet.add(move);
      }
    }
  }
  return path;
}

function moveKnight(coordinates) {
  const knight = document.querySelector("#knight");

  // Move based on square's location
  // (all relative, so works with window resizing!)
  const x = coordinates[0] / dimensions[0] * 100;
  const y = coordinates[1] / dimensions[1] * 100;
  knight.style.left = `${x}%`;
  knight.style.bottom = `${y}%`;
};

function animateMoves(moves) {
  const steps = moves;
  const destination = steps.pop();
  let timeout = 500;

  // Animate each step at a time
  steps.forEach(step => {
    const square = document.querySelector(`[data-coordinates='${step.toString()}'`);
    square.classList.add("step");

    setTimeout(() => {
      moveKnight(step);
      console.log(step);
    }, timeout);
    timeout += 500;
  });

  // Reset board
  setTimeout(() => {
    moveKnight(destination);
    document.querySelector(".destination").classList.remove("destination");
    document.querySelector("#chessboard").classList.add("place-knight");
    const steps = document.querySelectorAll(".step");
    steps.forEach(step => {step.classList.remove("step");})
  }, timeout);
}

// Place start point and destination
function placePiece(coordinateString) {
  const chessboard = document.querySelector("#chessboard");
  let [x, y] = coordinateString.split(",");
  const coordinates = [Number(x), Number(y)];
  
  if (chessboard.classList.contains("place-knight")) {
    start = coordinates;
    moveKnight(coordinates);
    chessboard.classList.remove("place-knight");
    chessboard.classList.add("set-destination");
    
  } else if (chessboard.classList.contains("set-destination")) {
    end = coordinates;
    document.querySelector(`[data-coordinates='${coordinateString}']`)
      .classList.add("destination");
    chessboard.classList.remove("set-destination");
    const moves = generateMoves(dimensions, start, end);
    animateMoves(moves);
  }
}

// Board building functions
function buildChessboard(dimensions) {
  const board = document.querySelector("#chessboard");

  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }

  board.style.gridTemplate = `repeat(${dimensions[0]}, 1fr) / repeat(${dimensions[1]}, 1fr)`;
  let toggle = true;

  for (let i=(dimensions[0]-1); i>=0; i-=1){
    let lightColor = toggle;
    for (let j=0; j<dimensions[1]; j+=1){
      const square = document.createElement("div");
      square.classList.add("square");
      square.dataset.coordinates = `${j},${i}`;
      if (lightColor) {
        square.classList.add("accent-color");
        lightColor = false;
      } else {
        lightColor = true;
      }
      board.append(square);
    }
    toggle = toggle ? false : true;
  }

  const knight = document.createElement("div");
  knight.setAttribute("id", "knight");
  knight.textContent = "♞";
  board.append(knight);

  bindSquares();
  resizeKnight();
}

function bindSquares() {
  const squares = document.querySelectorAll("#chessboard .square");
  squares.forEach(square => {
    square.addEventListener("click", (e) => {
      placePiece(e.target.dataset.coordinates);
    });
  });
}

function resizeKnight() {
  const square = document.querySelector(`[data-coordinates='0,0']`);

  // Set knight's size and width :root variables to same as a square
  const font = `${square.offsetHeight}px`;
  const width = `${square.offsetWidth}px`;
  document.documentElement.style.setProperty("--knight-font-size", font);
  document.documentElement.style.setProperty("--knight-width", width);
}

function getRandomCoordinate(dimensions) {
  const x = Math.floor(Math.random() * dimensions[0]);
  const y = Math.floor(Math.random() * dimensions[1]);
  return [x, y];
}

// Board resizing functions
function changeDimensions(dimensions, increment, limits) {
  let [x, y] = dimensions;
  x += increment;
  y += increment;

  const [min, max] = limits;

  if (x < min || y < min || x > max || y > max) return dimensions;
  updateDimensionsOutput([x, y]);
  return [x, y];
}

function updateDimensionsOutput(dimensions) {
  const output = document.querySelector("#dimensions");
  output.textContent = `${dimensions[0]} \xd7 ${dimensions[1]}`;
}

// Global variables
let dimensions = [8, 8];
const limits = [3, 16];
let start = [];
let end = [];

// Initiate page
buildChessboard(dimensions);
moveKnight(getRandomCoordinate(dimensions));

// Button bindings
document.querySelector("button#grow").addEventListener("click", (e) => {
  dimensions = changeDimensions(dimensions, 1, limits);
  buildChessboard(dimensions);
});

document.querySelector("button#shrink").addEventListener("click", (e) => {
  dimensions = changeDimensions(dimensions, -1, limits);
  buildChessboard(dimensions);
});