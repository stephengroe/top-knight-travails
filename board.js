// Build the chessboard
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

  resizeKnight();
}

function resizeKnight() {
  const square = document.querySelector(`[data-coordinates='0,0']`);

  // Set knight's size and width :root variables to same as a square
  const font = `${square.offsetHeight}px`;
  const width = `${square.offsetWidth}px`;
  document.documentElement.style.setProperty("--knight-font-size", font);
  document.documentElement.style.setProperty("--knight-width", width);
}

// Move knight
function moveKnight(coordinates) {
  const knight = document.querySelector("#knight");

  // Move based on square's location
  // (all relative, so works with window resizing!)
  const x = coordinates[0] / dimensions[0] * 100;
  const y = coordinates[1] / dimensions[1] * 100;
  knight.style.left = `${x}%`;
  knight.style.bottom = `${y}%`;
};

function getRandomCoordinate(dimensions) {
  const x = Math.floor(Math.random() * dimensions[0]);
  const y = Math.floor(Math.random() * dimensions[1]);
  return [x, y];
}

function placePiece(coordinateString) {
  const chessboard = document.querySelector("#chessboard");
  const coordinates = coordinateString.split(",");
  
  if (chessboard.classList.contains("place-knight")) {
    moveKnight(coordinates);
    chessboard.classList.remove("place-knight");
    chessboard.classList.add("set-destination");
    
  } else if (chessboard.classList.contains("set-destination")) {
    document.querySelector(`[data-coordinates='${coordinateString}']`)
      .classList.add("destination");
    chessboard.classList.remove("set-destination");
  }
}

// Adjust board dimensions
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
buildChessboard(dimensions);
moveKnight(getRandomCoordinate(dimensions));

// Increment/decrement board dimensions
document.querySelector("button#grow").addEventListener("click", (e) => {
  dimensions = changeDimensions(dimensions, 1, limits);
  buildChessboard(dimensions);
});

document.querySelector("button#shrink").addEventListener("click", (e) => {
  dimensions = changeDimensions(dimensions, -1, limits);
  buildChessboard(dimensions);
});

// Create knight placement button bindings
const squares = document.querySelectorAll("#chessboard .square");
squares.forEach(square => {
  square.addEventListener("click", (e) => {
    placePiece(e.target.dataset.coordinates);
  });
});