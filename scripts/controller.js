class Controller {
    constructor(model,view) {
        this.model = model;
        this.view = view;

        this.startTime     = Date.now();
        this.lag           = 0;
        this.fps           = 60; 
        this.frameDuration = 1000 / this.fps;

        this.view.bindGetPosition(this.bindGetPosition.bind(this));
        this.view.bindGetDirection(this.bindGetDirection.bind(this));
        this.view.bindGetPlatforms(this.bindGetPlatforms.bind(this));
        //this.view.bindSetMouvement(this.bindSetMouvement.bind(this));
        this.model.BindDisplay(this.Display.bind(this));
        this.view.BindSetDirection(this.SetDirection.bind(this));
        this.view.BindReset(this.reset.bind(this));

    }

    Display(position) {
        this.view.Display(position);
    }

    bindGetPosition() {
        return this.model.doodle.getPosition();
    }
    bindGetDirection() {
        return this.model.doodle.direction;
    }
    bindGetPlatforms() {
        return this.model.platforms;
    }
    SetDirection(newDirection) {
        this.model.doodle.setDirection(newDirection);
    }
    reset() {
        this.model.reset();
    }

    display(data) {
        this.view.Display(data);
    }
    

    Update() {
        /* Calcul du deltaTime */
        let currentTime = Date.now();
        let deltaTime   = currentTime - this.startTime; // La durée entre deux appels (entre 2 frames).
        // console.log("Update");
        
        this.lag += deltaTime;
        this.startTime = currentTime;

        /* Mettre à jour la logique si la variable _lag est supérieure ou égale à la durée d'une frame */
        while (this.lag >= this.frameDuration) {
            /* Mise à jour de la logique */


            this.model.Move(this.fps);
            /* Réduire la variable _lag par la durée d'une frame */
            this.lag -= this.frameDuration;
        }
        
        requestAnimationFrame(this.Update.bind(this)); // La fonction de rappel est généralement appelée 60 fois par seconde.
    }
}