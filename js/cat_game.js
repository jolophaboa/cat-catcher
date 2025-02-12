const BLOCK_SIZE = 16;
const SPRITE_SHEET_ROOT = 'images/sprite_sheets/';
const WIDTH_IN_BLOCKS = 24;
const HEIGHT_IN_BLOCKS = 14;
const WIDTH_IN_PIXELS = WIDTH_IN_BLOCKS * BLOCK_SIZE;
const HEIGHT_IN_PIXELS = HEIGHT_IN_BLOCKS * BLOCK_SIZE;

let singleQuoteString = 'Testing Testing';

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
        Game.ctx.drawImage(this.image, this.offsetX, this.offsetY, this.width, this.height, Math.round(x), Math.round(y), this.width, this.height); 
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

function isNearby(object1, object2) {
    let center1 = object1.centerPoint();
    let center2 = object2.centerPoint();
    let distanceY = Math.abs(center1.y - center2.y);
    let distanceX = Math.abs(center1.x - center2.x);
    let distanceSquared = distanceX * distanceX + distanceY * distanceY;
    let distance = Math.sqrt(distanceSquared);

    if (distance > BLOCK_SIZE * 2) {
        return false;
    } else {
        return true;
    }

    
}

class Point {
    x = 0;
    y = 0;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}



const Speed = {
    STOPPED: 0,
    SLOW: 1,
    NORMAL: 2,
    FAST: 3,
}
class MovingObject {
    posX = 50;
    posY = 50;
    moving = true;
    speed = Speed.NORMAL;
    direction = Direction.DOWN;
    spriteSheets = {};
    currentSpriteSheet;

    centerPoint() {
        return new Point(this.posX + BLOCK_SIZE / 2,
            this.posY + BLOCK_SIZE / 2);
    }

    distancePerFrame(){
        if (this.speed == Speed.NORMAL){
            return 1
        }
        if (this.speed == Speed.FAST){
            return 1.3
        }
        if (this.speed == Speed.SLOW){
            return 0.75
        }
    }
    keepInBounds() {
        if (this.posY <= 0)
        {
            this.posY += this.distancePerFrame()
            this.direction = Direction.DOWN
        }
        if (this.posX <= 0)
        {
            this.posX += this.distancePerFrame()
            this.direction = Direction.RIGHT
        }
        if (this.posY >= HEIGHT_IN_PIXELS - BLOCK_SIZE)
        {
            this.posY -= this.distancePerFrame()
            this.direction = Direction.UP
        }
        if (this.posX >= WIDTH_IN_PIXELS - BLOCK_SIZE)
        {
            this.posX -= this.distancePerFrame()
            this.direction = Direction.LEFT
        }
    }

