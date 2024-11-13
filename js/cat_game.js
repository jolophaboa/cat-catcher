const BLOCK_SIZE = 16;
const SPRITE_SHEET_ROOT = 'images/sprite_sheets/';

class Game {

    static canvas;
    static ctx;

    constructor(canvas) {
        Game.canvas = canvas;
        Game.ctx = Game.canvas.getContext('2d');
        // Handle keyboard and mouse events
        window.addEventListener('keydown', this.handleEvent.bind(this));
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

    constructor(spriteSheet) {
        this.spriteSheet = spriteSheet;
    }

    draw() {
        let sprite;

        sprite = this.spriteSheet.getSprite(1, 1);
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

    update() {
        Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
        this.cat.draw();
    }
}
