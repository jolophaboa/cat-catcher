const BLOCK_SIZE = 16;
const SPRITE_SHEET_ROOT = 'images/sprite_sheets/';
const TILE_ROOT = 'images/tiles/';
const WIDTH_IN_BLOCKS = 24;
const HEIGHT_IN_BLOCKS = 14;
const WIDTH_IN_PIXELS = WIDTH_IN_BLOCKS * BLOCK_SIZE;
const HEIGHT_IN_PIXELS = HEIGHT_IN_BLOCKS * BLOCK_SIZE;

function randomChoice(options){
    let max = options.length;
    let randomIndex = Math.floor(Math.random() * max)
    return options[randomIndex]
}

function randomInt (max){
    return Math.floor(Math.random() * (max + 1));
}

function hasRandomTimePassed(startTime, minTime, maxTime){
    let randomTime = minTime + Math.random() * (maxTime - minTime);
    let time = Date.now();
    if (time - startTime > randomTime) {
        return true
    }
    else {
        return false
    }
}
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

    image;

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
};

function randomDirection() {
    return randomChoice([
        Direction.UP,
        Direction.DOWN,
        Direction.LEFT,
        Direction.RIGHT,
    ])
}

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

function randomSpeed() {
    return randomChoice([
        Speed.FAST,
        Speed.NORMAL,
        Speed.SLOW,
        Speed.FAST,
    ])
}

class MovingObject {
    posX = 50;
    posY = 50;
    moving = true;
    speed = Speed.NORMAL;
    direction = Direction.DOWN;
    spriteSheets = {};
    currentSpriteSheet;

    constructor(){
    
    };

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

    hasPermittedMapPosition(map) {
        // Only the bottom block of a sprite counts when calculating map barriers
        return map.isempty (
            this.posX, 
            this.posY + (this.currentSpriteSheet.heightInBlocks - 1) * BLOCK_SIZE,
            this.currentSpriteSheet.widthInBlocks*BLOCK_SIZE,
            BLOCK_SIZE);
    }

    draw(map) {
        let sprite = this.currentSpriteSheet.getSprite(this.direction);

        let distance = this.distancePerFrame();

        let previousX = this.posX;
        let previousY = this.posY;

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
        }
        
        if (!this.hasPermittedMapPosition(map)) {
            this.posX = previousX
            this.posY = previousY
        }
        //this.keepInBounds();

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

    nextChangeTime = Date.now();
    mode = CatMode.WANDERING;
    nearbyPlayer = null;

    constructor(spriteSheetName, map) {
        super();

        this.direction = randomDirection()
        this.speed = randomSpeed()
        let wanderingSpriteSheet = new SpriteSheet(spriteSheetName);
        wanderingSpriteSheet.describeSprite(3, 0, Direction.DOWN);
        wanderingSpriteSheet.describeSprite(2, 0, Direction.RIGHT);
        wanderingSpriteSheet.describeSprite(1, 0, Direction.LEFT);
        wanderingSpriteSheet.describeSprite(0, 0, Direction.UP);
        this.spriteSheets[CatMode.WANDERING] = wanderingSpriteSheet;

        let followingSpriteSheet = new SpriteSheet(spriteSheetName);
        followingSpriteSheet.describeSprite(3, 1, Direction.DOWN);
        followingSpriteSheet.describeSprite(2, 1, Direction.RIGHT);
        followingSpriteSheet.describeSprite(1, 1, Direction.LEFT);
        followingSpriteSheet.describeSprite(0, 1, Direction.UP);
        this.spriteSheets[CatMode.FOLLOWING] = followingSpriteSheet;

        let loafingSpriteSheet = new SpriteSheet(spriteSheetName);
        loafingSpriteSheet.describeSprite(0, 3, Direction.DOWN);
        loafingSpriteSheet.describeSprite(2, 3, Direction.RIGHT);
        loafingSpriteSheet.describeSprite(1, 3, Direction.LEFT);
        loafingSpriteSheet.describeSprite(3, 3, Direction.UP);
        this.spriteSheets[CatMode.LOAFING] = loafingSpriteSheet;

        let sittingSpriteSheet = new SpriteSheet(spriteSheetName);
        sittingSpriteSheet.describeSprite(0, 2, Direction.DOWN);
        sittingSpriteSheet.describeSprite(2, 2, Direction.RIGHT);
        sittingSpriteSheet.describeSprite(1, 2, Direction.LEFT);
        sittingSpriteSheet.describeSprite(3, 2, Direction.UP);
        this.spriteSheets[CatMode.SITTING] = sittingSpriteSheet;

        // Start with a random next change time
        this.nextChangeTime = Date.now() + randomInt(5000)

        this.currentSpriteSheet = followingSpriteSheet;

        // Keep picking random locations until we find one that works.
        do {
            this.posX = randomInt(WIDTH_IN_PIXELS - BLOCK_SIZE);
            this.posY = randomInt(HEIGHT_IN_PIXELS - BLOCK_SIZE);
        } while (!this.hasPermittedMapPosition(map))

        
    }
    randomSpeed() {
        this.speed = randomChoice([Speed.NORMAL,Speed.SLOW, Speed.FAST,])
    }

