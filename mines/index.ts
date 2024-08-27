enum FieldType {
  Empty = 0,
  Mined = "B"
}

enum ButtonValueType {
  Empty = "\u00A0",
  Mined = "!",
  MaybeMined = "?"
}

type Field = {
  button: HTMLButtonElement
  wIndex: number
  hIndex: number
  checked: boolean
}

class Mines {
  private board: Array<Array<FieldType.Mined | number>> = []
  private fields: Array<Field> = []
  private minesCount: number = 0
  private foundMinesCount: number = 0
  private guessedMinesCount: number = 0

  private width: number = 4
  private height: number = 4
  private percentMines: number = 25

  private readonly dashboardDivElement = document.createElement("div")
  private readonly boardDivElement = document.createElement("div")
  constructor(
    private readonly rootElement: HTMLDivElement
  ) {
  }

  private getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  private around(hIndex: number, wIndex: number, callback: (currentWIndex: number, currentHIndex: number, hBoard: Array<number | typeof FieldType.Mined>) => void) {
    for (let currentHIndex = hIndex - 1; currentHIndex <= hIndex + 1; currentHIndex++) {
      if (currentHIndex < 0) continue;
      if (currentHIndex >= this.board.length) break;

      const hBoard = this.board[currentHIndex]
      for (let currentWIndex = wIndex - 1; currentWIndex <= wIndex + 1; currentWIndex++) {
        if (currentWIndex < 0) continue;
        if (currentWIndex >= hBoard.length) break;
        if (hIndex === currentHIndex && wIndex === currentWIndex) continue;

        callback(currentWIndex, currentHIndex, hBoard)
      }
    }
  }

  private makeField(hIndex: number, wIndex: number) {
    const button = document.createElement("button")

    const field: Field = {
      hIndex,
      wIndex,
      button,
      checked: false
    }

    button.value = "&nbsp"

    button.id = `button-${hIndex}-${wIndex}`
    button.classList.add("hw-button")
    button.innerText = ButtonValueType.Empty

    button.addEventListener("click", (e) => {
      this.check(field, true)
    })

    button.addEventListener("auxclick", (e) => {
      const value = this.board[hIndex][wIndex]
      if (button.innerText === ButtonValueType.Empty) {
        button.innerText = ButtonValueType.Mined
        this.guessedMinesCount++
        if (value === FieldType.Mined) {
          this.foundMinesCount++
        }
      } else
        if (button.innerText === ButtonValueType.Mined) {
          button.innerText = ButtonValueType.MaybeMined
          if (value === FieldType.Mined) {
            this.foundMinesCount--
          }
        } else
          if (button.innerText === ButtonValueType.MaybeMined) {
            button.innerText = ButtonValueType.Empty

            this.guessedMinesCount--
          }

      this.updateResult()
      if (this.foundMinesCount === this.minesCount && this.foundMinesCount === this.guessedMinesCount) {
        this.gameOver("You win!")
      }
    })

    return field
  }

  private message(text: string) {
    const messageSpanElement = document.getElementById("message-span")
    if (!messageSpanElement) return;

    messageSpanElement.innerText = ` ${text}`
  }

  private gameOver(message: string) {
    this.message(message)

    for (let field of this.fields) {
      field.button.setAttribute("disabled", "true")

      const value = this.board[field.hIndex][field.wIndex]
      if(value != 0) field.button.innerText = String(value)
    }
  }

  private check(field: Field, stopWhenClickMined: boolean = false) {
    if (field.checked) return;

    field.checked = true

    field.button.innerText = ButtonValueType.Empty
    field.button.setAttribute("disabled", "true")

    const value = this.board[field.hIndex][field.wIndex]

    if (value === FieldType.Mined && stopWhenClickMined) {
      this.gameOver("Game Over. You lost!")
      return;
    }

    if (value === FieldType.Empty) {
      this.around(field.hIndex, field.wIndex, (currentWIndex, currentHIndex) => {
        const field = this.fields.find(f => f.hIndex === currentHIndex && f.wIndex === currentWIndex)
        if(!field) return;

        this.check(field)
      })
      return;
    }

    field.button.innerText = String(value)
  }

  private updateResult() {
    const resultSpanElement = document.getElementById("result-span")
    if (!resultSpanElement) return;

    resultSpanElement.innerText = String(this.guessedMinesCount)
  }

  private clearElement(element: HTMLElement) {
    while (element.firstChild) {
      const lastElement = element.lastChild
      if (lastElement === null) break;

      element.removeChild(lastElement);
    }
  }

