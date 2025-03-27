const container = document.getElementById("container");
const resetBtn = document.getElementById("reset-btn");
const clearBtn = document.getElementById("clear-btn");
const eraserBtn = document.getElementById("eraser-btn");
const undoBtn = document.getElementById("undo-btn");
const saveBtn = document.getElementById("save-btn");
const randomBtn = document.getElementById("random-btn");
const gridToggleBtn = document.getElementById("grid-toggle-btn");
const colorPicker = document.getElementById("color-picker");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const presetBtns = document.querySelectorAll(".preset-btn");

let randomMode = false;
let gridLinesOn = true;
let eraserMode = false;
let undoStack = [];

function createGrid(size) {
  container.innerHTML = "";
  const containerSize = Math.min(container.clientWidth, container.clientHeight);
  container.style.width = `${containerSize}px`;
  container.style.height = `${containerSize}px`;
  const squareSize = containerSize / size;

  for (let i = 0; i < size * size; i++) {
    const square = document.createElement("div");
    square.classList.add("grid-square");
    square.style.width = `${squareSize}px`;
    square.style.height = `${squareSize}px`;
    if (!gridLinesOn) square.classList.add("no-borders");
    container.appendChild(square);

    square.addEventListener("mouseover", () => {
      const prevColor = square.style.backgroundColor;
      undoStack.push({ square, prevColor });
      square.style.backgroundColor = eraserMode
        ? "white"
        : randomMode
        ? getRandomColor()
        : colorPicker.value;
    });
  }
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function clearGrid() {
  const squares = document.querySelectorAll(".grid-square");
  squares.forEach((square) => (square.style.backgroundColor = "white"));
}

function toggleGridLines() {
  const squares = document.querySelectorAll(".grid-square");
  gridLinesOn = !gridLinesOn;
  squares.forEach((square) =>
    square.classList.toggle("no-borders", !gridLinesOn)
  );
  gridToggleBtn.textContent = gridLinesOn
    ? "Toggle Grid Lines"
    : "Show Grid Lines";
}

function undoLast() {
  if (undoStack.length > 0) {
    const lastAction = undoStack.pop();
    lastAction.square.style.backgroundColor = lastAction.prevColor;
  }
}

resetBtn.addEventListener("click", () => {
  let size = prompt("Enter number of squares per side (max 100):");
  size = parseInt(size);
  if (isNaN(size) || size <= 0) size = 16;
  if (size > 100) size = 100;
  createGrid(size);
});

clearBtn.addEventListener("click", clearGrid);

eraserBtn.addEventListener("click", () => {
  eraserMode = !eraserMode;
  eraserBtn.textContent = eraserMode ? "Draw" : "Eraser";
});

undoBtn.addEventListener("click", undoLast);

randomBtn.addEventListener("click", () => {
  randomMode = !randomMode;
  randomBtn.textContent = randomMode ? "Single Color" : "Random Colors";
});

gridToggleBtn.addEventListener("click", toggleGridLines);

presetBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const size = parseInt(btn.getAttribute("data-size"));
    createGrid(size);
  });
});

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
  darkModeToggle.textContent = document.body.classList.contains("dark-mode")
    ? "Light Mode"
    : "Dark Mode";
});

document.body.classList.add("light-mode");
createGrid(16);
