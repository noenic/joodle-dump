class Model {
    constructor(widthCanvas, heightCanvas) {
        this.widthCanvas = widthCanvas;
        this.heightCanvas = heightCanvas;
        this.init();
    }

    init() {
        this.score = 0;
        this.platforms = [];
        this.doodle = new Doodle(this);
        this.generateInitialPlatforms();
    }

    generateInitialPlatforms() {
        for (let y = this.heightCanvas - 30; y > 0; y -= Math.random() * 40 + 30) {
            this.platforms.push(new Platform(this, Math.random() * (this.widthCanvas - 57), y, this.score));
        }
    }

    deletePlatform(platform) {
        if (platform.interval) clearInterval(platform.interval);
        this.platforms = this.platforms.filter(p => p !== platform);
    }
    
    BindDisplay(callback) {
        this.b_Display = callback;
    }

    Move(fps) {
        if (!this.doodle.isAlive) return console.log("Game over");

        let minGap = Math.min(10 + this.score / 100, 240);
        let maxGap = Math.min(100 + this.score / 50, 280);
        let gapFactor = Math.pow(Math.random(), 2 - Math.min(this.score / 500, 1));
        let gap = Math.floor(minGap + gapFactor * (maxGap - minGap));

        if (this.platforms[this.platforms.length - 1].y > gap) this.generateNewPlatform();

        this.doodle.Move(fps);
        this.b_Display({
            position: this.doodle.getPosition(),
            direction: this.doodle.getDirection(),
            platforms: this.platforms,
            score: this.score
        });
    }
    
    generateNewPlatform() {
        this.platforms.push(new Platform(this, Math.random() * (this.widthCanvas - 57), -1, this.score));
    }
    
    reset() {
        this.init();
    }
}

class Doodle {
    static JUMP_FORCE = 850;
    static GRAVITY = 20;
    static SPEED = 300;

    constructor(model) {
        this.model = model;
        this.reset();
    }

    getPosition() { return { x: this.x, y: this.y }; }
    getDirection() { return this.direction; }

    setDirection(newDirection) {
        this.direction = newDirection;
        if (newDirection) this.lastDirection = newDirection;
    }
    
    Move(fps) {
        this.gravitySpeed += Doodle.GRAVITY;
        this.y += this.gravitySpeed / fps;
        this.x = (this.x + this.direction * Doodle.SPEED / fps + this.model.widthCanvas) % this.model.widthCanvas;

        if (this.y < this.model.heightCanvas * 0.35) {
            this.y = this.model.heightCanvas * 0.35;
            let moveDistance = Math.abs(this.gravitySpeed) / fps;
            this.model.platforms.forEach(p => p.scrollDown(moveDistance));
            this.model.score += Math.floor(moveDistance / 5);
        }

        if (this.gravitySpeed > 0 && this.collision()) this.Jump();
        if (this.y > this.model.heightCanvas) this.model.reset();
    }

    Jump() {
        this.gravitySpeed = -Doodle.JUMP_FORCE;
    }

    collision() {
        return this.model.platforms.find(platform => {
            let inXRange = (this.x + 16 >= platform.x && this.x + 16 <= platform.x + platform.width) ||
                            (this.x + 57 >= platform.x && this.x + 57 <= platform.x + platform.width);
            let inYRange = (this.y + 80 >= platform.y && this.y + 80 <= platform.y + platform.height);
            if (inXRange && inYRange && platform.type === "falling") {
                platform.interval = setInterval(() => platform.scrollDown(5), 1000 / 60);
            }
            return inXRange && inYRange;
        });
    }
    
    reset() {
        Object.assign(this, { x: 240, y: 484, direction: 0, gravitySpeed: 0, isAlive: true });
    }
}

class Platform {
    constructor(game, x, y, score) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 57;
        this.height = 17;
        this.type = this.setRandomType(score);
        this.direction = 1;
        if (this.type === "moving") {
            this.interval = setInterval(() => this.move(), 1000 / 60);
        }
    }

    scrollDown(y) {
        this.y += y;
        if (this.y > this.game.heightCanvas) this.game.deletePlatform(this);
    }

    move() {
        this.x += this.direction * 5;
        if (this.x <= 0 || this.x >= this.game.widthCanvas - this.width) this.direction *= -1;
    }

    setRandomType(score) {
        let movingProbability = Math.min(Math.random() * 0.5, score / 50000);
        let unstableProbability = Math.min(Math.random() * 0.5, score / 50000);
        let normalProbability = 1 - movingProbability - unstableProbability;
        let random = Math.random();
        return random < normalProbability ? "normal" : random < normalProbability + movingProbability ? "moving" : "falling";
    }
}
