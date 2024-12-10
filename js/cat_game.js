const BLOCK_SIZE = 16;
const SPRITE_SHEET_ROOT = 'images/sprite_sheets/';
const WIDTH_IN_BLOCKS = 24;
const HEIGHT_IN_BLOCKS = 14;
const WIDTH_IN_PIXELS = WIDTH_IN_BLOCKS * BLOCK_SIZE;
const HEIGHT_IN_PIXELS = HEIGHT_IN_BLOCKS * BLOCK_SIZE;

let singleQuoteString = 'This is prank';

class Game {

    static canvas;
    static ctx;

    constructor(canvas) {
        Game.canvas = canvas;
        Game.ctx = Game.canvas.getContext('2d');
        // Handle keyboard and mouse events
        window.addEventListener('keydown', this.handleEvent.bind(this));
        window.addEventListener('keyup', this.handleEvent.bind(this));
        Game.canvas.addEventListener('mousedown', this.handleEvent.bind(this));
        Game.canvas.addEventListener('mouseup', this.handleEvent.bind(this));
        Game.canvas.addEventListener('mousemove', this.handleEvent.bind(this));
    }

    start() {
        this.setup();
        console.log('Starting game...');
        window.requestAnimationFrame(this.updateLoop.bind(this));
    }

    handleEvent(event) {
        
    }

    updateLoop() {
        this.update();
        window.requestAnimationFrame(this.updateLoop.bind(this));
    }

    update() {

    }
}

class Sprite {

    constructor(image, offsetX, offsetY, widthInBlocks, heightInBlocks) {
        this.image = image;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.width = BLOCK_SIZE * widthInBlocks;
        this.height = BLOCK_SIZE * heightInBlocks;
    }

    draw(x, y) {
        Game.ctx.drawImage(this.image, this.offsetX, this.offsetY, this.width, this.height, x, y, this.width, this.height); 
    }
}

class SpriteSheet {
    image;
    sprites = {};

    constructor(imageName, widthInBlocks=1, heightInBlocks=1) {
        this.image = new Image();
        this.image.src = SPRITE_SHEET_ROOT + imageName;
        this.widthInBlocks = widthInBlocks;
        this.heightInBlocks = heightInBlocks;
    }

    describeSprite(x, y, direction) {
        this.sprites[direction] = new Sprite(
            this.image,
            x * BLOCK_SIZE,
            y * BLOCK_SIZE, 
            this.widthInBlocks, this.heightInBlocks);
    }

    getSprite(direction) {
        return this.sprites[direction];
    }
}

const Direction = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
    STOPPED: 4
};

class MovingObject {
    posX = 50;
    posY = 50;
    moving = true;
    direction = Direction.DOWN;
    spriteSheet;

    keepInBounds() {
        if (this.posY == 0)
        {
            this.posY += 1
            this.direction = Direction.DOWN
        }
        if (this.posX == 0)
        {
            this.posX += 1
            this.direction = Direction.RIGHT
        }
        if (this.posY == HEIGHT_IN_PIXELS - BLOCK_SIZE)
        {
            this.posY -= 1
            this.direction = Direction.UP
        }
        if (this.posX == WIDTH_IN_PIXELS - BLOCK_SIZE)
        {
            this.posX -= 1
            this.direction = Direction.LEFT
        }
    }

    draw() {
        let sprite = this.spriteSheet.getSprite(this.direction);
        if (this.direction === Direction.RIGHT) {
            if (this.moving) {
                this.posX += 1
            }
        } else if (this.direction === Direction.LEFT) {
            if (this.moving) {
                this.posX -= 1
            }
        } else if (this.direction === Direction.UP) {
            if (this.moving) {
                this.posY -= 1
            }
        } else if (this.direction === Direction.DOWN) {
            if (this.moving) {
                this.posY += 1
            }
        } else if (this.direction === Direction.STOPPED) {
            if (this.moving) {
                this.posX += 0
            }
        }
       
        this.keepInBounds();

        sprite.draw(this.posX, this.posY);
    }
}

const CatMode = {
    WANDERING: 0,
    FOLLOWING: 1,
};
class Cat extends MovingObject {

    lastRandomChangeTime = Date.now();
    mode = CatMode.WANDERING

    constructor(spriteSheet) {
        super();
        this.spriteSheet = new SpriteSheet('brown_cat.png');
        this.spriteSheet.describeSprite(1, 2, Direction.DOWN);
        this.spriteSheet.describeSprite(2, 1, Direction.RIGHT);
        this.spriteSheet.describeSprite(1, 1, Direction.LEFT);
        this.spriteSheet.describeSprite(2, 2, Direction.UP);
        this.spriteSheet.describeSprite(0, 1, Direction.STOPPED);
    }

    moveRandomly() {
        let time = Date.now();
        if (time - this.lastRandomChangeTime > 1000) {
            // One second has gone by since the last random change
            // Make a random change to the cat's state
            let max = 5
            let Number1 = Math.random() * max;
            let RandomDirection = Math.floor(Number1)
            this.direction = RandomDirection
            this.moving = true
            this.lastRandomChangeTime = time;
        }
    }

    draw() {
        if (this.mode == CatMode.WANDERING){
            this.moveRandomly();
        }
        super.draw();

    }

   
}

class Player extends MovingObject {
    constructor(spriteSheet) {
        super();
        this.spriteSheet = new SpriteSheet('berny.png', 1, 2);
        this.spriteSheet.describeSprite(0, 1, Direction.LEFT);
        this.spriteSheet.describeSprite(1, 1, Direction.RIGHT);
        this.spriteSheet.describeSprite(2, 1, Direction.DOWN);
        this.spriteSheet.describeSprite(3, 1, Direction.UP);
    }
}


class CatGame extends Game {
    cat;
    
    setup() {
        
        this.cat = new Cat();
        this.player = new Player();
        console.log('Setting up game...');
    }

    handleEvent(event) {
        console.log(event);
        // TOD: support more keys
        if (event.type === 'keydown') {
            if (event.key === 'w') {
                this.player.direction = Direction.UP;
                this.player.moving = true;
            }
       
            if (event.key === 's') {
                this.player.direction = Direction.DOWN;
                this.player.moving = true;
            }
        
            if (event.key === 'a') {
                this.player.direction = Direction.LEFT;
                this.player.moving = true;
            }

            if (event.key === 'd') {
                this.player.direction = Direction.RIGHT;
                this.player.moving = true;
            }
        }
        if (event.type === 'keyup') {
            this.player.moving = false;
        }
    }

    update() {
        Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
        this.cat.draw();
        this.player.draw();
    }
}
