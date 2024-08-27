class Block {
  constructor(
    public color: string = "black",
    public readonly width: number = 32,
    public readonly height: number = 32,
    public x: number = 0,
    public y: number = 0,
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  copy() {
    return new Block(this.color, this.width, this.height, this.x, this.y);
  }
}

enum Key {
  Left = "left",
  Right = "right",
  Down = "down",
  NextFormat = "nextFormat",
  PreviousFormat = "previousFormat",
  Pause = "pause",
}

const keys = {
  w: Key.PreviousFormat,
  s: Key.NextFormat,
  a: Key.Left,
  d: Key.Right,
  " ": Key.Down,
  Spacebar: Key.Down,
  p: Key.Pause,
};

interface Coord {
  x: number;
  y: number;
}

enum ShapeType {
  I = "I",
  O = "0",
  J = "J",
  L = "L",
  S = "S",
  Z = "Z",
  A = "A",
}

const shapeColors: Record<ShapeType, string> = {
  [ShapeType.I]: "red",
  [ShapeType.O]: "blue",
  [ShapeType.J]: "grey",
  [ShapeType.L]: "yellow",
  [ShapeType.S]: "orange",
  [ShapeType.Z]: "green",
  [ShapeType.A]: "purple",
};

const shapeFormats: Record<ShapeType, number> = {
  [ShapeType.I]: 1,
  [ShapeType.O]: 0,
  [ShapeType.J]: 3,
  [ShapeType.L]: 3,
  [ShapeType.S]: 1,
  [ShapeType.Z]: 1,
  [ShapeType.A]: 3,
};

const shapeCoords: Record<
  ShapeType,
  (blockSize: number, x?: number, y?: number, format?: number) => Coord[]
> = {
  [ShapeType.I]: (blockSize, _x = 0, _y = 0, format = 0) => {
    const coords: Coord[] = [];
    let x = _x;
    let y = _y;
    if (format === 0) {
      for (let i = 1; i < 5; i++) {
        coords.push({ x, y });
        y += blockSize;
      }
    } else if (format === 1) {
      y += blockSize * 3;
      for (let i = 1; i < 5; i++) {
        coords.push({ x, y });
        x += blockSize;
      }
    }

    return coords;
  },
  [ShapeType.O]: (blockSize, _x = 0, _y = 0, format = 0) => {
    const coords: Coord[] = [];
    let x = _x;
    let y = _y;

    for (let i = 1; i < 5; i++) {
      coords.push({ x, y });
      if (i % 2 == 0) {
        y += blockSize;
        x = _x;
      } else {
        x += blockSize;
      }
    }

    return coords;
  },
  [ShapeType.J]: (blockSize, _x = 0, _y = 0, format = 0) => {
    const coords: Coord[] = [];
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
    } else if (format === 1) {
      coords.push({ x, y });
      y += blockSize;
      coords.push({ x, y });
      x += blockSize;
      coords.push({ x, y });
      x += blockSize;
      coords.push({ x, y });
    } else if (format === 2) {
      x += blockSize;
      coords.push({ x, y });
      y += blockSize;
      coords.push({ x, y });
      y += blockSize;
      coords.push({ x, y });
      x = _x + blockSize * 2;
      y = _y;
      coords.push({ x, y });
    } else if (format === 3) {
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
    const coords: Coord[] = [];
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
    } else if (format === 1) {
      y += blockSize;
      coords.push({ x, y });
      x += blockSize;
      coords.push({ x, y });
      x += blockSize;
      coords.push({ x, y });
      x = _x;
      y = _y + blockSize * 2;
      coords.push({ x, y });
    } else if (format === 2) {
      x += blockSize;
      coords.push({ x, y });
      y += blockSize;
      coords.push({ x, y });
      y += blockSize;
      coords.push({ x, y });
      x = _x;
      y = _y;
      coords.push({ x, y });
    } else if (format === 3) {
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
    const coords: Coord[] = [];
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
    } else if (format === 1) {
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
    const coords: Coord[] = [];
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
    } else if (format === 1) {
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
    const coords: Coord[] = [];
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
    } else if (format === 1) {
      x = _x + blockSize;
      coords.push({ x, y });
      y += blockSize;
      coords.push({ x, y });
      x += blockSize;
      coords.push({ x, y });
      y += blockSize;
      x = _x + blockSize;
      coords.push({ x, y });
    } else if (format === 2) {
      y += blockSize;
      coords.push({ x, y });
      x += blockSize;
      coords.push({ x, y });
      x += blockSize;
      coords.push({ x, y });
      y = _y + blockSize * 2;
      x = _x + blockSize;
      coords.push({ x, y });
    } else if (format === 3) {
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
  constructor(
    public blocks: Block[],
    public blockSize: number,
    public color: string,
    public emptyColor: string,
    public x: number = 0,
    public y: number = 0,
  ) {}

  get width() {
    return new Set(this.blocks.map((b) => b.x)).size;
  }

  get height() {
    return new Set(this.blocks.map((b) => b.y)).size;
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const block of this.blocks) {
      block.draw(ctx);
    }
  }

  public clear(ctx: CanvasRenderingContext2D) {
    for (const block of this.blocks) {
      block.color = this.emptyColor;
      block.draw(ctx);
    }
    this.blocks = [];
  }

  protected createBlock(x: number, y: number) {
    return new Block(this.color, this.blockSize, this.blockSize, x, y);
  }

  protected createBlocksFrom(coords: { x: number; y: number }[]) {
    for (const coord of coords) {
      const b = this.createBlock(coord["x"], coord["y"]);
      this.blocks.push(b);
    }
  }
}

class LineShape extends BaseShape {
  constructor(
    blocks: Block[],
    blockSize: number,
    emptyColor: string,
    y: number = 0,
  ) {
    super(blocks, blockSize, emptyColor, emptyColor, 0, y);
  }
  public down() {
    this.y += this.blockSize;
    this.update();
  }

  public copy() {
    const blocks = this.blocks.map((b) => b.copy());
    return new LineShape(blocks, this.blockSize, this.emptyColor, this.y);
  }

  private update() {
    for (const block of this.blocks) {
      block.y = this.y;
    }
  }
}

class Shape extends BaseShape {
  public blocks: Block[] = [];
  constructor(
    public readonly type: ShapeType,
    blockSize: number,
    emptyColor: string,
    x: number = 0,
    y: number = 0,
    public format: number = 0,
  ) {
    super([], blockSize, shapeColors[type], emptyColor, x, y);

    this.update();
  }

  copy() {
    const shape = new Shape(
      this.type,
      this.blockSize,
      this.emptyColor,
      this.x,
      this.y,
      this.format,
    );
    return shape;
  }

  public nextFormat() {
    this.format++;
    this.update();
  }

  public previousFormat() {
    this.format--;
    this.update();
  }

  public left() {
    this.x -= this.blockSize;
    this.update();
  }

  public right() {
    this.x += this.blockSize;
    this.update();
  }

  public down() {
    this.y += this.blockSize;
    this.update();
  }

  reshape(ctx: CanvasRenderingContext2D) {
    this.clear(ctx);
    this.update();
  }

  private update() {
    if (this.format > shapeFormats[this.type]) {
      this.format = 0;
    } else if (this.format < 0) {
      this.format = shapeFormats[this.type];
    }
    let coords: Coord[] = shapeCoords[this.type](
      this.blockSize,
      this.x,
      this.y,
      this.format,
    );
    this.createBlocksFrom(coords);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.clear(ctx);
    this.update();
    super.draw(ctx);
  }
}

class Tetris {
  private width = 0;
  private height = 0;
  private isPaused = true;
  private waitForNextShape = 200;
  private delayForDown = 1000;
  private rightBarWidth: number;
  private tetrisShape: BaseShape;
  private currentShape: Shape | undefined;
  private nextShape: Shape | undefined;
  public score = 0;
  private rightBarColumn: number = 6;
  private textColor = "white";
  private textStyle = "";
  constructor(
    private readonly canvas: HTMLCanvasElement,
    public readonly row: number = 20,
    public readonly column: number = 10,
    public readonly blockSize: number = 36,
    public readonly defaultColor: string = "black",
  ) {
    this.width = this.column * this.blockSize;
    this.height = this.row * this.blockSize;
    this.rightBarWidth = this.blockSize * this.rightBarColumn;
    this.tetrisShape = new BaseShape(
      [],
      this.blockSize,
      this.defaultColor,
      this.defaultColor,
    );

    this.textStyle = `${this.blockSize / 2}px Arial`;
  }

  public shapeMove(
    _shape: LineShape,
    key: Extract<keyof LineShape, `${Key}`>,
  ): LineShape;
  public shapeMove(_shape: Shape, key: Extract<keyof Shape, `${Key}`>): Shape;
  public shapeMove(
    _shape: LineShape | Shape,
    key: Extract<keyof typeof _shape, `${Key}`>,
  ) {
    const shape = _shape.copy();
    shape[key]();

    for (const block of shape.blocks) {
      if (block.x < 0) return _shape;
      if (block.x >= this.width) return _shape;
      if (block.y >= this.height) return _shape;

      for (const b of this.tetrisShape.blocks) {
        const result = b.x === block.x && b.y === block.y;
        if (result) return _shape;
      }
    }
    return shape;
  }

  private randomShape() {
    const shapeTypes = Object.values(ShapeType);
    const index = random(0, shapeTypes.length - 1);
    const shape = new Shape(
      shapeTypes[index],
      this.blockSize,
      this.defaultColor,
      0,
      0,
      0,
    );
    return shape;
  }

  public init() {
    this.canvas.width = this.width + this.rightBarWidth;
    this.canvas.height = this.height;

    const ctx = this.context();
    this.clear(ctx);
    this.clearRightBar(ctx);
    this.updateScore(0);

    document.addEventListener("keydown", (event) => {
      if (!Object.keys(keys).includes(event.key) || !this.currentShape) return;
      const key = keys[event.key as keyof typeof keys];
      if (key === Key.Pause) {
        this.isPaused = !this.isPaused;
        if (!this.isPaused) this.anima();
      } else if (!this.isPaused) {
        this.currentShape = this.shapeMove(this.currentShape, key);
        this.currentShape.draw(ctx);
      }
    });

    this.newShape();
    this.anima();
  }

  private async isEndOfCurrentShape() {
    if (!this.currentShape) return false;

    await delay(this.waitForNextShape);
    const currentShape = this.shapeMove(this.currentShape, Key.Down);
    return this.currentShape === currentShape;
  }

  private async anima() {
    await delay(this.delayForDown);
    if (this.isPaused) return;
    if (this.currentShape) {
      const currentShape = this.shapeMove(this.currentShape, Key.Down);

      if (currentShape === this.currentShape) {
        if (await this.isEndOfCurrentShape()) {
          this.tetrisShape.blocks.push(...this.currentShape.blocks);
          this.removeLineShape();
          this.newShape();
        }
      } else {
        this.currentShape = currentShape;
        this.currentShape.draw(this.context());
      }
    }

    this.anima();
  }

  public newShape() {
    if (!this.nextShape) {
      this.nextShape = this.randomShape();
    } else {
      this.nextShape.reshape(this.context());
    }
    this.currentShape = this.nextShape;
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

  fixedMiddle(column: number, shape: Shape, addition: number = 1) {
    return Math.floor(column / 2) + addition - Math.max(shape.width, 2);
  }

  private removeLineShape() {
    const ctx = this.context();
    const lineBlocks = Object.groupBy(this.tetrisShape.blocks, (b) =>
      String(b.y),
    );

    let removed = 0;
    const removedLines: Block[] = [];
    for (const [key, line] of Object.entries(lineBlocks)) {
      if (!line) continue;

      const lineShape = new LineShape(line, this.blockSize, this.defaultColor);
      if (line.length === this.column) {
        lineShape.clear(ctx);
        removed++;
        delete lineBlocks[key];
        removedLines.push(...line);
      }
    }

    this.tetrisShape.blocks = this.tetrisShape.blocks.filter(
      (b) => !removedLines.includes(b),
    );

    const lineShapes: LineShape[] = [];
    for (const [key, line] of Object.entries(lineBlocks)) {
      if (!line) continue;
      const lineShape = new LineShape(
        line,
        this.blockSize,
        this.defaultColor,
        Number(key),
      );
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

  updateScore(x: number) {
    this.delayForDown = this.delayForDown - x * 10;
    if (x > 2) x = x * 2;
    this.score += x;

    const score = `Score: ${this.score}`;
    const ctx = this.context();

    ctx.fillStyle = this.defaultColor;

    ctx.fillRect(
      this.width + 2,
      this.height - this.blockSize * 3,
      this.rightBarWidth,
      this.height,
    );
    ctx.font = this.textStyle;
    ctx.fillStyle = this.textColor;
    ctx.fillText(
      score,
      this.width + this.rightBarWidth / 2 - this.blockSize,
      this.height - this.blockSize * 2,
    );
  }

  private clearRightBar(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "black";
    ctx.fillRect(this.width, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(this.width + 1, 0, 1, this.canvas.height);
  }

  private clear(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, this.width, this.canvas.height);
  }

  private context() {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Ctx not found in canvas");
    return ctx;
  }
}

const canvas = document.createElement("canvas");

function main() {
  const app = document.getElementById("app");
  if (!app) return;
  app.appendChild(canvas);

  const tetris = new Tetris(canvas);
  tetris.init();
}

main();

function delay(ms: number) {
  return new Promise((res) => {
    setTimeout(() => {
      res(undefined);
    }, ms);
  });
}

function random(x: number, y: number) {
  return Math.floor(Math.random() * (y - x + 1)) + x;
}
