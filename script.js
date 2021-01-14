var boardElem = document.getElementById("board");
var rowElem = document.getElementById("row");
var boxLengthElem = document.getElementById("boxLength");
var boxWidthElem = document.getElementById("boxWidth");
var totalBombElem = document.getElementById("totalBomb");
var inputContentElem = document.getElementById("inputContent");
var startButtonElem = document.getElementById("startButton");
var alertElem = document.getElementById("alert");

var lengthMin = 0;
var boxes = [];
var boxLength = 0;
var boxWidth = 0;
var totalBox = 0;
var totalBomb = 0;
var winConditionOpenBox = 0;
var openedBox = 0;
var stringBomb = "💣";

function getBoxLengthAndTotalBomb() {
  if (boxLengthElem.value > lengthMin && boxWidthElem.value > lengthMin) {
    boxLength = boxLengthElem.value;
    boxWidth = boxWidthElem.value;
    totalBox = boxLength * boxWidth;
    var maxBomb = Math.ceil(totalBox / 3);
    if (totalBombElem.value <= maxBomb) {
      totalBomb = totalBombElem.value;
      inputContentElem.style.display = "none";
      startGame();
      // startButtonElem.style.display = 'block'
    } else {
      alertElem.textContent =
        "Jumlah Bomb terlalu banyak, Jumlah Bomb maksimal 1/3 dari panjang Box";
    }
  } else {
    alertElem.textContent = `Jumlah kotak minimal ${lengthMin + 1}`;
  }
}

function startGame() {
  alertElem.textContent = "";
  winConditionOpenBox = totalBox - totalBomb;
  console.log(boxLength, boxWidth);
  for (var i = 0; i < boxLength; i++) {
    var arrayColumn = [];
    for (var j = 0; j < boxWidth; j++) {
      arrayColumn.push(0);
    }
    console.log("arrayColumn : ", arrayColumn);
    boxes.push(arrayColumn);
  }

  console.log(boxes);

  var bombPlaced = 0;
  while (bombPlaced < totalBomb) {
    var randomLocBombY = Math.floor(Math.random() * boxLength);
    var randomLocBombX = Math.floor(Math.random() * boxWidth);
    if (boxes[randomLocBombY][randomLocBombX] === 0) {
      boxes[randomLocBombY][randomLocBombX] = "*";
      // if (randomLocBomb !== 0) {
      //   if (boxes[randomLocBomb - 1] !== "*") {
      //     boxes[randomLocBomb - 1] += 1;
      //   }
      // }
      // if (randomLocBomb !== boxLength - 1) {
      //   if (boxes[randomLocBomb + 1] !== "*") {
      //     boxes[randomLocBomb + 1] += 1;
      //   }
      // }

      console.log("random : ", randomLocBombX, randomLocBombY);

      fillBoxNumber(randomLocBombX - 1, randomLocBombY - 1);
      fillBoxNumber(randomLocBombX, randomLocBombY - 1);
      fillBoxNumber(randomLocBombX + 1, randomLocBombY - 1);
      fillBoxNumber(randomLocBombX - 1, randomLocBombY);
      fillBoxNumber(randomLocBombX + 1, randomLocBombY);
      fillBoxNumber(randomLocBombX - 1, randomLocBombY + 1);
      fillBoxNumber(randomLocBombX, randomLocBombY + 1);
      fillBoxNumber(randomLocBombX + 1, randomLocBombY + 1);

      bombPlaced++;
    }
  }

  console.log("boxes : ", boxes);

  for (var x = 0; x < boxLength; x++) {
    var boxRowElem = document.createElement("div");
    boxRowElem.setAttribute("class", "row");
    for (var y = 0; y < boxWidth; y++) {
      renderBoard(boxes[x][y], x, y, boxRowElem);
    }
    boardElem.appendChild(boxRowElem);
  }

  startButtonElem.style.display = "none";
}

function fillBoxNumber(randomLocX, randomLocY) {
  if (isBoxAvailable(randomLocX, randomLocY)) {
    boxes[randomLocY][randomLocX] += 1;
  }
}

function isBoxAvailable(locX, locY) {
  console.log("isAvail ", locX, locY);
  if (locX < 0 || locX >= boxLength || locY < 0 || locY >= boxWidth) {
    return false;
  }

  if (boxes[locY][locX] === "*") {
    return false;
  }
  return true;
}

