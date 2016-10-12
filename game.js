const canvasElem = document.getElementById("game-board");
const canvas = canvasElem.getContext("2d");
const canvasWidth = 480;
const canvasHeight = 320;
const bulletWidth = 4;
const bulletHeight = 4;

class Player {
    constructor (x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.bullets = [];
        
        this._addEventListeners();
    }
    
    _addEventListeners() {
        document.onkeydown = (evt) => {
            const keyCode = evt.keyCode;
            
            if (keyCode === 32) {
                this.shoot();
            } else if (keyCode === 37) {
                this.update(-5, 0);
            } else if (keyCode === 38) {
                this.update(0, -5);
            } else if (keyCode === 39) {
                this.update(5, 0);
            } else if (keyCode === 40) {
                this.update(0, 5);
            }
        }
    }
    
    _midpoint () {
        return {
            x: this.x + this.width/2,
            y: this.y - bulletHeight
        };
    }
    
    clear () {
        canvas.clearRect(this.x, this.y, this.width, this.height);
    }
    
    update (x, y) {
        this.clear();
        this.x += x;
        this.y += y;
        this.draw();
    }
    
    shoot () {
        const bulletPosition = this._midpoint();
        const bullet = new Bullet(bulletPosition.x, bulletPosition.y);
        bullet.update();
        this.bullets.push(bullet);
    }
    
    draw () {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Game {
    constructor (width, height) {
        this.width = width;
        this.height = height;
        
        canvasElem.height = this.height;
        canvasElem.width = this.width;
    }
    
    _clear() {
        canvas.clearRect(0, 0, this.width, this.height);
    }
    
    draw () {
        this._clear();
        
        const player = new Player(50, 270, 32, 32, "pink");
        player.draw();
    }
}

class Bullet {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.active = true;
        this.width = bulletWidth;
        this.height = bulletHeight;
        this.velocity = -10;
        this.color = "black";
    }
    
    _inBounds() {
        return this.y >= 0 && this.y <= canvasHeight;
    }
    
    draw () {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, this.height);
    }
    
    clear () {
        canvas.clearRect(this.x, this.y, this.width, this.height);
    }
    
    update () {
        this.clear();
        this.y += this.velocity;
        this.active = this._inBounds();
        
        if (this.active) {
            this.draw();
            setTimeout(() => {
                this.update();
            }, 100);
        }
    }
}

const game = new Game(canvasWidth, canvasHeight);
game.draw();