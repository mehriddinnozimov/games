"use strict";
class Block {
    color;
    width;
    height;
    x;
    y;
    constructor(color = "black", width = 32, height = 32, x = 0, y = 0) {
        this.color = color;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    copy() {
        return new Block(this.color, this.width, this.height, this.x, this.y);
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
    " ": Key.Down,
    Spacebar: Key.Down,
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
    [ShapeType.O]: "blue",
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
    constructor(blocks, blockSize, color, emptyColor, x = 0, y = 0) {
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
    draw(ctx) {
        for (const block of this.blocks) {
            block.draw(ctx);
        }
    }
    clear(ctx) {
        for (const block of this.blocks) {
            block.color = this.emptyColor;
            block.draw(ctx);
        }
        this.blocks = [];
    }
    createBlock(x, y) {
        return new Block(this.color, this.blockSize, this.blockSize, x, y);
    }
    createBlocksFrom(coords) {
        for (const coord of coords) {
            const b = this.createBlock(coord["x"], coord["y"]);
            this.blocks.push(b);
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
    update() {
        if (this.format > shapeFormats[this.type]) {
            this.format = 0;
        }
        else if (this.format < 0) {
            this.format = shapeFormats[this.type];
        }
        let coords = shapeCoords[this.type](this.blockSize, this.x, this.y, this.format);
        this.createBlocksFrom(coords);
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
    isPaused = false;
    waitForNextShape = 200;
    delayForDown = 1000;
    tetrisShape;
    currentShape;
    constructor(canvas, row = 22, column = 10, blockSize = 36, defaultColor = "black") {
        this.canvas = canvas;
        this.row = row;
        this.column = column;
        this.blockSize = blockSize;
        this.defaultColor = defaultColor;
        this.width = this.column * this.blockSize;
        this.height = this.row * this.blockSize;
        this.tetrisShape = new BaseShape([], this.blockSize, this.defaultColor, this.defaultColor);
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
        const index = random(0, shapeTypes.length - 1);
        this.currentShape = new Shape(shapeTypes[index], this.blockSize, this.defaultColor, 0, 0 - this.blockSize, 0);
        const fixedMiddle = Math.floor(this.column / 2) + 1 - Math.max(this.currentShape.width, 2);
        this.currentShape.x = fixedMiddle * this.blockSize;
    }
    init() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        const ctx = this.context();
        this.clear(ctx);
        document.addEventListener("keydown", (event) => {
            if (!Object.keys(keys).includes(event.key) || !this.currentShape)
                return;
            const key = keys[event.key];
            if (key === Key.Pause) {
                this.isPaused = !this.isPaused;
                if (!this.isPaused)
                    this.anima();
            }
            else {
                this.currentShape = this.shapeMove(this.currentShape, key);
                this.currentShape.draw(ctx);
            }
        });
        this.randomShape();
        this.anima();
    }
    async isEndOfCurrentShape() {
        if (!this.currentShape)
            return false;
        await delay(this.waitForNextShape);
        const currentShape = this.shapeMove(this.currentShape, Key.Down);
        return this.currentShape === currentShape;
    }
    async anima() {
        await delay(this.delayForDown);
        if (this.isPaused)
            return;
        if (this.currentShape) {
            const currentShape = this.shapeMove(this.currentShape, Key.Down);
            if (currentShape === this.currentShape) {
                console.log("cannot move");
                if (await this.isEndOfCurrentShape()) {
                    console.log("eofcs");
                    this.tetrisShape.blocks.push(...this.currentShape.blocks);
                    this.removeLineShape();
                    this.randomShape();
                }
            }
            else {
                this.currentShape = currentShape;
                this.currentShape.draw(this.context());
            }
        }
        this.anima();
    }
    removeLineShape() {
        const ctx = this.context();
        const lineBlocks = Object.groupBy(this.tetrisShape.blocks, (b) => String(b.y));
        console.log({ lineBlocks });
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
                console.log({ lineShape, tetrisShape: this.tetrisShape, canMove });
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
        this.clear(ctx);
        this.tetrisShape.draw(ctx);
        console.log({ lineBlocks });
    }
    clear(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    context() {
        const ctx = this.canvas.getContext("2d");
        if (!ctx)
            throw new Error("Ctx not found in canvas");
        return ctx;
    }
}
const canvas = document.createElement("canvas");
function main() {
    const app = document.getElementById("app");
    if (!app)
        return;
    app.appendChild(canvas);
    const tetris = new Tetris(canvas);
    tetris.init();
    console.log(tetris);
}
main();
function delay(ms) {
    return new Promise((res) => {
        setTimeout(() => {
            res(undefined);
        }, ms);
    });
}
function random(x, y) {
    return Math.floor(Math.random() * (y - x + 1)) + x;
}
