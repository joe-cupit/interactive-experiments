let penDown = false;
let eraseDown = false;
let prevEventTarget = null;

let boardSize = "medium";


function handleMouseMove(event) {
  if (!penDown && !eraseDown) return;
  event.preventDefault();

  if (event.target.classList.contains("departure-point")) {
    if (event.target === prevEventTarget) return;

    if (penDown) event.target.classList.add("on");
    else if (eraseDown) event.target.classList.remove("on");
  }

  prevEventTarget = event.target;
}

document.addEventListener("mousemove", handleMouseMove);


function handleMouseDown(event) {
  switch (event.button) {
    case 0:
      penDown = true;
      break;
    case 2:
      eraseDown = true;
      break;
    default:
      penDown = false;
      eraseDown = false;
      break;
  }

  handleMouseMove(event);
}

function handleMouseUp(event) {
  penDown = false;
  eraseDown = false;
  prevEventTarget = null;
}


document.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mouseup", handleMouseUp);


async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function clearRow(rowElement) {
  const departurePointsOn = [...rowElement.querySelectorAll(".departure-point.on")];
  const sleepTime = 750 / departurePointsOn.length;

  const shuffledPoints = departurePointsOn
    .map(v => ({v, sort: Math.random()}))
    .sort((a, b) => a.sort - b.sort)
    .map(({ v }) => v);

  for (let point of shuffledPoints) {
    point.classList.remove("on");
    await sleep(sleepTime);
  }
}

function clearBoard() {
  if (boardSize === "small" || boardSize === "medium") {
    const departureRows = document.querySelectorAll(".departure-row");

    for (let dRow of departureRows) {
      clearRow(dRow);
    }
  }
  else {
    const departurePointsOn = document.querySelectorAll(".departure-point.on");

    for (let point of departurePointsOn) {
      point.classList.remove("on");
    }
  }
}

async function fillRow(rowElement) {
  const departurePointsOn = [...rowElement.querySelectorAll(".departure-point:not(.on)")];
  const sleepTime = 750 / departurePointsOn.length;

  const shuffledPoints = departurePointsOn
    .map(v => ({v, sort: Math.random()}))
    .sort((a, b) => a.sort - b.sort)
    .map(({ v }) => v);

  for (let point of shuffledPoints) {
    point.classList.add("on");
    await sleep(sleepTime);
  }
}

function fillBoard() {
  const departureRows = document.querySelectorAll(".departure-row");

  for (let dRow of departureRows) {
    fillRow(dRow);
  }
}


let currentText = "";

function handleKeyUp(event) {
  const { key, location } = event;

  if (location === 0) currentText += key;
}

document.addEventListener("keyup", handleKeyUp);



function createBoard(rows, rowLen) {
  const departureBoard = document.querySelector(".departure-board");
  departureBoard.innerHTML = "";

  const departurePoint = "<div class='departure-point'></div>";

  for (let i=0; i<rows; i++) {
    let departureRow = document.createElement("div");
    departureRow.classList.add("departure-row");
    departureRow.innerHTML = departurePoint.repeat(rowLen * 9);

    departureBoard.appendChild(departureRow);
  }

  const departurePoints = departureBoard.querySelectorAll(".departure-point");
  for (let point of departurePoints) {
    point.style.setProperty("--_opacity", (Math.random() / 4 + 0.75).toFixed(4));
  }
}


function setBoardSize(size) {
  const departureBoard = document.getElementById("departure-board");
  let pointWidth = 10;
  let pointGap = 2;

  switch (size) {
    case "small":
      createBoard(4, 50);
      pointWidth = 15;
      pointGap = 3;
      break;
    case "medium":
      createBoard(6, 75);
      pointWidth = 10;
      pointGap = 2;
      break;
    case "large":
      createBoard(8, 100);
      pointWidth = 8;
      pointGap = 1;
      break;
    default:
      break;
  }
  boardSize = size;

  departureBoard.style.setProperty("--_departure-point-width", pointWidth+"px");
  departureBoard.style.setProperty("--_departure-point-gap", pointGap+"px");
}

