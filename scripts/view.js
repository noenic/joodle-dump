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
        this.b_SetDirection = callback;
    }



    Events() {
        document.addEventListener('keydown', (evt) => {                
            if (evt.key == 'ArrowLeft' || evt.key == 'ArrowRight') {
                switch (evt.key) {
                    case 'ArrowLeft': // Move left.
                        this._hold_left = true;
                        this.b_SetDirection(-1);
                        break;
                    case 'ArrowRight': // Move right.
                        this._hold_right = true;
                        this.b_SetDirection(1);
                        break;
                }
            }
        });

        document.addEventListener('keyup', (evt) => {
            switch (evt.key) {
                case 'ArrowLeft': // Move left.
                    if (!this._hold_right) {
                        this.b_SetDirection(0);
                    }
                    this._hold_left = false;
                    break;
                case 'ArrowRight': // Move right.
                    if (!this._hold_left) {
                        this.b_SetDirection(0);
                    }
                    this._hold_right = false;
                    break;
            }
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

    }
    showPlatforms(platfosrms) {
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
            if (type == "disappearing") {
                srcY = 55;
            }
            this._ctx.drawImage(image, srcX, srcY, srcWidth, srcHeight, x, y, width, height);
            
        }
    }
    Display(data) {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this.showPlatforms(data.platforms);
        this.showDoodle(data.position, data.direction);
    }


    // make update a function that is called every frame by the browser
    // requestAnimationFrame(this.update.bind(this));
    
}