    cancelNextChange() {
        this.nextChangeTime = null
    }
   
    actBasedOnCurrentMode() {
        if (this.mode == CatMode.WANDERING) {
            if (this.nearbyPlayer) {
                this.cancelNextChange();
                this.mode = CatMode.FOLLOWING;
            }
        }
        
        if (this.mode == CatMode.FOLLOWING) {
            if (!this.nearbyPlayer) {
                this.mode = CatMode.WANDERING;
            }
        }

        if (this.mode == CatMode.FOLLOWING) {
            this.direction = this.nearbyPlayer.direction;
            this.speed = this.nearbyPlayer.speed;
            this.moving = this.nearbyPlayer.moving;
        }

        if (this.mode == CatMode.WANDERING) {
            this.moving = true;
        } else if (this.mode == CatMode.LOAFING || this.mode == CatMode.SITTING) {
            this.moving = false;
        }
    }

    decideWhatToDoNext() {
        if(this.nextChangeTime == null || this.nextChangeTime > Date.now()){
            return
        }
        
        if (this.mode == CatMode.WANDERING){
            this.direction = randomChoice([
                Direction.DOWN,
                Direction.LEFT,
                Direction.RIGHT,
                Direction.UP,

            ])
            this.mode = randomChoice([ 
                CatMode.SITTING,
                CatMode.WANDERING,
            ]);
            this.randomSpeed();

            // Make next change after 1-4 seconds
            this.nextChangeTime = Date.now() + 1000 + randomInt(3000)

        } else if (this.mode == CatMode.FOLLOWING) {
            this.mode = randomChoice([
                CatMode.LOAFING,
                CatMode.WANDERING,
            ])
            this.nextChangeTime = Date.now() + 2000 + randomInt(10000)


        } else if (this.mode == CatMode.SITTING) {
            this.mode = randomChoice([
                CatMode.LOAFING,
                CatMode.WANDERING,
                CatMode.SITTING,
            ])
            this.nextChangeTime = Date.now() + 2000 + randomInt(10000)

        } else if (this.mode == CatMode.LOAFING) {
            this.mode = randomChoice([
                CatMode.SITTING,
                CatMode.WANDERING,
                CatMode.LOAFING,
            ])
            this.nextChangeTime = Date.now() + 2000 + randomInt(10000)


        }
    }

    draw(map) {

        this.currentSpriteSheet = this.spriteSheets[this.mode];
        this.actBasedOnCurrentMode();
        this.decideWhatToDoNext();
        
        super.draw(map);

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
    'grey_cat.png',
    'orange_cat.png',
    'black_cat.png',
    'white_cat.png',
    'calico_cat.png',
    
];

function randomCat(map) {
    // pick a random index
    let max = possibleCats.length;
    let catNumber = Math.floor(Math.random() * max);
    let catInfo = possibleCats[catNumber];
    return new Cat(catInfo, map)
}


const GameKeys = {
    ArrowUp: 1,
    ArrowDown: 2,
    ArrowLeft: 4,
    ArrowRight: 8,
    KeyW: 16,
    KeyS: 32,
    KeyA: 64,
    KeyD: 128,
    ShiftLeft: 256,
    ShiftRight: 512,   
}
//The combined total of all DirectionalKeys
const DirectionalKeys = 255


const GamepadButttons = {
    Right: 15,
    Left: 14,
    Up: 12,
    Down: 13,
    Y: 3,
}

class Map {
    tileTypes = {
        '1': 'big_rocks.png',
        '2': 'small_rocks.png',
        '3': 'cafe_sign.png',
    };
    
    mapData = "";
    map = [];

    tiles = {};

    constructor(mapData) {
        this.mapData = mapData;

        // Create tiles based on the images listed in tileTypes
        for (let tileType in this.tileTypes) {
            let image = new Image();
            let imageName = this.tileTypes[tileType];
            image.src = TILE_ROOT + imageName;

            // FIXME: current tiles are 32x32 pixels, so to make them show up properly
            // we using a 2-blaock x 2-block sprite.           
            // Once the tiles have been updated this can be changed.
            this.tiles[tileType] = new Sprite(image, 0, 0, 1, 1);
        }

        this.loadMap();
    }