function renderBoard(box, x, y, boxRowElem) {
  var boxElem = document.createElement("div");
  boxElem.setAttribute("class", "box");
  boxElem.setAttribute("data-box", box);
  boxElem.id = `${y}-${x}`;
  boxElem.onclick = onCheckBox(`${y}-${x}`);
  boxRowElem.appendChild(boxElem);
}

function onCheckBox(IdBox) {
  return () => {
    var boxSelected = document.getElementById(IdBox);
    var dataBox = boxSelected.getAttribute("data-box");
    if (dataBox == "*") {
      boxSelected.textContent = stringBomb;
      boxSelected.style.background = "red";
      alertElem.textContent = "Game Over!!!";
      openBomb();
    } else {
      checkBox(IdBox);
    }
  };
}

function openBomb() {
  boxes.map((box, index) => {
    var boxElem = document.getElementById(index);
    if (box === "*") {
      boxElem.innerText = stringBomb;
    }
    boxElem.onclick = "";
  });
}

function checkBox(IdBox) {
  var boxSelected = document.getElementById(IdBox);
  var dataBox = boxSelected.getAttribute("data-box");
  boxSelected.textContent = dataBox;
  checkWin();
  if (dataBox === "0") {
    openNeighborBox(IdBox);
    // while (openNextBox) {
    //   if (nextBox < boxLength) {
    //     var boxNext = document.getElementById(nextBox);
    //     var dataNextBox = boxNext.getAttribute("data-box");
    //     if (dataNextBox !== "*") {
    //       boxNext.textContent = dataNextBox;
    //       nextBox++;
    //       checkWin();
    //     } else {
    //       openNextBox = false;
    //     }
    //   } else {
    //     openNextBox = false;
    //   }
    // }

    // var openBeforeBox = true;
    // var beforeBox = parseInt(IdBox) - 1;

    // while (openBeforeBox) {
    //   if (beforeBox >= 0) {
    //     var boxBefore = document.getElementById(beforeBox);
    //     var dataBeforeBox = boxBefore.getAttribute("data-box");
    //     if (dataBeforeBox !== "*") {
    //       boxBefore.textContent = dataBeforeBox;
    //       beforeBox--;
    //       checkWin();
    //     } else {
    //       openBeforeBox = false;
    //     }
    //   } else {
    //     openBeforeBox = false;
    //   }
    // }
  }
}

function openNeighborBox(idBomb) {
  var queueToOpen = new Set();
  queueToOpen.add(idBomb);

  do {
    var arrQueueToOpen = [...queueToOpen];
    var currentIdBomb = arrQueueToOpen.shift();
    queueToOpen.delete(currentIdBomb);

    var arrLoc = currentIdBomb.split("-");
    var locX = parseInt(arrLoc[0]);
    var locY = parseInt(arrLoc[1]);

    var dataOpened = openBox(currentIdBomb);

    if (dataOpened === "0") {
      checkNeighbor(locX - 1, locY - 1, queueToOpen);
      checkNeighbor(locX, locY - 1, queueToOpen);
      checkNeighbor(locX + 1, locY - 1, queueToOpen);
      checkNeighbor(locX - 1, locY, queueToOpen);
      checkNeighbor(locX + 1, locY, queueToOpen);
      checkNeighbor(locX - 1, locY + 1, queueToOpen);
      checkNeighbor(locX, locY + 1, queueToOpen);
      checkNeighbor(locX + 1, locY + 1, queueToOpen);
    }

    arrQueueToOpen = [...queueToOpen];
  } while (arrQueueToOpen.length > 0);
}

function checkNeighbor(locX, locY, queueToOpen) {
  if (isBoxAvailable(locX, locY)) {
    var box = document.getElementById(`${locX}-${locY}`);
    if (box.textContent === "") {
      queueToOpen.add(`${locX}-${locY}`);
    }
  }
}

function openBox(idBox) {
  var box = document.getElementById(idBox);
  var dataBox = box.getAttribute("data-box");
  if (dataBox !== "*") {
    box.textContent = dataBox;
    checkWin();
    return dataBox;
  }
}

function checkWin() {
  openedBox++;
  if (winConditionOpenBox == openedBox) {
    alertElem.textContent = "Congratulation You Beat The Game!!";
  }
}
