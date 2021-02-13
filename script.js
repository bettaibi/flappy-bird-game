class AudioController{

    constructor(){
        this.flyAudio = new Audio('./audio/fly.mp3');
        this.scoreAudio = new Audio('./audio/score.mp3');
    }

    fly(){
        this.flyAudio.play();
    }

    score(){
        this.scoreAudio.play();
    }
}

class GameController{
    constructor(score, birdImg, bg, fg, pipeUp, pipeDown){
        this.score = score;
        this.birdImg = birdImg;
        this.bg = bg;
        this.fg = fg;
        this.pipeUp = pipeUp;
        this.pipeDown = pipeDown;
        this.canvas = window.document.getElementById('game-area');
        this.context = this.canvas.getContext("2d");
        this.audioController = new AudioController();
        this.init();
    }

    init(){
        this.gravity = 1.5;
        this.gap = 85;
        this.bird = {x: 10, y: 150};
        this.pipes = [];
        this.pipes[0] = {x: this.canvas.clientWidth, y: 0};
    }

    // KEY DOWN
    move(e){
        switch(e.key){
            // case 'ArrowDown': this.bird.y += 20; break;
            case 'ArrowUp': this.bird.y -= 20; this.audioController.fly(); break;
            // case 'ArrowRight': this.bird.x += 20; break;
            // case 'ArrowLeft': this.bird.x -= 20; break;
            default: return;
        }
    }

    // DRAW THE GAME
    draw(){

        // LOAD BACKGROUND
        this.context.drawImage(this.bg, 0, 0);  
        // Free Fall
        this.bird.y += this.gravity; 
        
        for(var i=0; i< this.pipes.length; i++){
            let constant = this.pipeUp.height+this.gap;
            this.context.drawImage(this.pipeUp, this.pipes[i].x, this.pipes[i].y);
            this.context.drawImage(this.pipeDown, this.pipes[i].x, this.pipes[i].y + constant);
            
            this.pipes[i].x--;

            if(this.pipes[i].x == 125){
                this.pipes.unshift({
                    x: this.canvas.clientWidth,
                    y: Math.floor(Math.random() * this.pipeUp.height) - this.pipeUp.height
                });
            }
            
            // CHECK COLLISION
            if((this.pipes[i].x ==  (this.bird.x + this.birdImg.width)) && (((this.pipes[i].y + this.pipeUp.height) >=  (this.bird.y + this.birdImg.height))
            || ((this.pipes[i].y + constant) <=  (this.bird.y + this.birdImg.height)))){
                location.reload()
            }

            if(this.pipes[i].x == 5){
                this.score+=5;
                this.audioController.score();
            }

            if(this.pipes[i].x < -52){
                this.pipes.pop();
            }
        }

        // LOAD FORGROUND
        this.context.drawImage(this.fg, 0, this.canvas.clientHeight - this.fg.height);
        // LOAD THE BIRD
        this.context.drawImage(this.birdImg, this.bird.x, this.bird.y);
        // UPATE SCORE
        this.context.fillStyle = "#000";
        this.context.font = "20px Verdana";
        this.context.fillText("Score : "+ this.score, 10, this.canvas.height- 15);
    }
}


document.addEventListener('DOMContentLoaded', ()=>{
 
    console.log('The game is running...');
    const bird = new Image();
    bird.src = './img/bird.png';
    const bg = new Image();
    bg.src = './img/bg.png';
    const fg = new Image();
    fg.src = './img/fg.png';
    const pipeNorth = new Image();
    pipeNorth.src = './img/pipeNorth.png';
    const pipeSouth = new Image();
    pipeSouth.src = './img/pipeSouth.png';
   

    const game = new GameController(0, bird, bg, fg, pipeNorth, pipeSouth);
   
    function start(){
        game.draw();

        window.requestAnimationFrame(start);
    }

    document.addEventListener('keydown',  (e)=>{
        game.move(e)
    });

    start();
   
});