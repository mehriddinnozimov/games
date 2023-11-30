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
    board = [];
    fields = [];
    minesCount = 0;
    foundMinesCount = 0;
    guessedMinesCount = 0;
    width = 4;
    height = 4;
    percentMines = 25;
    dashboardDivElement = document.createElement("div");
    boardDivElement = document.createElement("div");
    constructor(rootElement) {
        this.rootElement = rootElement;
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
    makeField(hIndex, wIndex) {
        const button = document.createElement("button");
        const field = {
            hIndex,
            wIndex,
            button,
            checked: false
        };
        button.value = "&nbsp";
        button.id = `button-${hIndex}-${wIndex}`;
        button.classList.add("hw-button");
        button.innerText = ButtonValueType.Empty;
        button.addEventListener("click", (e) => {
            this.check(field, true);
        });
        button.addEventListener("auxclick", (e) => {
            const value = this.board[hIndex][wIndex];
            if (button.innerText === ButtonValueType.Empty) {
                button.innerText = ButtonValueType.Mined;
                this.guessedMinesCount++;
                if (value === FieldType.Mined) {
                    this.foundMinesCount++;
                }
            }
            else if (button.innerText === ButtonValueType.Mined) {
                button.innerText = ButtonValueType.MaybeMined;
                if (value === FieldType.Mined) {
                    this.foundMinesCount--;
                }
            }
            else if (button.innerText === ButtonValueType.MaybeMined) {
                button.innerText = ButtonValueType.Empty;
                this.guessedMinesCount--;
            }
            this.updateResult();
            if (this.foundMinesCount === this.minesCount && this.foundMinesCount === this.guessedMinesCount) {
                this.gameOver("You win!");
            }
        });
        return field;
    }
    message(text) {
        const messageSpanElement = document.getElementById("message-span");
        if (!messageSpanElement)
            return;
        messageSpanElement.innerText = ` ${text}`;
    }
    gameOver(message) {
        this.message(message);
        for (let field of this.fields) {
            field.button.setAttribute("disabled", "true");
            const value = this.board[field.hIndex][field.wIndex];
            if (value != 0)
                field.button.innerText = String(value);
        }
    }
    check(field, stopWhenClickMined = false) {
        if (field.checked)
            return;
        field.checked = true;
        field.button.innerText = ButtonValueType.Empty;
        field.button.setAttribute("disabled", "true");
        const value = this.board[field.hIndex][field.wIndex];
        if (value === FieldType.Mined && stopWhenClickMined) {
            this.gameOver("Game Over. You lost!");
            return;
        }
        if (value === FieldType.Empty) {
            this.around(field.hIndex, field.wIndex, (currentWIndex, currentHIndex) => {
                const field = this.fields.find(f => f.hIndex === currentHIndex && f.wIndex === currentWIndex);
                if (!field)
                    return;
                this.check(field);
            });
            return;
        }
        field.button.innerText = String(value);
    }
    updateResult() {
        const resultSpanElement = document.getElementById("result-span");
        if (!resultSpanElement)
            return;
        resultSpanElement.innerText = String(this.guessedMinesCount);
    }
    clearElement(element) {
        while (element.firstChild) {
            const lastElement = element.lastChild;
            if (lastElement === null)
                break;
            element.removeChild(lastElement);
        }
    }
    makeDashboard() {
        this.clearElement(this.dashboardDivElement);
        const resultDivElement = document.createElement("div");
        const resultSpanElement = document.createElement("span");
        resultSpanElement.id = "result-span";
        resultSpanElement.innerText = String(this.guessedMinesCount);
        const startContent = document.createTextNode("Guessed: ");
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
        widthInput.value = String(this.width);
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
        this.fields = [];
        this.minesCount = Math.floor(((this.width * this.height) / 100) * this.percentMines);
        this.foundMinesCount = 0;
        this.guessedMinesCount = 0;
        this.clearElement(this.rootElement);
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
                const field = this.makeField(hIndex, wIndex);
                this.fields.push(field);
                wrapperDivElement.appendChild(field.button);
            }
            this.boardDivElement.appendChild(wrapperDivElement);
        }
    }
    generateMines() {
        let addedMinesCount = 0;
        while (addedMinesCount < this.minesCount) {
            const hIndex = this.getRandomNumber(0, this.board.length - 1);
            const hBoard = this.board[hIndex];
            const wIndex = this.getRandomNumber(0, hBoard.length - 1);
            const field = hBoard[wIndex];
            if (field !== FieldType.Mined) {
                addedMinesCount++;
                hBoard[wIndex] = FieldType.Mined;
                this.around(hIndex, wIndex, (currentWIndex, currentHIndex, hBoard) => {
                    const field = hBoard[currentWIndex];
                    if (field !== FieldType.Mined) {
                        hBoard[currentWIndex] = field + 1;
                    }
                });
            }
        }
    }
    start() {
        this.init();
        this.generateMines();
        this.makeBoard();
        this.makeDashboard();
        console.table(this.board);
    }
}
function main() {
    const app = document.getElementById("app");
    if (!app)
        return;
    const div = document.createElement("div");
    const mines = new Mines(div);
    app.appendChild(div);
    mines.start();
}
main();
