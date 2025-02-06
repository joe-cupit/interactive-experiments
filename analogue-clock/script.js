let currentTime = new Date();
let currentSeconds = currentTime.getSeconds();


function addSeconds(seconds) {
  currentTime.setMilliseconds(currentTime.getMilliseconds() + seconds * 1000);
}

function resetTime() {
  currentTime = new Date();
  currentSeconds = currentTime.getSeconds();
}

function tick() {
  addSeconds(1);
  currentSeconds += 1;
}

setInterval(tick, 1000);


function renderClock() {
  let hour = currentTime.getHours() / 12;
  let mins = currentTime.getMinutes() / 60;
  let secs = currentTime.getSeconds() / 60;

  hourHand.style.rotate = (360 * (hour + mins / 12)) + "deg";
  minsHand.style.rotate = (360 * (mins + secs / 60)) + "deg";
  secondsHand.style.rotate = (360 * currentSeconds / 60) + "deg";

  let lightAngle = (hour + mins / 12) * Math.PI;
  let xDist = Math.sin(lightAngle) * 6;
  let yDist = -1 * Math.cos(lightAngle) * 8;
  clockHands.style.filter = `drop-shadow(${xDist}px ${yDist}px 1px #4446)`;

  let hue = (hour + mins / 12) * 100;
  if (hue > 100) hue = 200 - hue;
  clockContainer.style.background = `hsl(220, ${hue*0.8}%, ${hue}%)`;
}

setInterval(renderClock, 10);


function handleKeyDown(event) {
  const { key } = event;

  let seconds = 60;

  switch (key) {
    case "ArrowLeft":
    case "ArrowDown":
      event.preventDefault();
      addSeconds(-1 * seconds);
      break;
    case "ArrowRight":
    case "ArrowUp":
      event.preventDefault();
      addSeconds(seconds);
      break;
    default:
      break;
  }
}

document.addEventListener("keydown", handleKeyDown);


let prevLoc = [0, 0];

function calculateDireciton(loc) {
  let dx = loc[0] - prevLoc[0];
  let dy = loc[1] - prevLoc[1];

  let left = loc[0] < centerLoc[0];
  let top = loc[1] < centerLoc[1];

  if (left && top) {
    if (dx > 0 || dy < 0) return 1;
    else return -1;
  }
  else if (left && !top) {
    if (dx < 0 || dy < 0) return 1;
    else return -1;
  }
  else if (!left && top) {
    if (dx > 0 || dy > 0) return 1;
    else return -1;
  }
  else if (!left && !top) {
    if (dx < 0 || dy > 0) return 1;
    else return -1;
  }
  return 1;
}


function onMouseDrag(event) {
  if (document.querySelector(".clock-hand_seconds").contains(event.target)) {
    let changeInSeconds = calculateDireciton([event.clientX, event.clientY]) * 0.25;
    currentSeconds = (currentSeconds + changeInSeconds) % 60;
    addSeconds(changeInSeconds);
  }
  else if (document.querySelector(".clock-hand_mins").contains(event.target)) {
    addSeconds(calculateDireciton([event.clientX, event.clientY]) * 20);
  }
  else if (document.querySelector(".clock-hand_hours").contains(event.target)) {
    addSeconds(calculateDireciton([event.clientX, event.clientY]) * 300);
  }

  prevLoc = [event.clientX, event.clientY];
}

function onMouseDown() {
  document.addEventListener("mousemove", onMouseDrag);
}

function onMouseUp() {
  document.removeEventListener("mousemove", onMouseDrag);
  prevLoc = centerLoc;
}

document.addEventListener("mousedown", onMouseDown);
document.addEventListener("mouseup", onMouseUp);


function handleWindowResize() {
  let centerDimensions = centerElement.getBoundingClientRect();
  centerLoc = [centerDimensions.left + centerDimensions.width / 2, centerDimensions.top + centerDimensions.height / 2];
}

window.addEventListener("resize", handleWindowResize);
