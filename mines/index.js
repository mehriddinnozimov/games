"use strict";
var FieldType;
(function (FieldType) {
    FieldType[FieldType["Empty"] = 0] = "Empty";
    FieldType["Mined"] = "B";
})(FieldType || (FieldType = {}));
var ButtonValueType;
(function (ButtonValueType) {
    ButtonValueType["Empty"] = "\u00A0";
    ButtonValueType["Mined"] = "!";
    ButtonValueType["MaybeMined"] = "?";
})(ButtonValueType || (ButtonValueType = {}));
class Mines {
    rootElement;
    width;
    height;
    percentMines;
    board = [];
    checkedFields = [];
    minesCount = 0;
    foundedMinesCount = 0;
    guessedMinesCount = 0;
    MINIUM_WIDTH = 2;
    MINIUM_HEIGHT = 2;
    MINIUM_PERCENT_MINES = 10;
    MAXIUM_PERCENT_MINES = 80;
    dashboardDivElement = document.createElement("div");
    boardDivElement = document.createElement("div");
    constructor(rootElement, width, height, percentMines) {
        this.rootElement = rootElement;
        this.width = width;
        this.height = height;
        this.percentMines = percentMines;
        if (width < this.MINIUM_WIDTH) {
            throw Error(`Width must be larger than ${this.MINIUM_WIDTH}`);
        }
        if (height < this.MINIUM_HEIGHT) {
            throw Error(`Height must be larger than ${this.MINIUM_HEIGHT}`);
        }
        if (percentMines < this.MINIUM_PERCENT_MINES) {
            throw Error(`Persent Mines must be larger than ${this.MINIUM_PERCENT_MINES}%`);
        }
        if (percentMines > this.MAXIUM_PERCENT_MINES) {
            throw Error(`Persent Mines cannot be larger than ${this.MAXIUM_PERCENT_MINES}%`);
        }
    }
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    around(hIndex, wIndex, callback) {
        for (let currentHIndex = hIndex - 1; currentHIndex <= hIndex + 1; currentHIndex++) {
            if (currentHIndex < 0)
                continue;
            if (currentHIndex >= this.board.length)
                break;
            const hBoard = this.board[currentHIndex];
            for (let currentWIndex = wIndex - 1; currentWIndex <= wIndex + 1; currentWIndex++) {
                if (currentWIndex < 0)
                    continue;
                if (currentWIndex >= hBoard.length)
                    break;
                if (hIndex === currentHIndex && wIndex === currentWIndex)
                    continue;
                callback(currentWIndex, currentHIndex, hBoard);
            }
        }
    }
    makeButton(hIndex, wIndex) {
        const button = document.createElement("button");
        button.value = "&nbsp";
        button.style.width = "50px";
        button.style.height = "50px";
        button.style.margin = "5px";
        button.id = `button-${hIndex}-${wIndex}`;
        button.classList.add("hw-button");
        button.innerText = ButtonValueType.Empty;
        button.addEventListener("click", (e) => {
            this.check(hIndex, wIndex, true);
        });
        let added = false;
        button.addEventListener("auxclick", (e) => {
            const field = this.board[hIndex][wIndex];
            if (button.innerText === ButtonValueType.Empty) {
                button.innerText = ButtonValueType.Mined;
                if (!added) {
                    added = true;
                    this.guessedMinesCount++;
                    if (field === FieldType.Mined) {
                        this.foundedMinesCount++;
                    }
                }
            }
            else if (button.innerText === ButtonValueType.Mined) {
                button.innerText = ButtonValueType.MaybeMined;
                if (added) {
                    this.guessedMinesCount--;
                    added = false;
                    if (field === FieldType.Mined) {
                        this.foundedMinesCount--;
                    }
                }
            }
            else if (button.innerText === ButtonValueType.MaybeMined) {
                button.innerText = ButtonValueType.Empty;
            }
            this.updateResult();
            if (this.foundedMinesCount === this.minesCount && this.foundedMinesCount === this.guessedMinesCount) {
                this.gameOver("You win!");
            }
        });
        return button;
    }
    message(text) {
        const messageSpanElement = document.getElementById("message-span");
        if (!messageSpanElement)
            return;
        messageSpanElement.innerText = ` ${text}`;
    }
    gameOver(message) {
        this.message(message);
        for (let button of document.getElementsByClassName("hw-button")) {
            button.setAttribute("disabled", "true");
        }
    }
    check(hIndex, wIndex, stopWhenClickMined = false) {
        const checkedField = this.checkedFields.find(f => f.hIndex === hIndex && f.wIndex === wIndex);
        if (checkedField)
            return;
        this.checkedFields.push({
            wIndex,
            hIndex
        });
        const button = document.getElementById(`button-${hIndex}-${wIndex}`);
        if (!button)
            return;
        button.innerText = ButtonValueType.Empty;
        button.setAttribute("disabled", "true");
        const field = this.board[hIndex][wIndex];
        if (field === FieldType.Mined && stopWhenClickMined) {
            this.gameOver("Game Over. You lost!");
            return;
        }
        if (field === FieldType.Empty) {
            this.around(hIndex, wIndex, (currentWIndex, currentHIndex, hBoard) => {
                this.check(currentHIndex, currentWIndex);
            });
            return;
        }
        button.innerText = String(field);
    }
    updateResult() {
        const resultSpanElement = document.getElementById("result-span");
        if (!resultSpanElement)
            return;
        resultSpanElement.innerText = String(this.guessedMinesCount);
    }
    makeDashboard() {
        while (this.dashboardDivElement.firstChild) {
            const lastElement = this.dashboardDivElement.lastChild;
            if (lastElement === null)
                break;
            this.dashboardDivElement.removeChild(lastElement);
        }
        const resultDivElement = document.createElement("div");
        const resultSpanElement = document.createElement("span");
        resultSpanElement.id = "result-span";
        resultSpanElement.innerText = String(this.guessedMinesCount);
        const startContent = document.createTextNode("Found: ");
        const endContent = document.createTextNode(`/${this.minesCount}`);
        const messageSpanElement = document.createElement("span");
        messageSpanElement.id = "message-span";
        messageSpanElement.innerText = "";
        resultDivElement.appendChild(startContent);
        resultDivElement.appendChild(resultSpanElement);
        resultDivElement.appendChild(endContent);
        resultDivElement.appendChild(messageSpanElement);
        this.dashboardDivElement.appendChild(resultDivElement);
        const restartButton = document.createElement("button");
        restartButton.innerText = "Restart";
        restartButton.addEventListener("click", () => {
            this.start();
        });
        const restartButtonWrapper = document.createElement("div");
        restartButtonWrapper.appendChild(restartButton);
        const heightInputLabel = document.createElement("label");
        heightInputLabel.innerText = "Height: ";
        const heightInput = document.createElement("input");
        heightInput.type = "number";
        heightInput.value = String(this.height);
        heightInput.addEventListener("change", () => {
            this.height = Number(heightInput.value);
        });
        const heightInputWrapper = document.createElement("div");
        heightInputWrapper.appendChild(heightInputLabel);
        heightInputWrapper.appendChild(heightInput);
        const widthInputLabel = document.createElement("label");
        widthInputLabel.innerText = "Width: ";
        const widthInput = document.createElement("input");
        widthInput.type = "number";
        widthInput.value = String(this.height);
        widthInput.addEventListener("change", () => {
            this.width = Number(widthInput.value);
        });
        const widthInputWrapper = document.createElement("div");
        widthInputWrapper.appendChild(widthInputLabel);
        widthInputWrapper.appendChild(widthInput);
        const percentInputLabel = document.createElement("label");
        percentInputLabel.innerText = "Percent: ";
        const percentInput = document.createElement("input");
        percentInput.type = "number";
        percentInput.value = String(this.percentMines);
        percentInput.addEventListener("change", () => {
            this.percentMines = Number(percentInput.value);
        });
        const percentInputWrapper = document.createElement("div");
        percentInputWrapper.appendChild(percentInputLabel);
        percentInputWrapper.appendChild(percentInput);
        this.dashboardDivElement.appendChild(restartButtonWrapper);
        this.dashboardDivElement.appendChild(heightInputWrapper);
        this.dashboardDivElement.appendChild(widthInputWrapper);
        this.dashboardDivElement.appendChild(percentInputWrapper);
    }
    init() {
        this.board = [];
        this.checkedFields = [];
        this.minesCount = Math.floor(((this.width * this.height) / 100) * this.percentMines);
        this.foundedMinesCount = 0;
        this.guessedMinesCount = 0;
        while (this.rootElement.firstChild) {
            const lastElement = this.rootElement.lastChild;
            if (lastElement === null)
                break;
            this.rootElement.removeChild(lastElement);
        }
        this.rootElement.appendChild(this.dashboardDivElement);
        this.rootElement.appendChild(this.boardDivElement);
        for (let h = 0; h < this.height; h++) {
            const hBoard = [];
            for (let w = 0; w < this.width; w++) {
                hBoard.push(FieldType.Empty);
            }
            this.board.push(hBoard);
        }
    }
    makeBoard() {
        while (this.boardDivElement.firstChild) {
            const lastElement = this.boardDivElement.lastChild;
            if (lastElement === null)
                break;
            this.boardDivElement.removeChild(lastElement);
        }
        for (let hIndex = 0; hIndex < this.board.length; hIndex++) {
            const hBoard = this.board[hIndex];
            const wrapperDivElement = document.createElement("div");
            for (let wIndex = 0; wIndex < hBoard.length; wIndex++) {
                const button = this.makeButton(hIndex, wIndex);
                wrapperDivElement.appendChild(button);
            }
            this.boardDivElement.appendChild(wrapperDivElement);
        }
    }
    start() {
        this.init();
        let addedminesCount = 0;
        while (addedminesCount < this.minesCount) {
            const hIndex = this.getRandomNumber(0, this.board.length - 1);
            const hBoard = this.board[hIndex];
            const wIndex = this.getRandomNumber(0, hBoard.length - 1);
            const field = hBoard[wIndex];
            if (field !== FieldType.Mined) {
                addedminesCount++;
                hBoard[wIndex] = FieldType.Mined;
                this.around(hIndex, wIndex, (currentWIndex, currentHIndex, hBoard) => {
                    const field = hBoard[currentWIndex];
                    if (field !== FieldType.Mined) {
                        hBoard[currentWIndex] = field + 1;
                    }
                });
            }
        }
        console.table(this.board);
        this.makeBoard();
        this.makeDashboard();
    }
}
function main() {
    const app = document.getElementById("app");
    if (!app)
        return;
    const div = document.createElement("div");
    const mines = new Mines(div, 4, 4, 25);
    app.appendChild(div);
    mines.start();
}
main();