    loadMap() {
        // Read this.mapData and use it to create this.map
        let rows = this.mapData.split('\n');
        // Filter out blank lines
        rows = rows.filter((line) => line.length > 0)
        for (let y = 0; y < rows.length; y++) {
            let row = rows[y].trim();
            let chars = row.split('');
            this.map[y] = [];
            for (let x = 0; x < chars.length; x++) {
                let tileType = chars[x];
                this.map[y][x] = tileType;
            }
        }
    }

    isempty(x, y, width, height) {
        let startBlockx = Math.floor(x/BLOCK_SIZE);
        let startBlocky = Math.floor(y/BLOCK_SIZE);
        let endBlockx = Math.ceil((x+width-1)/BLOCK_SIZE);
        let endBlocky = Math.ceil((y+height-1)/BLOCK_SIZE);
        for (let bx = startBlockx; bx < endBlockx; bx++) {
            for (let by = startBlocky; by < endBlocky; by++) {
                let mapTileType = this.map[by]?.[bx];
                let isBarrier =  (mapTileType == "1");
                if (isBarrier) {
                    return false
                }
            }
        }
        return true
    }

    draw() {
        // Based on this.map, draw tiles at the correct locations
        for (let y = 0; y < this.map.length; y++) {
            let row = this.map[y];
            for (let x = 0; x < row.length; x++) {
                let tileType = row[x]
                let tile = this.tiles[tileType];
                if (tile) {
                    tile.draw(x * BLOCK_SIZE, y * BLOCK_SIZE);
                }
            }
        }
    }
}


class CatGame extends Game {
    cats = []
    keysPressed = 0;
    map;

    setup() {

        this.map = new Map(level2);
        
        let max = 18
        let numberofcats = 2 + Math.floor(Math.random() * max);
        for (let i = 0; i<numberofcats; i++) {
            this.cats.push(randomCat(this.map));
        }
        
        this.player = new Player();
        console.log('Setting up game...');
    }

    keyIsPressed(key) {
        // Usage: keyIsPressed('ArrowUp')
        let keyBit = GameKeys[key];
        return (this.keysPressed & keyBit) == keyBit;
    }

    handleEvent(event) {

        // console.log(event);

        if (event.type === 'keydown') {
            if (DirectionalKeys & GameKeys[event.code]) {
                this.keysPressed = this.keysPressed & ~DirectionalKeys
            }
            if (event.code in GameKeys) {
                this.keysPressed = this.keysPressed | GameKeys[event.code];
            }
        }
        if (event.type === 'keyup') {
            // See whether we care about this key
            if (event.code in GameKeys) {
                this.keysPressed = this.keysPressed & ~GameKeys[event.code];
            }
        }
        //console.log("KEYS PRESSED: ", Number(this.keysPressed).toString(2));

    }

    update() { 
        let gamepad = navigator.getGamepads()[0];
        let pressedButtons = {};
        if (gamepad) {
            for (let i = 0; i < gamepad.buttons.length; i++) {
                let button = gamepad.buttons[i];
                if (button.pressed) {
                    console.log(`Button ${i} is pressed`);
                    pressedButtons[i] = true
                }
            }
        }

        if (this.keyIsPressed('ShiftLeft') || this.keyIsPressed('ShiftRight') || pressedButtons[GamepadButttons.Y]) {
            this.player.speed = Speed.FAST
        } else{
            this.player.speed = Speed.NORMAL
        }

        this.player.moving = false;

        if (this.keyIsPressed('KeyW') || this.keyIsPressed('ArrowUp') || pressedButtons[GamepadButttons.Up]) {
            this.player.direction = Direction.UP;
            this.player.moving = true;
        }

        if (this.keyIsPressed('KeyS') || this.keyIsPressed('ArrowDown') || pressedButtons[GamepadButttons.Down]) {
            this.player.direction = Direction.DOWN;
            this.player.moving = true;
        }

        if (this.keyIsPressed('KeyA') || this.keyIsPressed('ArrowLeft') || pressedButtons[GamepadButttons.Left]) {
            this.player.direction = Direction.LEFT;
            this.player.moving = true;
        }

        if (this.keyIsPressed('KeyD') || this.keyIsPressed('ArrowRight') || pressedButtons[GamepadButttons.Right]) {
            this.player.direction = Direction.RIGHT;
            this.player.moving = true;
        }

        Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);

        this.map.draw();

        for (let cat of this.cats) {
            if (isNearby(cat, this.player)) {
                cat.nearbyPlayer = this.player;
            } else {
                cat.nearbyPlayer = null;
            }   
            cat.draw(this.map); 
        }
    

        this.player.draw(this.map);
    }
}
