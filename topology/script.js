
const maxLayers = 10;
const pixelWidth = 5;


const canvasTD = document.getElementById("canvas_top-down");
const ctxTD = canvasTD.getContext("2d");

const canvasTDbounds = canvasTD.getBoundingClientRect()
const widthTD = canvasTDbounds.width;
const heightTD = canvasTDbounds.height;
canvasTD.width = widthTD;
canvasTD.height = heightTD;

let pixels = new Array(Math.ceil(heightTD / pixelWidth));
for (let i=0; i<pixels.length; i++) {
  pixels[i] = new Array(Math.ceil(widthTD / pixelWidth)).fill(0);
}


function drawGrid() {
  ctxTD.clearRect(0, 0, widthTD, heightTD);

  for (let i=0; i<pixels.length; i++) {
    for (let j=0; j<pixels[0].length; j++) {
      let colour = "hsl(200, 50%, " + ((pixels[i][j]/maxLayers)*80 + 15) + "%)";
      ctxTD.fillStyle = colour;
      ctxTD.fillRect(j*pixelWidth, i*pixelWidth, pixelWidth, pixelWidth);
    }
  }
}


const canvasSO = document.getElementById("canvas_side-on");
const ctxSO = canvasSO.getContext("2d");

const widthSO = canvasTD.getBoundingClientRect().width;
const heightSO = canvasTD.getBoundingClientRect().height;
canvasSO.width = widthSO;
canvasSO.height = heightSO;

let angle = 0


function average(values) {
  let sum = values.reduce((sum, v) => sum + v, 0);
  return sum / values.length;
}

function smoothArray(values, alpha) {
  let weighted = average(values) * alpha;
  let smoothed = [];

  for (var i in values) {
    i = Number(i);
    let prev = values[i-1] || 0;
    let curr = values[i];
    let next = values[i+1] || 0;

    if (curr === 0 && prev === 0 && next === 0) {
      smoothed.push(0)
    }
    else {
      smoothed.push(average([weighted, prev, curr, next]));
    }
  }

  return smoothed;
}

function smoothArray2(values, alpha) {
  let smoothed = [];

  for (var i in values) {
    i = Number(i);
    let prevprev = values[i-2] || 0;
    let prev = values[i-1] || 0;
    let curr = values[i];
    let next = values[i+1] || 0;
    let nextnext = values[i+2] || 0;

    smoothed.push(average([prevprev * alpha / 2, prev * alpha, curr, next * alpha, nextnext * alpha / 2]));
  }

  return smoothed;
}


// 3 4 5
// 2   6
// 1 0 7


function getQuarterRotate1() {
  let width = pixels.length;
  let center = Math.floor(2 * width / 3);

  rotatedPixels = [];
  for (let i=center; i>0; i--) {
    let initialLoc = [i, 0];
    let currRow = [];

    for (let j=0; j<width-i; j++) {
      currRow.push(pixels[initialLoc[0]+j][initialLoc[1]+j]);
    }
    rotatedPixels.push(currRow);
  }

  for (let i=0; i<=center; i++) {
    let initialLoc = [0, i];
    let currRow = [];
    
    for (let j=1; j<width-i; j++) {
      currRow.push(pixels[initialLoc[0]+j][initialLoc[1]+j]);
    }
    rotatedPixels.push(currRow);
  }

  return rotatedPixels;
}


function getQuarterRotate3() {
  let width = pixels.length;
  let center = Math.floor(2 * width / 3);

  rotatedPixels = [];
  for (let i=center; i>0; i--) {
    let initialLoc = [i, width-1];
    let currRow = [];

    for (let j=0; j<width-i; j++) {
      currRow.push(pixels[initialLoc[0]+j][initialLoc[1]-j]);
    }
    rotatedPixels.push(currRow);
  }

  for (let i=0; i<=center; i++) {
    let initialLoc = [0, width-i-1];
    let currRow = [];

    for (let j=1; j<width-i; j++) {
      currRow.push(pixels[initialLoc[0]+j][initialLoc[1]-j]);
    }
    rotatedPixels.push(currRow);
  }

  return rotatedPixels;
}


function getQuarterRotate5() {
  let width = pixels.length;
  let center = Math.floor(2 * width / 3);

  rotatedPixels = [];
  for (let i=-center; i<0; i++) {
    let initialLoc = [width+i, width-1];
    let currRow = [];

    for (let j=0; j<=width+i; j++) {
      currRow.push(pixels[initialLoc[0]-j][initialLoc[1]-j]);
    }
    rotatedPixels.push(currRow);
  }

  for (let i=0; i<=center; i++) {
    let initialLoc = [width, width-i-1];
    let currRow = [];
    
    for (let j=1; j<width-i; j++) {
      currRow.push(pixels[initialLoc[0]-j][initialLoc[1]-j]);
    }
    rotatedPixels.push(currRow);
  }

  return rotatedPixels;
}

