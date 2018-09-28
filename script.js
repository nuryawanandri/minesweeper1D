var rowElem = document.getElementById('row')
var boxLengthElem = document.getElementById('boxLength')
var totalBombElem = document.getElementById('totalBomb')
var inputContentElem = document.getElementById('inputContent')
var startButtonElem = document.getElementById('startButton')
var alertElem = document.getElementById('alert')

var lengthMin = 0
var boxes = []
var boxLength = 0
var totalBomb = 0
var winConditionOpenBox = 0
var openedBox = 0
var stringBomb = '💣'

function getBoxLengthAndTotalBomb () {
  if (boxLengthElem.value > lengthMin) {
    boxLength = boxLengthElem.value
    var maxBomb = Math.ceil(boxLength/3)
    if (totalBombElem.value <= maxBomb) {
      totalBomb = totalBombElem.value
      inputContentElem.style.display = 'none'
      startGame()
      // startButtonElem.style.display = 'block'
    } else {
      alertElem.textContent = 'Jumlah Bomb terlalu banyak, Jumlah Bomb maksimal 1/3 dari panjang Box'
    }
  } else {
    alertElem.textContent = `Jumlah kotak minimal ${lengthMin+1}`
  }
}

function startGame () {
  alertElem.textContent = ''
  winConditionOpenBox = boxLength - totalBomb
  for (var i = 0; i < boxLength; i++) {
    boxes.push(0)
  }

  var bombPlaced = 0
  while (bombPlaced < totalBomb) {
    var randomLocBomb = Math.floor(Math.random()*boxLength)
    if (boxes[randomLocBomb] === 0) {
      boxes[randomLocBomb] = '*'
      if (randomLocBomb !== 0) {
        if (boxes[randomLocBomb-1] !== '*') {
          boxes[randomLocBomb-1] += 1
        }
      }
      if (randomLocBomb !== boxLength -1) {
        if (boxes[randomLocBomb+1] !== '*') {
          boxes[randomLocBomb+1] += 1
        }
      }
      bombPlaced++
    }  
  }

  console.log('boxes : ', boxes)
  boxes.map((box, index) => {
    renderBoard(box, index)
  })
  startButtonElem.style.display = 'none'
}

function renderBoard (box, index) {
  var boxElem = document.createElement('div')
  boxElem.setAttribute('class', 'box')
  boxElem.setAttribute('data-box', box)
  boxElem.id = `${index}`
  boxElem.onclick = onCheckBox(`${index}`)
  rowElem.appendChild(boxElem)
}

function onCheckBox (IdBox) {
  return () => {
    var boxSelected = document.getElementById(IdBox)
    var dataBox = boxSelected.getAttribute('data-box')
    if (dataBox == '*') {
      boxSelected.textContent = stringBomb
      boxSelected.style.background = 'red'
      alertElem.textContent = 'Game Over!!!'
      openBomb()
    } else {
      checkBox(IdBox)
    }
  }
}

function openBomb () {
  boxes.map((box, index) => {
    var boxElem = document.getElementById(index)
    if (box === '*') {
      boxElem.innerText = stringBomb
    }
    boxElem.onclick = ''
  })
}

function checkBox (IdBox) {
  var boxSelected = document.getElementById(IdBox)
  var dataBox = boxSelected.getAttribute('data-box')
  boxSelected.textContent = dataBox
  checkWin()
  if (dataBox === '0') {
    var openNextBox = true
    var nextBox = parseInt(IdBox)+1
    
    while (openNextBox) {
      if (nextBox < boxLength) {
        var boxNext = document.getElementById(nextBox)
        var dataNextBox = boxNext.getAttribute('data-box')
        if (dataNextBox !== '*') {
          boxNext.textContent = dataNextBox
          nextBox++
          checkWin()
        } else {
          openNextBox = false
        }
      } else {
        openNextBox = false
      }
    }
    

    var openBeforeBox = true
    var beforeBox = parseInt(IdBox)-1

    while (openBeforeBox) {
      if (beforeBox >= 0) {
        var boxBefore = document.getElementById(beforeBox)
        var dataBeforeBox = boxBefore.getAttribute('data-box')
        if (dataBeforeBox !== '*') {
          boxBefore.textContent = dataBeforeBox
          beforeBox--
          checkWin()
        } else {
          openBeforeBox = false
        }
      } else {
        openBeforeBox = false
      }
    }

  }
}

function checkWin () {
  openedBox++
  if (winConditionOpenBox == openedBox) {
    alertElem.textContent = 'Congratulation You Beat The Game!!'
  }
}
