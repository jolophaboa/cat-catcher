const BLOCK_SIZE = 16;
const SPRITE_SHEET_ROOT = 'images/sprite_sheets/';
const WIDTH_IN_BLOCKS = 24;
const HEIGHT_IN_BLOCKS = 14;
const WIDTH_IN_PIXELS = WIDTH_IN_BLOCKS * BLOCK_SIZE;
const HEIGHT_IN_PIXELS = HEIGHT_IN_BLOCKS * BLOCK_SIZE;

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

    constructor(image, offsetX, offsetY) {
        this.image = image;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.width = BLOCK_SIZE;
        this.height = BLOCK_SIZE;
    }

    draw(x, y) {
        Game.ctx.drawImage(this.image, this.offsetX, this.offsetY, this.width, this.height, x, y, this.width, this.height); 
    }
}

class SpriteSheet {
    image;
    constructor(imageName) {
        this.image = new Image();
        this.image.src = SPRITE_SHEET_ROOT + imageName;
    }

    getSprite(x, y) {
        return new Sprite(this.image, x * BLOCK_SIZE, y * BLOCK_SIZE);
    }
}

const Direction = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};

class Cat {
    posX = 50;
    posY = 50;
    moving = true;
    direction = Direction.DOWN;
    lastRandomChangeTime = Date.now();

    constructor(spriteSheet) {
        this.spriteSheet = spriteSheet;
    }

    keepInBounds() {
        if (this.posY == 0)
        {
            this.posY += 1
        }
        if (this.posX == 0)
        {
            this.posX += 1
        }
        if (this.posY == HEIGHT_IN_PIXELS - BLOCK_SIZE)
        {
            this.posY -= 1
        }
        if (this.posX == WIDTH_IN_PIXELS - BLOCK_SIZE)
        {
            this.posX -= 1
        }
    }

    moveRandomly() {
        let time = Date.now();
        if (time - this.lastRandomChangeTime > 1000) {
            // One second has gone by since the last random change
            // Make a random change to the cat's state
            let max = 4
            let Number1 = Math.random() * max;
            let RandomDirection = Math.floor(Number1)
            this.direction = RandomDirection
            this.moving = true
            this.lastRandomChangeTime = time;
        }
    }

    draw() {
        this.moveRandomly();
        let sprite;
        if (this.direction === Direction.RIGHT) {
            sprite = this.spriteSheet.getSprite(2, 1);
            if (this.moving) {
                this.posX += 1
            }
        } else if (this.direction === Direction.LEFT) {
            sprite = this.spriteSheet.getSprite(1, 1);
            if (this.moving) {
                this.posX -= 1
            }
        } else if (this.direction === Direction.UP) {
            sprite = this.spriteSheet.getSprite(2, 2);
            if (this.moving) {
                this.posY -= 1
            }
        } else if (this.direction === Direction.DOWN) {
            sprite = this.spriteSheet.getSprite(1, 2);
            if (this.moving) {
                this.posY += 1
            }
        }
       
        this.keepInBounds();

        sprite.draw(this.posX, this.posY);
    }
}


class CatGame extends Game {
    cat;
    
    setup() {
        const catSpriteSheet = new SpriteSheet('brown_cat.png');
        this.cat = new Cat(catSpriteSheet);
        console.log('Setting up game...');
    }

    handleEvent(event) {
        console.log(event);
        // TOD: support more keys
        if (event.type === 'keydown') {
            if (event.key === 'w') {
                this.cat.direction = Direction.UP;
                this.cat.moving = true;
            }
       
            if (event.key === 's') {
                this.cat.direction = Direction.DOWN;
                this.cat.moving = true;
            }
        
            if (event.key === 'a') {
                this.cat.direction = Direction.LEFT;
                this.cat.moving = true;
            }

            if (event.key === 'd') {
                this.cat.direction = Direction.RIGHT;
                this.cat.moving = true;
            }
        }
        if (event.type === 'keyup') {
            this.cat.moving = false;
        }
    }

    update() {
        Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
        this.cat.draw();
    }
}
