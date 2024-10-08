"use strict";
class Block {
    color;
    emptyColor;
    width;
    height;
    _x;
    _y;
    old_x = 0;
    old_y = 0;
    constructor(color = "black", emptyColor = "black", width = 32, height = 32, _x = 0, _y = 0) {
        this.color = color;
        this.emptyColor = emptyColor;
        this.width = width;
        this.height = height;
        this._x = _x;
        this._y = _y;
    }
    set x(x) {
        this.old_x = this._x;
        this._x = x;
    }
    set y(y) {
        this.old_y = this._y;
        this._y = y;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    clear(ctx) {
        ctx.fillStyle = this.emptyColor;
        ctx.fillRect(this.old_x, this.old_y, this.width, this.height);
    }
    copy() {
        return new Block(this.color, this.emptyColor, this.width, this.height, this._x, this._y);
    }
    static from(block) {
        return new Block(block.color, block.emptyColor, block.width, block.height, block._x, block._y);
    }
}
var Key;
(function (Key) {
    Key["Left"] = "left";
    Key["Right"] = "right";
    Key["Down"] = "down";
    Key["NextFormat"] = "nextFormat";
    Key["PreviousFormat"] = "previousFormat";
    Key["Pause"] = "pause";
})(Key || (Key = {}));
const keys = {
    w: Key.PreviousFormat,
    s: Key.NextFormat,
    a: Key.Left,
    d: Key.Right,
    Space: Key.Down,
    " ": Key.Down,
    p: Key.Pause,
};
var ShapeType;
(function (ShapeType) {
    ShapeType["I"] = "I";
    ShapeType["O"] = "0";
    ShapeType["J"] = "J";
    ShapeType["L"] = "L";
    ShapeType["S"] = "S";
    ShapeType["Z"] = "Z";
    ShapeType["A"] = "A";
})(ShapeType || (ShapeType = {}));
const shapeColors = {
    [ShapeType.I]: "red",
    [ShapeType.O]: "RoyalBlue",
    [ShapeType.J]: "grey",
    [ShapeType.L]: "yellow",
    [ShapeType.S]: "orange",
    [ShapeType.Z]: "green",
    [ShapeType.A]: "purple",
};
const shapeFormats = {
    [ShapeType.I]: 1,
    [ShapeType.O]: 0,
    [ShapeType.J]: 3,
    [ShapeType.L]: 3,
    [ShapeType.S]: 1,
    [ShapeType.Z]: 1,
    [ShapeType.A]: 3,
};
const shapeCoords = {
    [ShapeType.I]: (blockSize, _x = 0, _y = 0, format = 0) => {
        const coords = [];
        let x = _x;
        let y = _y;
        if (format === 0) {
            for (let i = 1; i < 5; i++) {
                coords.push({ x, y });
                y += blockSize;
            }
        }
        else if (format === 1) {
            y += blockSize * 3;
            for (let i = 1; i < 5; i++) {
                coords.push({ x, y });
                x += blockSize;
            }
        }
        return coords;
    },
    [ShapeType.O]: (blockSize, _x = 0, _y = 0, format = 0) => {
        const coords = [];
        let x = _x;
        let y = _y;
        for (let i = 1; i < 5; i++) {
            coords.push({ x, y });
            if (i % 2 == 0) {
                y += blockSize;
                x = _x;
            }
            else {
                x += blockSize;
            }
        }
        return coords;
    },
    [ShapeType.J]: (blockSize, _x = 0, _y = 0, format = 0) => {
        const coords = [];
        let x = _x;
        let y = _y;
        if (format === 0) {
            x += blockSize;
            coords.push({ x, y });
            y += blockSize;
            coords.push({ x, y });
            y += blockSize;
            coords.push({ x, y });
            x = _x;
            coords.push({ x, y });
        }
        else if (format === 1) {
            coords.push({ x, y });
            y += blockSize;
            coords.push({ x, y });
            x += blockSize;
            coords.push({ x, y });
            x += blockSize;
            coords.push({ x, y });
        }
        else if (format === 2) {
            x += blockSize;
            coords.push({ x, y });
            y += blockSize;
            coords.push({ x, y });
            y += blockSize;
            coords.push({ x, y });
            x = _x + blockSize * 2;
            y = _y;
            coords.push({ x, y });
        }
        else if (format === 3) {
            y += blockSize;
            coords.push({ x, y });
            x += blockSize;
            coords.push({ x, y });
            x += blockSize;
            coords.push({ x, y });
            x = _x + blockSize * 2;
            y = _y + blockSize * 2;
            coords.push({ x, y });
        }
        return coords;
    },
    [ShapeType.L]: (blockSize, _x = 0, _y = 0, format = 0) => {
        const coords = [];
        let x = _x;
        let y = _y;
        if (format === 0) {
            coords.push({ x, y });
            y += blockSize;
            coords.push({ x, y });
            y += blockSize;
            coords.push({ x, y });
            x += blockSize;
            coords.push({ x, y });
        }
        else if (format === 1) {
            y += blockSize;
            coords.push({ x, y });
            x += blockSize;
            coords.push({ x, y });
            x += blockSize;
            coords.push({ x, y });
            x = _x;
            y = _y + blockSize * 2;
            coords.push({ x, y });
        }
        else if (format === 2) {
            x += blockSize;
            coords.push({ x, y });
            y += blockSize;
            coords.push({ x, y });
            y += blockSize;
            coords.push({ x, y });
            x = _x;
            y = _y;
            coords.push({ x, y });
        }
        else if (format === 3) {
            y += blockSize;
            coords.push({ x, y });
            x += blockSize;
            coords.push({ x, y });
            x += blockSize;
            coords.push({ x, y });
            x = _x += blockSize * 2;
            y = _y;
            coords.push({ x, y });
        }
        return coords;
    },
    [ShapeType.S]: (blockSize, _x = 0, _y = 0, format = 0) => {
        const coords = [];
        let x = _x;
        let y = _y;
        if (format === 0) {
            y += blockSize;
            coords.push({ x, y });
            x += blockSize;
            coords.push({ x, y });
            y = _y;
            coords.push({ x, y });
            x += blockSize;
            coords.push({ x, y });
        }
        else if (format === 1) {
            coords.push({ x, y });
            y += blockSize;
            coords.push({ x, y });
            x += blockSize;
            coords.push({ x, y });
            y += blockSize;
            coords.push({ x, y });
        }
        return coords;
    },
    [ShapeType.Z]: (blockSize, _x = 0, _y = 0, format = 0) => {
        const coords = [];
        let x = _x;
        let y = _y;
        if (format === 0) {
            coords.push({ x, y });
            x += blockSize;
            coords.push({ x, y });
            y += blockSize;
            coords.push({ x, y });
            x += blockSize;
            coords.push({ x, y });
        }
        else if (format === 1) {
            x = _x + blockSize;
            coords.push({ x, y });
            y += blockSize;
            coords.push({ x, y });
            x = _x;
            coords.push({ x, y });
            y += blockSize;
            coords.push({ x, y });
        }
        return coords;
    },
    [ShapeType.A]: (blockSize, _x = 0, _y = 0, format = 0) => {
        const coords = [];
        let x = _x;
        let y = _y;
        if (format === 0) {
            y += blockSize;
            coords.push({ x, y });
            x += blockSize;
            coords.push({ x, y });
            x += blockSize;
            coords.push({ x, y });
            y = _y;
            x = _x + blockSize;
            coords.push({ x, y });
        }
        else if (format === 1) {
            x = _x + blockSize;
            coords.push({ x, y });
            y += blockSize;
            coords.push({ x, y });
            x += blockSize;
            coords.push({ x, y });
            y += blockSize;
            x = _x + blockSize;
            coords.push({ x, y });
        }
        else if (format === 2) {
            y += blockSize;
            coords.push({ x, y });
            x += blockSize;
            coords.push({ x, y });
            x += blockSize;
            coords.push({ x, y });
            y = _y + blockSize * 2;
            x = _x + blockSize;
            coords.push({ x, y });
        }
        else if (format === 3) {
            x = _x + blockSize;
            coords.push({ x, y });
            y += blockSize;
            coords.push({ x, y });
            x = _x;
            coords.push({ x, y });
            y += blockSize;
            x = _x + blockSize;
            coords.push({ x, y });
        }
        return coords;
    },
};
class BaseShape {
    blocks;
    blockSize;
    color;
    emptyColor;
    x;
    y;
    constructor(blocks = [], blockSize, color, emptyColor, x = 0, y = 0) {
        this.blocks = blocks;
        this.blockSize = blockSize;
        this.color = color;
        this.emptyColor = emptyColor;
        this.x = x;
        this.y = y;
    }
    get width() {
        return new Set(this.blocks.map((b) => b.x)).size;
    }
    get height() {
        return new Set(this.blocks.map((b) => b.y)).size;
    }
    draw(ctx) {
        for (const block of this.blocks) {
            block.draw(ctx);
        }
    }
    clear(ctx) {
        for (const block of this.blocks) {
            block.clear(ctx);
        }
    }
    static from(shape) {
        return new BaseShape(shape.blocks.map((b) => Block.from(b)), shape.blockSize, shape.color, shape.emptyColor, shape.x, shape.y);
    }
    createBlock(x, y) {
        return new Block(this.color, this.emptyColor, this.blockSize, this.blockSize, x, y);
    }
    updateBlocksFrom(coords) {
        for (let index = 0; index < coords.length; index++) {
            const coord = coords[index];
            const block = this.blocks[index];
            if (!block) {
                this.blocks[index] = this.createBlock(coord.x, coord.y);
            }
            else {
                block.y = coord.y;
                block.x = coord.x;
            }
        }
    }
}
class LineShape extends BaseShape {
    constructor(blocks, blockSize, emptyColor, y = 0) {
        super(blocks, blockSize, emptyColor, emptyColor, 0, y);
    }
    down() {
        this.y += this.blockSize;
        this.update();
    }
    copy() {
        const blocks = this.blocks.map((b) => b.copy());
        return new LineShape(blocks, this.blockSize, this.emptyColor, this.y);
    }
    update() {
        for (const block of this.blocks) {
            block.y = this.y;
        }
    }
}
class Shape extends BaseShape {
    type;
    format;
    blocks = [];
    constructor(type, blockSize, emptyColor, x = 0, y = 0, format = 0) {
        super([], blockSize, shapeColors[type], emptyColor, x, y);
        this.type = type;
        this.format = format;
        this.update();
    }
    static from(_shape) {
        const shape = new Shape(_shape.type, _shape.blockSize, _shape.emptyColor, _shape.x, _shape.y, _shape.format);
        shape.blocks = _shape.blocks.map((b) => Block.from(b));
        shape.update();
        return shape;
    }
    copy() {
        const shape = new Shape(this.type, this.blockSize, this.emptyColor, this.x, this.y, this.format);
        return shape;
    }
    nextFormat() {
        this.format++;
        this.update();
    }
    previousFormat() {
        this.format--;
        this.update();
    }
    left() {
        this.x -= this.blockSize;
        this.update();
    }
    right() {
        this.x += this.blockSize;
        this.update();
    }
    down() {
        this.y += this.blockSize;
        this.update();
    }
    reshape(ctx) {
        this.clear(ctx);
        this.update();
    }
    update() {
        if (this.format > shapeFormats[this.type]) {
            this.format = 0;
        }
        else if (this.format < 0) {
            this.format = shapeFormats[this.type];
        }
        let coords = shapeCoords[this.type](this.blockSize, this.x, this.y, this.format);
        this.updateBlocksFrom(coords);
    }
    draw(ctx) {
        this.clear(ctx);
        this.update();
        super.draw(ctx);
    }
}
class Tetris {
    canvas;
    row;
    column;
    blockSize;
    defaultColor;
    width = 0;
    height = 0;
    isPaused = true;
    waitForNextShape = 200;
    _delayForDown = 1000;
    delayForDown;
    rightBarWidth;
    tetrisShape;
    currentShape;
    nextShape;
    score = 0;
    rightBarColumn = 6;
    textColor = "white";
    textStyle = "";
    isGameOver = false;
    constructor(canvas, row = 20, column = 10, blockSize = 36, defaultColor = "black") {
        this.canvas = canvas;
        this.row = row;
        this.column = column;
        this.blockSize = blockSize;
        this.defaultColor = defaultColor;
        this.width = this.column * this.blockSize;
        this.height = this.row * this.blockSize;
        this.rightBarWidth = this.blockSize * this.rightBarColumn;
        this.tetrisShape = new BaseShape([], this.blockSize, this.defaultColor, this.defaultColor);
        this.textStyle = `${this.blockSize / 2}px Arial`;
        this.delayForDown = this._delayForDown;
    }
    shapeMove(_shape, key) {
        const shape = _shape.copy();
        shape[key]();
        for (const block of shape.blocks) {
            if (block.x < 0)
                return _shape;
            if (block.x >= this.width)
                return _shape;
            if (block.y >= this.height)
                return _shape;
            for (const b of this.tetrisShape.blocks) {
                const result = b.x === block.x && b.y === block.y;
                if (result)
                    return _shape;
            }
        }
        return shape;
    }
    randomShape() {
        const shapeTypes = Object.values(ShapeType);
        const index = this.random(0, shapeTypes.length - 1);
        const shape = new Shape(shapeTypes[index], this.blockSize, this.defaultColor, 0, 0, 0);
        return shape;
    }
    init() {
        this.canvas.width = this.width + this.rightBarWidth;
        this.canvas.height = this.height;
        const ctx = this.context();
        this.clear(ctx);
        this.clearRightBar(ctx);
        this.updateRightBar();
        this.updateScore(0);
        document.addEventListener("keydown", (event) => {
            if (!Object.keys(keys).includes(event.key) || !this.currentShape)
                return;
            const key = keys[event.key];
            if (key === Key.Pause) {
                if (event.repeat)
                    return;
                this.isPaused = !this.isPaused;
                if (!this.isPaused) {
                    if (this.isGameOver) {
                        this.clear(ctx);
                    }
                    this.anima();
                }
            }
            else if (!this.isPaused) {
                this.currentShape = this.shapeMove(this.currentShape, key);
                this.currentShape.draw(ctx);
            }
        });
        this.newShape();
        this.anima();
    }
    async isEndOfCurrentShape() {
        if (!this.currentShape)
            return false;
        await this.delay(this.waitForNextShape);
        const currentShape = this.shapeMove(this.currentShape, Key.Down);
        return this.currentShape === currentShape;
    }
    gameOver() {
        this.isPaused = true;
        this.isGameOver = true;
        const ctx = this.context();
        this.tetrisShape.clear(ctx);
        this.currentShape?.clear(ctx);
        this.nextShape?.clear(ctx);
        ctx.font = this.textStyle;
        ctx.fillStyle = this.textColor;
        const text = `Game Over. Score: ${this.score}`;
        const textWidth = ctx.measureText(text).width;
        const x = (this.width - textWidth) / 2;
        ctx.fillText(text, x, (this.row / 2) * this.blockSize);
        this.score = 0;
        this.delayForDown = this._delayForDown;
        this.updateScore(0);
    }
    async anima() {
        await this.delay(this.delayForDown);
        if (this.isPaused)
            return;
        requestAnimationFrame(async () => {
            if (this.currentShape) {
                const currentShape = this.shapeMove(this.currentShape, Key.Down);
                if (currentShape === this.currentShape) {
                    if (await this.isEndOfCurrentShape()) {
                        if (this.currentShape.y < 0) {
                            this.gameOver();
                        }
                        else {
                            this.tetrisShape.blocks.push(...this.currentShape.blocks);
                            this.removeLineShape();
                            this.newShape();
                        }
                    }
                }
                else {
                    this.currentShape = currentShape;
                    this.currentShape.draw(this.context());
                }
            }
            this.anima();
        });
    }
    newShape() {
        if (!this.nextShape) {
            this.nextShape = this.randomShape();
        }
        else {
            this.nextShape.reshape(this.context());
        }
        this.currentShape = this.nextShape;
        this.currentShape.clear(this.context());
        this.currentShape.x =
            this.fixedMiddle(this.column, this.currentShape) * this.blockSize;
        this.currentShape.y = 0 - this.currentShape.height * this.blockSize;
        this.nextShape = this.randomShape();
        this.nextShape.y = this.blockSize;
        this.nextShape.x =
            this.rightBarWidth / 2 -
                (this.nextShape.width * this.blockSize) / 2 +
                this.width;
        this.nextShape.draw(this.context());
    }
    fixedMiddle(column, shape, addition = 1) {
        return Math.floor(column / 2) + addition - Math.max(shape.width, 2);
    }
    removeLineShape() {
        const ctx = this.context();
        const lineBlocks = Object.groupBy(this.tetrisShape.blocks, (b) => String(b.y));
        let removed = 0;
        const removedLines = [];
        for (const [key, line] of Object.entries(lineBlocks)) {
            if (!line)
                continue;
            const lineShape = new LineShape(line, this.blockSize, this.defaultColor);
            if (line.length === this.column) {
                lineShape.clear(ctx);
                removed++;
                delete lineBlocks[key];
                removedLines.push(...line);
            }
        }
        this.tetrisShape.blocks = this.tetrisShape.blocks.filter((b) => !removedLines.includes(b));
        const lineShapes = [];
        for (const [key, line] of Object.entries(lineBlocks)) {
            if (!line)
                continue;
            const lineShape = new LineShape(line, this.blockSize, this.defaultColor, Number(key));
            lineShapes.push(lineShape);
        }
        let linesCanMove = true;
        while (linesCanMove && removedLines.length > 0) {
            linesCanMove = false;
            for (const _lineShape of lineShapes) {
                const lineShape = this.shapeMove(_lineShape, Key.Down);
                const canMove = lineShape !== _lineShape;
                if (canMove) {
                    linesCanMove = canMove;
                    for (let index = 0; index < _lineShape.blocks.length; index++) {
                        _lineShape.blocks[index].x = lineShape.blocks[index].x;
                        _lineShape.blocks[index].y = lineShape.blocks[index].y;
                        _lineShape.y = lineShape.y;
                    }
                }
            }
        }
        this.updateScore(removed);
        this.clear(ctx);
        this.tetrisShape.draw(ctx);
    }
    updateScore(x) {
        this.delayForDown = this.delayForDown - x * 10;
        if (x > 2)
            x = x * 2;
        this.score += x;
        const scoreText = `Score: ${this.score}`;
        const ctx = this.context();
        ctx.fillStyle = this.defaultColor;
        ctx.fillRect(this.width + 2, this.height - this.blockSize * 2, this.rightBarWidth, this.height);
        ctx.font = this.textStyle;
        ctx.fillStyle = this.textColor;
        ctx.fillText(scoreText, this.calculateMiddle(scoreText, ctx, this.rightBarWidth) + this.width, this.height - this.blockSize * 1);
    }
    updateRightBar() {
        const ctx = this.context();
        ctx.font = this.textStyle;
        ctx.fillStyle = this.textColor;
        const keysText = "Keys:";
        ctx.fillText(keysText, this.calculateMiddle(keysText, ctx, this.rightBarWidth) + this.width, this.height - this.blockSize * 10);
        const pauseText = `${this.getKeyFromValue(keys, Key.Pause)}: Pause/Start`;
        ctx.fillText(pauseText, this.calculateMiddle(pauseText, ctx, this.rightBarWidth) + this.width, this.height - this.blockSize * 9);
        const downText = `${this.getKeyFromValue(keys, Key.Down)}: Down`;
        ctx.fillText(downText, this.calculateMiddle(downText, ctx, this.rightBarWidth) + this.width, this.height - this.blockSize * 8);
        const rotateLeftText = `${this.getKeyFromValue(keys, Key.NextFormat)}: Rotate Right`;
        ctx.fillText(rotateLeftText, this.calculateMiddle(rotateLeftText, ctx, this.rightBarWidth) +
            this.width, this.height - this.blockSize * 7);
        const rotateRightText = `${this.getKeyFromValue(keys, Key.PreviousFormat)}: Rotate Left`;
        ctx.fillText(rotateRightText, this.calculateMiddle(rotateRightText, ctx, this.rightBarWidth) +
            this.width, this.height - this.blockSize * 6);
        const toRightText = `${this.getKeyFromValue(keys, Key.Right)}: To Right`;
        ctx.fillText(toRightText, this.calculateMiddle(toRightText, ctx, this.rightBarWidth) + this.width, this.height - this.blockSize * 5);
        const toLeftText = `${this.getKeyFromValue(keys, Key.Left)}: To Left`;
        ctx.fillText(toLeftText, this.calculateMiddle(toLeftText, ctx, this.rightBarWidth) + this.width, this.height - this.blockSize * 4);
    }
    calculateMiddle(text, ctx, width) {
        const textWidth = ctx.measureText(text).width;
        const x = (width - textWidth) / 2;
        return x;
    }
    clearRightBar(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.width, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = "white";
        ctx.fillRect(this.width + 1, 0, 1, this.canvas.height);
    }
    clear(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.width, this.canvas.height);
    }
    context() {
        const ctx = this.canvas.getContext("2d");
        if (!ctx)
            throw new Error("Ctx not found in canvas");
        return ctx;
    }
    delay(ms) {
        return new Promise((res) => {
            setTimeout(() => {
                res(undefined);
            }, ms);
        });
    }
    random(x, y) {
        return Math.floor(Math.random() * (y - x + 1)) + x;
    }
    getKeyFromValue(obj, value) {
        return Object.keys(obj).find((key) => obj[key] === value);
    }
    toObject() {
        const object = {
            row: this.row,
            column: this.column,
            blockSize: this.blockSize,
            defaultColor: this.defaultColor,
        };
        object.width = this.width;
        object.height = this.height;
        object.isPaused = this.isPaused;
        object.waitForNextShape = this.waitForNextShape;
        object._delayForDown = this._delayForDown;
        object.delayForDown = this.delayForDown;
        object.rightBarWidth = this.rightBarWidth;
        object.tetrisShape = this.tetrisShape;
        object.currentShape = this.currentShape;
        object.nextShape = this.nextShape;
        object.score = this.score;
        object.rightBarColumn = this.rightBarColumn;
        object.textColor = this.textColor;
        object.textStyle = this.textStyle;
        object.isGameOver = this.isGameOver;
        return object;
    }
    save() {
        const id = Date.now();
        localStorage.setItem(`tetris-${id}`, JSON.stringify(this.toObject()));
        return id;
    }
    load(id) {
        const t = localStorage.getItem(`tetris-${id}`);
        if (!t)
            throw new Error("Data not found");
        const _tetris = JSON.parse(t);
        this.clear(this.context());
        this.clearRightBar(this.context());
        this.updateRightBar();
        this.updateScore(0);
        this.row = _tetris.row;
        this.column = _tetris.column;
        this.blockSize = _tetris.blockSize;
        this.defaultColor = _tetris.defaultColor;
        this.width = _tetris.width;
        this.height = _tetris.height;
        this.isPaused = true;
        this.waitForNextShape = _tetris.waitForNextShape;
        this._delayForDown = _tetris._delayForDown;
        this.delayForDown = _tetris.delayForDown;
        this.rightBarWidth = _tetris.rightBarWidth;
        this.score = _tetris.score;
        this.rightBarColumn = _tetris.rightBarColumn;
        this.textColor = _tetris.textColor;
        this.textStyle = _tetris.textStyle;
        this.isGameOver = _tetris.isGameOver;
        this.tetrisShape = BaseShape.from(_tetris.tetrisShape);
        this.tetrisShape.draw(this.context());
        if (_tetris.currentShape) {
            this.currentShape = Shape.from(_tetris.currentShape);
            this.currentShape.draw(this.context());
        }
        if (_tetris.nextShape) {
            this.nextShape = Shape.from(_tetris.nextShape);
            this.nextShape.draw(this.context());
        }
    }
}
let _canvas = undefined;
function createCanvas() {
    if (!_canvas) {
        const app = document.getElementById("app");
        if (!app)
            throw new Error("App element not found");
        _canvas = document.createElement("canvas");
        app.appendChild(_canvas);
    }
    return _canvas;
}
function main() {
    const tetris = new Tetris(createCanvas());
    window.tetris = tetris;
    tetris.init();
}
main();
