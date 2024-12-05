export class RamRavanGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.running = false;

        // Load images
        this.ramaImage = new Image();
        this.ramaImage.src = "img/game-images/ram.png";

        this.ravanaImage = new Image();
        this.ravanaImage.src = "img/game-images/ravan.png";

        this.heartImage = new Image();
        this.heartImage.src = "img/game-images/heart.png"; // Update the path to your heart image

        this.backgroundImage = new Image();
        this.backgroundImage.src = "img/game-images/ram-background.webp"; // Update the path to your background image
        this.backgroundX = 0; // Initial position of the background


        // Game elements
        this.rama = { x: 10, y: 0, width: 0, height: 0, dy: 0 };
        this.ravanas = [];
        this.arrows = [];
        this.lives = 3;
        this.score = 0;

        this.maxRavanaCount = 1; // Start with one Ravana at a time


        this.rama.velocityY = 0; // Initial vertical velocity for Ram
        this.rama.accelerationY = 0.5; // Acceleration for smoother movement
        this.rama.maxSpeed = this.canvas.height * 0.02; // Max speed for Ram's movement

        this.baseRavanaSpeed = this.canvas.width * 0.005; // Initial speed
        this.ravanaSpeed = this.baseRavanaSpeed; // Current speed
        this.speedIncrement = this.canvas.width * 0.0001; // How much speed increases per second



        // Speeds
        this.ravanaSpeed = 0;
        this.arrowSpeed = 0;

        // Game Over UI
        this.gameOverContainer = document.getElementById("gameOver");
        this.finalScoreElement = document.getElementById("finalScore");
        this.restartButton = document.getElementById("restartButton");
        this.menuButton = document.getElementById("menuButton");

        this.restartButton.addEventListener("click", () => this.restart());
        this.menuButton.addEventListener("click", () => this.returnToMenu());
    }

    start() {
        this.running = true;
        this.initializeGame();
        this.addEventListeners();
        this.gameLoop();
    }

    stop() {
        this.running = false;
        clearInterval(this.ravanaInterval); // Stop spawning Ravanas
    }

    initializeGame() {
        this.rama.width = this.canvas.width * 0.1;
        this.rama.height = this.canvas.height * 0.15;
        this.rama.dy = this.canvas.height * 0.05;
        this.rama.y = this.canvas.height / 2 - this.rama.height / 2;

        this.ravanas = [];
        this.arrows = [];
        this.lives = 3;
        this.score = 0;

        this.ravanaSpeed = this.canvas.width * 0.01;
        this.arrowSpeed = this.canvas.width * 0.02;

        this.ravanaSpeed = this.baseRavanaSpeed; // Reset speed at the start

        // Hide Game Over screen
        this.gameOverContainer.classList.add("hidden");

        // Periodically spawn Ravanas
        this.ravanaInterval = setInterval(() => {
            if (this.running) this.createRavana();
        }, 1000);
        
        this.ravanaInterval = setInterval(() => {
            if (this.running) this.createRavana(); // Spawn Ravanas periodically
        }, 1000); // Adjust timing as needed

        this.difficulty = 1; // Start with difficulty level 1
        this.spawnInterval = 2000; // Start with a 2-second spawn interval

        // Start a difficulty timer
        this.difficultyTimer = setInterval(() => {
            if (this.running) this.increaseDifficulty();
        }, 10000); // Increase difficulty every 10 seconds

        
    }

    createRavana() {
        const size = this.canvas.height * 0.15;
        const y = Math.random() * (this.canvas.height - size);
    
        // Spawn up to maxRavanaCount Ravanas
        const ravanaCount = Math.min(this.maxRavanaCount, 3); // Limit to a hard cap if needed
        for (let i = 0; i < ravanaCount; i++) {
            this.ravanas.push({
                x: this.canvas.width - size - i * 50, // Stagger the initial position
                y: y + i * 20, // Slightly stagger the vertical position
                width: size,
                height: size,
            });
        }
    }
    

    shootArrow() {
        // Add an arrow to the array
        this.arrows.push({
            x: this.rama.x + this.rama.width, // Start at Rama's right edge
            y: this.rama.y + this.rama.height / 2 - 5, // Center vertically
            width: this.canvas.width * 0.02,
            height: this.canvas.height * 0.01,
        });
    }

    increaseDifficulty() {
        this.difficulty++;
    
        // Gradually increase Ravana speed
        this.ravanaSpeed += this.speedIncrement;
    
        // Gradually increase the number of Ravanas, up to a maximum of 5
        if (this.maxRavanaCount < 5) {
            this.maxRavanaCount++;
        }
    
        // Decrease spawn interval, but set a minimum limit
        if (this.spawnInterval > 500) {
            this.spawnInterval -= 200;
        }
    
        // Update Ravana spawn interval
        clearInterval(this.ravanaInterval);
        this.ravanaInterval = setInterval(() => {
            if (this.running) this.createRavana();
        }, this.spawnInterval);
    }
    
    

    moveArrows() {
        for (let i = this.arrows.length - 1; i >= 0; i--) {
            this.arrows[i].x += this.arrowSpeed;

            // Collision with Ravanas
            for (let j = this.ravanas.length - 1; j >= 0; j--) {
                if (
                    this.arrows[i].x < this.ravanas[j].x + this.ravanas[j].width &&
                    this.arrows[i].x + this.arrows[i].width > this.ravanas[j].x &&
                    this.arrows[i].y < this.ravanas[j].y + this.ravanas[j].height &&
                    this.arrows[i].y + this.arrows[i].height > this.ravanas[j].y
                ) {
                    this.score++;
                    this.ravanas.splice(j, 1);
                    this.arrows.splice(i, 1);
                    break;
                }
            }

            if (this.arrows[i] && this.arrows[i].x > this.canvas.width) {
                this.arrows.splice(i, 1);
            }
        }
    }

    drawArrows() {
        this.ctx.fillStyle = "yellow";
        for (const arrow of this.arrows) {
            this.ctx.fillRect(arrow.x, arrow.y, arrow.width, arrow.height);
        }
    }

    drawLives() {
        const heartSize = 40; // Size of each heart image
        for (let i = 0; i < this.lives; i++) {
            this.ctx.drawImage(this.heartImage, 20 + i * (heartSize + 10), 60, heartSize, heartSize); // Adjust y=60 to position below the score
        }
    }
    

    gameOver() {
        this.stop();
        clearInterval(this.difficultyTimer); // Stop increasing difficulty
        this.gameOverContainer.classList.remove("hidden");
        this.finalScoreElement.textContent = this.score;
    }

    gameLoop() {
        if (!this.running) return;
    
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        // Update game elements
        this.moveRavanas(); // Move Ravans
        this.updateRamaPosition();
        this.moveArrows();  // Move arrows
    
        // Render game elements
        this.render();
    
        // Continue the game loop
        requestAnimationFrame(() => this.gameLoop());
    }


    drawBackground() {
        // Draw the first instance of the background
        this.ctx.drawImage(this.backgroundImage, this.backgroundX, 0, this.canvas.width, this.canvas.height);
    
        // Draw the second instance for seamless scrolling
        this.ctx.drawImage(this.backgroundImage, this.backgroundX + this.canvas.width, 0, this.canvas.width, this.canvas.height);
    }
    
    

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackground();

        // Draw Rama
        this.ctx.drawImage(this.ramaImage, this.rama.x, this.rama.y, this.rama.width, this.rama.height);

        // Draw Ravanas and Arrows
        this.drawRavanas();
        this.drawArrows();
        this.drawLives();

        // Draw Score and Lives
        this.ctx.fillStyle = "white";
        this.ctx.font = `${this.canvas.height * 0.04}px Arial`;
        this.ctx.fillText(`Score: ${this.score}`, 20, 40);
        // Draw Lives (Hearts)
        this.drawLives();
    }

    drawRavanas() {
        for (const ravana of this.ravanas) {
            this.ctx.drawImage(this.ravanaImage, ravana.x, ravana.y, ravana.width, ravana.height);
        }
    }

    moveRavanas() {
        for (let i = this.ravanas.length - 1; i >= 0; i--) {
            // Move Ravanas horizontally based on the dynamic speed
            this.ravanas[i].x -= this.ravanaSpeed;
    
            // Optional: Add sinusoidal vertical movement for variety
            this.ravanas[i].y += Math.sin(Date.now() / 200 + i) * this.ravanaSpeed * 0.2;
    
            // Prevent Ravanas from moving out of bounds
            if (this.ravanas[i].y < 0) this.ravanas[i].y = 0;
            if (this.ravanas[i].y + this.ravanas[i].height > this.canvas.height) {
                this.ravanas[i].y = this.canvas.height - this.ravanas[i].height;
            }
    
            // Remove Ravanas if they collide with Ram
            if (
                this.ravanas[i].x < this.rama.x + this.rama.width &&
                this.ravanas[i].x + this.ravanas[i].width > this.rama.x &&
                this.ravanas[i].y < this.rama.y + this.rama.height &&
                this.ravanas[i].y + this.ravanas[i].height > this.rama.y
            ) {
                this.lives--;
                this.ravanas.splice(i, 1);
                if (this.lives === 0) {
                    this.gameOver();
                }
            }
    
            // Remove Ravanas if they go off-screen
            if (this.ravanas[i].x + this.ravanas[i].width < 0) {
                this.ravanas.splice(i, 1);
            }
        }
    }
     

    updateRamaPosition() {
        this.rama.y += this.rama.velocityY;
    
        // Prevent Ram from moving out of bounds
        if (this.rama.y < 0) this.rama.y = 0;
        if (this.rama.y + this.rama.height > this.canvas.height) {
            this.rama.y = this.canvas.height - this.rama.height;
        }
    }
    


    addEventListeners() {
        document.addEventListener("keydown", (event) => {
            if (!this.running) return;
    
            if (event.key === "ArrowUp") {
                this.rama.velocityY = -this.rama.maxSpeed; // Move up
            } else if (event.key === "ArrowDown") {
                this.rama.velocityY = this.rama.maxSpeed; // Move down
            } else if (event.key === " ") { // Spacebar pressed
                this.shootArrow(); // Shoot arrow
            }
        });
    
        document.addEventListener("keyup", (event) => {
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                this.rama.velocityY = 0; // Stop movement
            }
        });
    }
    

    restart() {
        this.start();
    }

    returnToMenu() {
        this.stop();
        document.querySelector(".game-container").classList.add("hidden");
        document.querySelector(".menu-container").classList.remove("hidden");
    }
}