    draw() {
        let sprite = this.currentSpriteSheet.getSprite(this.direction);

        let distance = this.distancePerFrame();

        if (this.direction === Direction.RIGHT) {
            if (this.moving) {
                this.posX += distance
            }
        } else if (this.direction === Direction.LEFT) {
            if (this.moving) {
                this.posX -= distance
            }
        } else if (this.direction === Direction.UP) {
            if (this.moving) {
                this.posY -= distance
            }
        } else if (this.direction === Direction.DOWN) {
            if (this.moving) {
                this.posY += distance
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
    LOAFING: 2,
    SITTING: 3,
};


const CatSpeed = {
    STOPPED: 0,
    SLOW: 1,
    NORMAL: 2,
    FAST: 3,
}



class Cat extends MovingObject {

    lastRandomChangeTime = Date.now();
    mode = CatMode.WANDERING;

    constructor(wandering_sprite, following_sprite) {
        super();
        let wanderingSpriteSheet = new SpriteSheet(wandering_sprite);
        wanderingSpriteSheet.describeSprite(1, 2, Direction.DOWN);
        wanderingSpriteSheet.describeSprite(2, 1, Direction.RIGHT);
        wanderingSpriteSheet.describeSprite(1, 1, Direction.LEFT);
        wanderingSpriteSheet.describeSprite(2, 2, Direction.UP);
        wanderingSpriteSheet.describeSprite(0, 1, Direction.STOPPED);
        this.spriteSheets[CatMode.WANDERING] = wanderingSpriteSheet;

        let followingSpriteSheet = new SpriteSheet(following_sprite);
        followingSpriteSheet.describeSprite(1, 2, Direction.DOWN);
        followingSpriteSheet.describeSprite(2, 1, Direction.RIGHT);
        followingSpriteSheet.describeSprite(1, 1, Direction.LEFT);
        followingSpriteSheet.describeSprite(2, 2, Direction.UP);
        followingSpriteSheet.describeSprite(0, 1, Direction.STOPPED);
        this.spriteSheets[CatMode.FOLLOWING] = followingSpriteSheet;

        this.currentSpriteSheet = followingSpriteSheet;
        
    }
    randomSpeed() {
        let max = 3;
        let RSN = Math.random() * max;
        if (RSN <= 1){
            this.speed = Speed.SLOW;
        }
        else if (RSN >= 2){
            this.speed = Speed.FAST;
        }
        else {
            this.speed = Speed.NORMAL;
        }
    }
    moveRandomly() {
        let max = 20000
        let number3 = Math.random() * max;
        let time = Date.now();
        if (time - this.lastRandomChangeTime > number3) {
            // One second has gone by since the last random change
            // Make a random change to the cat's state
            let max = 5
            let Number1 = Math.random() * max;
            let RandomDirection = Math.floor(Number1)
            this.direction = RandomDirection
            this.moving = true
            this.randomSpeed();
            this.lastRandomChangeTime = time;
        }
    }

    draw() {
        this.currentSpriteSheet = this.spriteSheets[this.mode];
        if (this.mode == CatMode.WANDERING) {
            this.moveRandomly();
        }
        super.draw();

    }
   
}
   



class Player extends MovingObject {
    constructor() {
        super();
        this.currentSpriteSheet = new SpriteSheet('berny.png', 1, 2);
        this.currentSpriteSheet.describeSprite(0, 1, Direction.LEFT);
        this.currentSpriteSheet.describeSprite(1, 1, Direction.RIGHT);
        this.currentSpriteSheet.describeSprite(2, 1, Direction.DOWN);
        this.currentSpriteSheet.describeSprite(3, 1, Direction.UP);
    }
}


const possibleCats = [
    ['brown_cat.png', 'hungry_cat.png'],
    ['calico_cat.png','hungry_cat.png'],
    ['black_cat.png','hungry_cat.png'],
    ['white_cat.png','hungry_cat.png'],
    ['unicorn_cat.png','hungry_cat.png'],
    ['tiger_cat.png','hungry_cat.png'],
    ['grey_cat.png','hungry_cat.png'],
    ['orange_cat.png','hungry_cat.png'],
    ['white_cat_2.png','hungry_cat.png'],
    ['pale_cat.png','hungry_cat.png'],
    ['striped_brown_cat.png', 'hungry_cat.png'],
    ['striped_dark_grey_cat.png', 'hungry_cat.png'],
];

function randomCat() {
    // pick a random index
    let max = possibleCats.length;
    let catNumber = Math.floor(Math.random() * max);
    let catInfo = possibleCats[catNumber];
    return new Cat(catInfo[0], catInfo[1])

}

class CatGame extends Game {
    cats = []

    setup() {
        
        
        let max = 18
        let numberofcats = 2 + Math.floor(Math.random() * max);
        for (let i = 0; i<numberofcats; i++) {
            this.cats.push(randomCat());
        }
        
        this.player = new Player();
        console.log('Setting up game...');
    }

    handleEvent(event) {
        //console.log(event);

        if (event.shiftKey){
            this.player.speed = Speed.FAST
        } else{
            this.player.speed = Speed.NORMAL
        }
        // TOD: support more keys
        if (event.type === 'keydown') {

            //console.log ("code is", event.code)
            //console.log ("key is", event.key)
            //console.log ("repeat is", event.repeat)

            if (event.repeat){
                //ignore events caused by letter keys being held down
                return
            }
            if (event.code === 'KeyW' || event.code === 'ArrowUp') {
                this.player.direction = Direction.UP;
                this.player.moving = true;
            }

            if (event.code === 'KeyS' || event.code === 'ArrowDown') {
                this.player.direction = Direction.DOWN;
                this.player.moving = true;
            }

            if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
                this.player.direction = Direction.LEFT;
                this.player.moving = true;
            }

            if (event.code === 'KeyD' || event.code === 'ArrowRight') {
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
        for (let cat of this.cats) {
            if (isNearby(cat, this.player)) {
                cat.mode = CatMode.FOLLOWING;
            } else {
                cat.mode = CatMode.WANDERING;
            }   
            cat.draw(); 
        }
    

        this.player.draw();
    }
}
