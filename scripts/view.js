class View {
    constructor(widthCanvas, heightCanvas) {
        this._canvas = document.getElementById('my_canvas');
        this._ctx = this._canvas.getContext('2d');
        this._canvas.width = widthCanvas;
        this._canvas.height = heightCanvas;

        this._hold_right = false;
        this._hold_left = false;

        this._doodleLeft = new Image();
        this._doodleLeft.src = '/doodlejump/tiles/lik-left@2x.png';

        this._doodleRight = new Image();
        this._doodleRight.src = '/doodlejump/tiles/lik-right@2x.png';
        
        this._HEXTILES_IMAGE = new Image();
        this._HEXTILES_IMAGE.src = '/doodlejump/tiles/game-tiles.png';

        this._doodleLastDirection = 1;
        
        this.Events();
    }

    bindGetPosition(callback) {
        this.getPosition = callback;
        console.log(this.getPosition());
    }
    
    bindGetDirection(callback) {
        this.getDirection = callback;
        console.log("Direction is", this.getDirection());
    }

    bindGetPlatforms(callback) {
        this.getPlatforms = callback;
        console.log(this.getPlatforms());
    }
    bindGetPlatforms(callback) {
        this.getPlatforms = callback
    }

    BindSetDirection(callback) {
        this.SetDirection = callback;
    }
    BindReset(callback) {
        this.reset = callback;
    }






    Events() {
        document.addEventListener('keydown', (evt) => {                
            if (evt.key == 'ArrowLeft' || evt.key == 'ArrowRight') {
                switch (evt.key) {
                    case 'ArrowLeft': // Move left.
                        this._hold_left = true;
                        this.SetDirection(-1);
                        break;
                    case 'ArrowRight': // Move right.
                        this._hold_right = true;
                        this.SetDirection(1);
                        break;
                }
            }
        });

        document.addEventListener('keyup', (evt) => {
            switch (evt.key) {
                case 'ArrowLeft': // Move left.
                    if (!this._hold_right) {
                        this.SetDirection(0);
                    }
                    this._hold_left = false;
                    break;
                case 'ArrowRight': // Move right.
                    if (!this._hold_left) {
                        this.SetDirection(0);
                    }
                    this._hold_right = false;
                    break;
            }
        });

        // when we click the "reset" button, we reset the game
        document.getElementById('reset').addEventListener('click', () => {
            this.reset();
        });
    }
    showDoodle(position, direction) {
        // get the correct image of the doodle
        //  on random la position entre 0 et 1
        let x = position.x;
        let y = position.y;
        // if direction is 0, we take the last direction
        if (direction == 0) {
            direction = this._doodleLastDirection;
        }
        this._doodleLastDirection = direction;
        let doodleImage = direction == -1 ? this._doodleLeft : this._doodleRight;


        // draw the doodle
        this._ctx.drawImage(doodleImage, x, y, 80, 80);

        // draw the hitbox of the doodle, depending on the direction we shorten the hitbox by 16px

        // draw the feets line of the doodle oin red 
        this._ctx.strokeStyle = "red";
        this._ctx.beginPath();
        if (direction == -1) {
            this._ctx.moveTo(x+16, y+80);
            this._ctx.lineTo(x+57, y+80);
        } else {
            this._ctx.moveTo(x+23, y+80);
            this._ctx.lineTo(x+64, y+80);
        }
        this._ctx.stroke();
        this._ctx.strokeStyle = "black";


        

    }
    showPlatforms(platforms) {
        for (let i = 0; i < platforms.length; i++) {
            let platform = platforms[i];
            // [1, 1, 57, 15]; // rectangle dans _HEXTILES_IMAGE qui represente la platform normal
            // [1, 19, 57, 15]; //mouvante
            // [1, 55, 57, 15]; // desparait

            let x = platform.x;
            let y = platform.y;
            let width = platform.width;
            let height = platform.height;
            let type = platform.type;
            let image = this._HEXTILES_IMAGE;
            let srcX = 1;
            let srcY = 1;
            let srcWidth = 57;
            let srcHeight = 15;
            if (type == "normal") {
                srcY = 1;
            }
            if (type == "moving") {
                srcY = 19;
            }
            if (type == "falling") {
                srcY = 55;
            }
            this._ctx.drawImage(image, srcX, srcY, srcWidth, srcHeight, x, y, width, height);


            // draw the hitbox of the platform
            this._ctx.beginPath();
            this._ctx.rect(x, y, width, height);
            this._ctx.stroke();

            
        }
    }
    Display(data) {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this.showPlatforms(data.platforms);
        this.showDoodle(data.position, data.direction);
        this.setScore(data.score);
    }

    setScore(score) {
        document.getElementById('score-value').innerText = score;
    }


    // make update a function that is called every frame by the browser
    // requestAnimationFrame(this.update.bind(this));
    
}
