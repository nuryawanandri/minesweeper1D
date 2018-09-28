var rowElem = document.getElementById('row')
var boxLengthElem = document.getElementById('boxLength')
var totalBombElem = document.getElementById('totalBomb')
var inputContentElem = document.getElementById('inputContent')
var startButtonElem = document.getElementById('startButton')
var alertElem = document.getElementById('alert')
var emojiElem = document.createElement('span')

var lengthMin = 0
var boxes = []
var boxLength = 0
var totalBomb = 0
var winConditionOpenBox = 0
var openedBox = 0
var stringBomb = '💣'
var smile = '🙂'
var smileO = '😯'
var smileSad = '☹️'

emojiElem.id = 'emoji'
emojiElem.textContent = smile
emojiElem.onclick = resetGame

function resetGame () {
  location.reload()
}

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
  renderEmoji()
  boxes.map((box, index) => {
    renderBoard(box, index)
  })
  startButtonElem.style.display = 'none'
}

function renderEmoji () {
  var boxElem = document.createElement('div')
  boxElem.setAttribute('class', 'box emoji-box')
  boxElem.appendChild(emojiElem)
  rowElem.appendChild(boxElem)
}

function renderBoard (box, index) {
  var boxElem = document.createElement('div')
  boxElem.setAttribute('class', 'box')
  boxElem.setAttribute('data-box', box)
  boxElem.id = `${index}`
  boxElem.onclick = onCheckBox(`${index}`)
  boxElem.onmousedown = changeEmoji('down')
  boxElem.onmouseup = changeEmoji('up')
  rowElem.appendChild(boxElem)
}

function changeEmoji (mouseBehave) {
  return () => {
    if (mouseBehave == 'down') {
      emojiElem.textContent = smileO
    } else if (mouseBehave == 'up') {
      emojiElem.textContent = smile
    }
  }
}

function onCheckBox (IdBox) {
  return () => {
    var boxSelected = document.getElementById(IdBox)
    var dataBox = boxSelected.getAttribute('data-box')
    if (dataBox == '*') {
      boxSelected.textContent = stringBomb
      boxSelected.style.background = 'red'
      alertElem.textContent = 'Game Over!!!'
      emojiElem.textContent = smileSad
      alert('Game Over!!!')
      openBomb()
    } else {
      openBox(IdBox)
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

function disableBox () {
  boxes.map((box, index) => {
    var boxElem = document.getElementById(index)
    boxElem.onclick = ''
  })
}

function openBox (idBox) {
  var boxSelected = document.getElementById(idBox)
  var dataBox = boxSelected.getAttribute('data-box')
  var isBoxClosed = boxSelected.textContent == '' ? true : false
  var idBox = parseInt(idBox)

  boxSelected.textContent = dataBox
  boxSelected.className += ' open'

  if (!isBoxClosed) {
    return
  }
  
  checkWin()
  if (dataBox === '0') {
    if (idBox + 1 < boxes.length) {
      openBox(idBox + 1)
    }
    if (idBox - 1 >= 0) {
      openBox(idBox - 1)
    }
  }
}

function checkWin () {
  openedBox++
  if (winConditionOpenBox == openedBox) {
    alertElem.textContent = 'Congratulation You Beat The Game!!'
    disableBox()
  }
}