  private makeDashboard() {
    this.clearElement(this.dashboardDivElement)

    const resultDivElement = document.createElement("div")

    const resultSpanElement = document.createElement("span")
    resultSpanElement.id = "result-span"
    resultSpanElement.innerText = String(this.guessedMinesCount)

    const startContent = document.createTextNode("Guessed: ")
    const endContent = document.createTextNode(`/${this.minesCount}`)

    const messageSpanElement = document.createElement("span")
    messageSpanElement.id = "message-span"
    messageSpanElement.innerText = ""

    resultDivElement.appendChild(startContent)
    resultDivElement.appendChild(resultSpanElement)
    resultDivElement.appendChild(endContent)
    resultDivElement.appendChild(messageSpanElement)

    this.dashboardDivElement.appendChild(resultDivElement)

    const restartButton = document.createElement("button")
    restartButton.innerText = "Restart"
    restartButton.addEventListener("click", () => {
      this.start()
    })

    const restartButtonWrapper = document.createElement("div")
    restartButtonWrapper.appendChild(restartButton)

    const heightInputLabel = document.createElement("label")
    heightInputLabel.innerText = "Height: "

    const heightInput = document.createElement("input")
    heightInput.type = "number"
    heightInput.value = String(this.height)

    heightInput.addEventListener("change", () => {
      this.height = Number(heightInput.value)
    })

    const heightInputWrapper = document.createElement("div")
    heightInputWrapper.appendChild(heightInputLabel)
    heightInputWrapper.appendChild(heightInput)

    const widthInputLabel = document.createElement("label")
    widthInputLabel.innerText = "Width: "

    const widthInput = document.createElement("input")
    widthInput.type = "number"
    widthInput.value = String(this.width)

    widthInput.addEventListener("change", () => {
      this.width = Number(widthInput.value)
    })

    const widthInputWrapper = document.createElement("div")
    widthInputWrapper.appendChild(widthInputLabel)
    widthInputWrapper.appendChild(widthInput)

    const percentInputLabel = document.createElement("label")
    percentInputLabel.innerText = "Percent: "

    const percentInput = document.createElement("input")
    percentInput.type = "number"
    percentInput.value = String(this.percentMines)

    percentInput.addEventListener("change", () => {
      this.percentMines = Number(percentInput.value)
    })

    const percentInputWrapper = document.createElement("div")
    percentInputWrapper.appendChild(percentInputLabel)
    percentInputWrapper.appendChild(percentInput)

    this.dashboardDivElement.appendChild(restartButtonWrapper)
    this.dashboardDivElement.appendChild(heightInputWrapper)
    this.dashboardDivElement.appendChild(widthInputWrapper)
    this.dashboardDivElement.appendChild(percentInputWrapper)
  }

  private init() {
    this.board = []
    this.fields = []
    this.minesCount = Math.floor(((this.width * this.height) / 100) * this.percentMines)
    this.foundMinesCount = 0
    this.guessedMinesCount = 0

    this.clearElement(this.rootElement)

    this.rootElement.appendChild(this.dashboardDivElement)
    this.rootElement.appendChild(this.boardDivElement)

    for (let h = 0; h < this.height; h++) {
      const hBoard: FieldType[] = []

      for (let w = 0; w < this.width; w++) {
        hBoard.push(FieldType.Empty)
      }
      this.board.push(hBoard)
    }
  }

  private makeBoard() {
    while (this.boardDivElement.firstChild) {
      const lastElement = this.boardDivElement.lastChild
      if (lastElement === null) break;

      this.boardDivElement.removeChild(lastElement);
    }

    for (let hIndex = 0; hIndex < this.board.length; hIndex++) {
      const hBoard = this.board[hIndex]
      const wrapperDivElement = document.createElement("div")
      for (let wIndex = 0; wIndex < hBoard.length; wIndex++) {
        const field = this.makeField(hIndex, wIndex)
        this.fields.push(field)

        wrapperDivElement.appendChild(field.button)
      }

      this.boardDivElement.appendChild(wrapperDivElement)
    }
  }

  private generateMines() {
    let addedMinesCount = 0
    while (addedMinesCount < this.minesCount) {
      const hIndex = this.getRandomNumber(0, this.board.length - 1)
      const hBoard = this.board[hIndex]

      const wIndex = this.getRandomNumber(0, hBoard.length - 1)

      const field = hBoard[wIndex]
      if (field !== FieldType.Mined) {
        addedMinesCount++
        hBoard[wIndex] = FieldType.Mined
        this.around(hIndex, wIndex, (currentWIndex, currentHIndex, hBoard) => {
          const field = hBoard[currentWIndex]
          if (field !== FieldType.Mined) {
            hBoard[currentWIndex] = field + 1
          }
        })
      }
    }
  }

  public start() {
    this.init()
    this.generateMines()
    this.makeBoard()
    this.makeDashboard()

    console.table(this.board)
  }
}

function main() {
  const app = document.getElementById("app")
  if (!app) return;

  const div = document.createElement("div")

  const mines = new Mines(div)

  app.appendChild(div)
  mines.start()
}

main()