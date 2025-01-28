class Model {
    constructor(widthCanvas, heightCanvas) {
        this.widthCanvas = widthCanvas;
        this.heightCanvas = heightCanvas;
        this.score = 1000;
        this.platforms = [];
        this.doodle = new Doodle(this);
        this.init();
    }

    init() {
        this.generateInitalPlatforms();
    }

    generateInitalPlatforms() {
        // Générer les plateformes initiales (au début du jeu) sur toute la surface du canvas
        // On genere  entre 5-7 platform normal 
        // tout au long du canvas, en commence a 50px du bas du canvas et on les espaces de 100 à 400 px
        let y = this.heightCanvas - 50;
        // On fait en sorte que les plateformes rentrent dans le canvas (en x et en y)
        for (let i = 0; i < Math.floor(Math.random() * (7 - 5) + 5); i++) {
            let x = Math.floor(Math.random() * (this.widthCanvas - 57));
            let platform = new Platform(this,x, y,this.score);
            this.platforms.push(platform);
            console.log(this.platforms);
            y -= Math.floor(Math.random() * (200 - 100) + 100);
        }
    }


    deletePlatform(platform) {
        // Supprimer une plateforme
        for (let i = 0; i < this.platforms.length; i++) {
            if (platform === this.platforms[i]) {
                console.log("delete platform");
                this.platforms.splice(i, 1);
            }
        }
    }
    
    BindDisplay(callback) {
        this.b_Display = callback;
    }

    Move(fps) {
        if (!this.doodle.isAlive) {
            console.log("Game over");
            return;
        }
        this.doodle.Move(fps);

        this.b_Display({
            position : this.doodle.getPosition(),
            direction : this.doodle.getDirection(),
            platforms : this.platforms
    });
    }
    
    generateNewPlatform() {
        // Générer une nouvelle plateforme
    } 
    
    reset(){
        this.score = 0;
        this.doodle.reset();
        this.platforms = [];
        this.generateInitalPlatforms();
        this.doodle.Jump();
    }
}




class Doodle {
    static JUMP_FORCE = 850;
    static GRAVITY = 20;
    static SPEED = 200;

    constructor(model) {
        this.model = model;
        this.x = 240; // Initial x position
        this.y = 484; // Initial y position
        this.x_velocity = 1;
        this.direction = 0;
        this.gravitySpeed = 0;
        this.isAlive = true;
        this.isFalling = false;
    }

    getPosition() {
        return {x: this.x, y: this.y};
    }

    getDirection() {
        return this.direction;
    }

    getPlatforms() {
        return this.model.platforms;
    }
    bindSetMouvement(direction){
        // if left move 1px to the left
        let mouvement = 5* this.x_velocity;
        if (direction === -1){
            this.x -= mouvement;
            this.x_velocity = Math.max(2, this.x_velocity * 1.01);
            // Change la direction du doodle 
            this.direction = 61;
            // Si on est à la limite du canvas 
            if (this.x < -30){
                this.x = this.model.widthCanvas - 30;
            }
        }
        if (direction === 1){
            this.x += mouvement
            this.x_velocity = Math.max(2, this.x_velocity * 1.01);
            this.direction = 1;
            // Si on est à la limite du canvas 
            if (this.x > this.model.widthCanvas-30){
                this.x = -30;
            }
        }
        if (direction === 0){
            console.log("Stop moving")
            this.x_velocity = 1;
        }
    }
    
    Move(fps) {
        // console.log("move");
        this.gravitySpeed += Doodle.GRAVITY;
        this.y += this.gravitySpeed / fps;
        this.x += this.direction * Doodle.SPEED / fps;

        //  when gravitySpeed is greater than 0, the doodle is falling

        // when the doodle is falling and collides with a platform, it should bounce back
        if (this.gravitySpeed > 0){

            // check if the doodle is colliding with a platform
            for (let i = 0; i < this.model.platforms.length; i++) {
                let platform = this.model.platforms[i];
                if (this.y < platform.y && this.y > platform.y - 17 && this.x > platform.x - 57 && this.x < platform.x + 57) {
                    console.log("collide");
                    this.gravitySpeed = -Doodle.JUMP_FORCE;
                }
            }

        }


        // Si On sort du canvas on revient de l'autre côté (30px pour laisser un peu du doodle sortir)
        if (this.x > this.model.widthCanvas-30) {
            this.x = -30;
        }

        if (this.x < -30) {
            this.x = this.model.widthCanvas - 30;
        }

        // check if the doodle is colliding with a platform

        

        // Si on est a moins de 100px du bas du canvas
        if (this.y > this.model.heightCanvas - 100) {
            this.Jump();
        }
        // this.Jump();

        if (this.y > this.model.heightCanvas) {
            this.model.reset();
        }
    }

    Jump() {
        console.log("jump");
        this.gravitySpeed = -Doodle.JUMP_FORCE;
    }

    reset() {
        this.x = 240;
        this.y = 484;
        this.x_velocity = 1;
        this.direction = 0;
        this.gravitySpeed = 0;
        this.isAlive = true;
        this.isFalling = false;
    }

}


class Platform {
    constructor(game,x,y,score) {
        this.game = game;
        this.width = 57
        this.height = 17
        this.x = x;
        this.y = y;
        this.type = this.setRandomType(score);
        // setInterval(this.scrollDown.bind(this,7),10);
        
    }

    scrollDown(y) {
        // fait descendre la plateforme
        // random entre 0 et 5
        y= Math.random() * 5;
        this.y += y;
        if (this.y > this.game.heightCanvas) {
            this.game.deletePlatform(this);
        }

    }

    setRandomType(score) {
        // Probabilités initiales pour les plateformes
        let normalProbability = 1.0; // 100% au début
        let movingProbability = 0.0;
        let unstableProbability = 0.0;
        
        // En fonction du score on va changer les probabilités 
        // le minium c'est entre 0.2 et 0.5
        // movingProbability = Math.min(0.5, score / 10000);
        movingProbability = Math.min(Math.random() * 0.5, score / 10000);
        unstableProbability = Math.min(Math.random() * 0.5, score / 10000);
        normalProbability = 1 - movingProbability - unstableProbability;
        // Générer un nombre aléatoire entre 0 et 1
        console.log(`normalProbability: ${normalProbability}, movingProbability: ${movingProbability}, unstableProbability: ${unstableProbability}`);
        let random = Math.random();
        // Si le nombre aléatoire est inférieur à la probabilité de la plateforme normale
        if (random < normalProbability) {
            return "normal";
        }

        // Si le nombre aléatoire est inférieur à la probabilité de la plateforme mouvante
        if (random < normalProbability + movingProbability) {
            return "moving";
        }

        // Si le nombre aléatoire est inférieur à la probabilité de la plateforme instable
        return "disappearing";


    }
};


