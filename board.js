function buildChessboard(dimensions) {
  const board = document.querySelector("#chessboard");
  board.style.gridTemplate = `repeat(${dimensions[0]}, 1fr) / repeat(${dimensions[1]}, 1fr)`;
  let toggle = true;

  for (let i=(dimensions[0]-1); i>=0; i-=1){
    let lightColor = toggle;
    for (let j=0; j<dimensions[1]; j+=1){
      const square = document.createElement("div");
      square.classList.add("square");
      square.dataset.coordinates = `${j},${i}`;
      square.textContent = `${j},${i}`;
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
}

function moveKnight(coordinates) {
  const position = coordinates.join(",");
  const board = document.querySelector("#chessboard");
  const square = document.querySelector(`[data-coordinates='${position}']`);

  square.textContent = "here!";

  // Generate knight element
  const knight = document.querySelector("#knight");

  // Set knight's size to same as a square
  knight.style.height = `${square.offsetHeight}px`;
  knight.style.width = `${square.offsetWidth}px`;

  // Move based on square's location
  // (all relative, so works with window resizing!)
  console.log(`x: ${coordinates[0]} / ${(dimensions[0])} = ${coordinates[0] / (dimensions[0])}`);
  console.log(`y: ${coordinates[1]} / ${(dimensions[1])} = ${coordinates[1] / (dimensions[1])}`)
  const x = coordinates[0] / dimensions[0] * 100;
  const y = coordinates[1] / dimensions[1] * 100;
  knight.style.left = `calc(${x}% - 5vmin)`;
  knight.style.bottom = `${y}%`;
  knight.textContent = position;
};

function getRandomCoordinate(dimensions) {
  const x = Math.floor(Math.random() * dimensions[0]);
  const y = Math.floor(Math.random() * dimensions[1]);
  return [x, y];
}

// Global variables
const dimensions = [8, 8];
buildChessboard(dimensions);
moveKnight(getRandomCoordinate(dimensions));


document.querySelector("button#add-knight").addEventListener("click", (e) => {
  moveKnight(getRandomCoordinate(dimensions));
});
