const canvasElem = document.getElementById("game-board");
const canvas = canvasElem.getContext("2d");
const canvasWidth = 480;
const canvasHeight = 320;
const bulletWidth = 4;
const bulletHeight = 4;
const Direction = {
    Up : 0,
    Right : 1,
    Down : 2,
    Left: 3
}
const animals = [];

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function collides (a, b) {
    return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

class Entity {
    constructor (name, width, height, x, y,  direction) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.x = x || getRandomInt(width, 480 - width);
        this.y = y || getRandomInt(height, 320 - height);
        this.direction = direction;
        this.image = this._getImage();
    }
    
    _getImage () {
        const imagePath = `images/${this.name}.png`;
        const img = new Image();
        img.src = imagePath;
        
        return img;
    }
    
    _clear () {
        canvas.clearRect(this.x, this.y, this.width, this.height);
    }
    
    draw () {
        this.handleCollisions(animals);
        if (this.image.complete) {
            canvas.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        } else {
            this.image.onload = () => {
                canvas.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
            };
        }
    }
    
    update (x, y, direction) {
        this._clear();
        if (direction === this.direction) {
            this.x += x;
            this.y += y;    
        } else {
            this.direction = direction;
        }
        this.draw();
    }
}

class Player extends Entity {
    constructor(name, width, height, x, y, direction) {
        super(name, width, height, x, y, direction);
        
        this._addEventListeners();
    }
    
    _addEventListeners () {
        document.onkeydown = (evt) => {
            const keyCode = evt.keyCode;
            let direction;
            
            if (keyCode === 32) {
                this.shoot();
            } else if (keyCode === 37) {
                this.update(-5, 0, Direction.Left);
            } else if (keyCode === 38) {
                this.update(0, -5, Direction.Up);
            } else if (keyCode === 39) {
                this.update(5, 0, Direction.Right);
            } else if (keyCode === 40) {
                this.update(0, 5, Direction.Down);
            }
        }
    }
    
    _startpoint () {
        let x = this.x;
        let y = this.y;
        
        switch (this.direction) {
            case Direction.Up:
                x += this.width/2;
                y -= bulletHeight;
                break;
            case Direction.Right:
                x += this.width + bulletWidth;
                y += this.height/2;
                break;
            case Direction.Down:
                x += this.width/2;
                y += this.height + bulletHeight;
                break;
            case Direction.Left:
                x -= bulletWidth;
                y += this.height/2;
                break;    
        }
        
        return {
            x: x,
            y: y
        };
    }

    handleCollisions (entities) {
        entities.forEach((entity) => {
            if (collides(this, entity)) {
                console.log("collision!!")
            }
        })
    }
    
    shoot () {
        const bulletPosition = this._startpoint();
        const bullet = new Bullet(bulletPosition.x, bulletPosition.y, this.direction);
        bullet.update();
    }
}

class Game {
    constructor (width, height) {
        this.width = width;
        this.height = height;
        
        canvasElem.height = this.height;
        canvasElem.width = this.width;
    }
    
    _clear () {
        canvas.clearRect(0, 0, this.width, this.height);
    }
    
    draw () {
        this._clear();
        
        const player = new Player("bonnet", 56, 58, 50, 270);
        player.draw();
        
        const deer = new Animal("mushroom", 56, 58);
        deer.draw();
    }
}

class Bullet {
    constructor (x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.active = true;
        this.width = bulletWidth;
        this.height = bulletHeight;
        this.velocity = 10;
        this.color = "black";
    }
    
    _inBounds() {
        return this.x >= 0 && this.x <= canvasWidth && this.y >= 0 && this.y <= canvasHeight;
    }
    
    _draw () {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, this.height);
    }
    
    _clear () {
        canvas.clearRect(this.x, this.y, this.width, this.height);
    }
    
    _moveBullet (x, y) {
        this._clear();
        
        this.active = this._inBounds();
        
        if (this.active) {
            this.x += x; 
            this.y += y;
            this._draw();
            setTimeout(() => {
                this._moveBullet(x, y);
            }, 100);
        }
    }
    
    update () {
        let x = 0;
        let y = 0;
        
        switch (this.direction) {
            case Direction.Up:
                y = -(this.velocity);
                break;
            case Direction.Right:
                x = this.velocity;
                break;
            case Direction.Down:
                y = this.velocity;
                break;
            case Direction.Left:
                x = -(this.velocity);
                break;    
        }
        
        this._moveBullet(x, y);
    }
}

class Animal extends Entity {
    constructor(name, width, height) {
        super(name, width, height);

        animals.push(this);
    }

    handleCollisions (entities) {
        console.log("animal collision")
    }
}

const game = new Game(canvasWidth, canvasHeight);
game.draw();