function getQuarterRotate7() {
  let width = pixels.length;
  let center = Math.floor(2 * width / 3);

  rotatedPixels = [];
  for (let i=-center; i<0; i++) {
    let initialLoc = [width+i, 0];
    let currRow = [];

    for (let j=0; j<=width+i; j++) {
      currRow.push(pixels[initialLoc[0]-j][initialLoc[1]+j]);
    }
    rotatedPixels.push(currRow);
  }

  for (let i=0; i<=center; i++) {
    let initialLoc = [width, i];
    let currRow = [];
    
    for (let j=1; j<width-i; j++) {
      currRow.push(pixels[initialLoc[0]-j][initialLoc[1]+j]);
    }
    rotatedPixels.push(currRow);
  }

  return rotatedPixels;
}


function drawResult() {
  ctxSO.clearRect(0, 0, widthSO, heightSO);

  let rotatedPixels = []
  console.log(angle)
  switch (angle) {
    case 0:
      rotatedPixels = pixels[0].map((val, index) => pixels.map(row => row[index]).reverse());
      break;
    case 1:
      rotatedPixels = getQuarterRotate1();
      break;
    case 2:
      rotatedPixels = pixels.map(row => [...row].reverse()).reverse();
      break;
    case 3:
      rotatedPixels = getQuarterRotate3();
      break;
    case 4:
      rotatedPixels = pixels[0].map((val, index) => pixels.map(row => row[row.length-1-index]));
      break;
    case 5:
      rotatedPixels = getQuarterRotate5();
      break;
    case 6:
      rotatedPixels = pixels;
      break;
    case 7:
      rotatedPixels = getQuarterRotate7();
      break;
    default:
      console.log("not yet")
  }

  let barWidth = Math.ceil(widthSO / rotatedPixels.length);

  let heights = [0];
  for (let i=0; i<rotatedPixels.length; i++) {
    let height = (Math.max(...rotatedPixels[i]) / maxLayers) * heightSO;
    heights.push(height);
  }
  heights.push(0);

  let smoothedHeights = smoothArray2(heights, 0.5);

  ctxSO.fillStyle = "#212";
  ctxSO.beginPath();
  ctxSO.moveTo(0, heightSO);
  for (let i=0; i<smoothedHeights.length; i++) {
    let height = smoothedHeights[i];
    ctxSO.lineTo(barWidth*i, heightSO-height);
  }
  ctxSO.lineTo(widthSO, heightSO);
  ctxSO.fill();
}


let prevPixel = [null, null];
let prevPixels = [];
let raise = true;
const brushSize = 30;

function handleMouseDrag(event) {

  let offsetX = event.offsetX;
  let offsetY = event.offsetY;

  let pixelLoc = [Math.floor(offsetX / pixelWidth), Math.floor(offsetY / pixelWidth)];
  if (pixelLoc[0] === prevPixel[0] && pixelLoc[1] === prevPixel[1]) return;

  let paintPixels = [
    pixelLoc,
    [pixelLoc[0]-1, pixelLoc[1]-1], [pixelLoc[0]-1, pixelLoc[1]], [pixelLoc[0]-1, pixelLoc[1]+1],
    [pixelLoc[0], pixelLoc[1]-1], [pixelLoc[0], pixelLoc[1]], [pixelLoc[0], pixelLoc[1]+1],
    [pixelLoc[0]+1, pixelLoc[1]-1], [pixelLoc[0]+1, pixelLoc[1]], [pixelLoc[0]+1, pixelLoc[1]+1]
  ]

  if (raise) {
    for (let pixel of paintPixels) {
      if (prevPixels.indexOf(pixel[0]+","+pixel[1]) === -1 && pixels[pixel[1]][pixel[0]] < maxLayers) {
        pixels[pixel[1]][pixel[0]] += 1;
      }
    }
    prevPixels = JSON.stringify(paintPixels);
    drawGrid();
    drawResult();
  }
  else {
    for (let pixel of paintPixels) {
      if (prevPixels.indexOf(pixel[0]+","+pixel[1]) === -1 && pixels[pixel[1]][pixel[0]] > 0) {
        pixels[pixel[1]][pixel[0]] -= 1;
      }
    }
    prevPixels = JSON.stringify(paintPixels);
    drawGrid();
    drawResult();
  }
}

function handleMouseDown(event) {
  canvasTD.addEventListener("mousemove", handleMouseDrag);

  switch (event.button) {
    case 0:
      raise = true;
      break;
    case 2:
      raise = false;
      break;
    default:
      break;
  }

  handleMouseDrag(event);
}

function handleMouseUp() {
  canvasTD.removeEventListener("mousemove", handleMouseDrag);
  prevPixel = [null, null];
}

canvasTD.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mouseup", handleMouseUp);



const cursor = document.getElementById("topology_cursor");

function followCursor(event) {
  cursor.style.translate = (event.clientX - canvasTDbounds.left - brushSize/2) + "px " + (event.clientY - canvasTDbounds.top - brushSize/2) + "px";
}

document.addEventListener("mousemove", followCursor);


drawGrid();
drawResult();


function rotateAnticlockwise() {
  angle = (angle + 1) % 8;
  drawResult();
}

function rotateClockwise() {
  angle = angle - 1;
  if (angle < 0) angle += 8;
  drawResult();
}
