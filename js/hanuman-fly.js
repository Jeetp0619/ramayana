export class HanumanFlyGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.running = false;
        this.difficulty = 1;

        // Hanuman properties
        this.hanuman = {
            x: 100,
            y: 150,
            width: 150, // Increased Hanuman size
            height: 150,
            dy: 0,
            gravity: 0.35,
            thrust: -0.9,
            maxUpwardSpeed: -7,
            maxDownwardSpeed: 8,
            maxHeight: 50,
        };

        // Obstacles and collectibles
        this.obstacles = [];
        this.collectibles = [];
        this.score = 0;

        // Key state
        this.keys = {
            space: false, // Track whether the spacebar is pressed
        };

        // Load images
        this.hanumanImage = new Image();
        this.hanumanImage.src = "img/game-images/hanuman.png";

        this.fireballImage = new Image();
        this.fireballImage.src = "img/game-images/fireball.png";

        this.bananaImage = new Image();
        this.bananaImage.src = "img/game-images/banana.png";

        // Load background image
        this.backgroundImage = new Image();
        this.backgroundImage.src = "img/game-images/background.webp"; // Update path to your image

        // Background scrolling properties
        this.backgroundX = 0;
        this.backgroundSpeed = 2; // Adjust speed as needed

        // Game Over UI
        this.gameOverContainer = document.getElementById("gameOver");
        this.finalScoreElement = document.getElementById("finalScore");
        this.restartButton = document.getElementById("restartButton");
        this.menuButton = document.getElementById("menuButton");

        // Event listeners for restart and menu buttons
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
    }

    initializeGame() {
        // Reset Hanuman position
        this.hanuman.y = 150;
        this.hanuman.dy = 0;

        // Clear obstacles and collectibles
        this.obstacles = [];
        this.collectibles = [];
        this.score = 0;

        this.keys.space = false; // Reset key state

        this.gameOverContainer.classList.add("hidden");

        

        this.spawnInterval = setInterval(() => {
            if (this.running) {
                this.spawnObstacle(); // Call only once
                this.spawnCollectible(); // Keep collectibles spawning at the same rate
            }
        }, 2000); // Increase interval to 2 seconds for fewer spawns
        

        this.difficulty = 1; // Reset difficulty at the start
        this.difficultyInterval = setInterval(() => {
            if (this.running) {
            this.difficulty += 0.1; // Increase difficulty every 5 seconds
            }
        }, 5000);
    }

    spawnObstacle() {
        const obstacleCount = 1; // Always spawn only one obstacle
        for (let i = 0; i < obstacleCount; i++) {
            const size = Math.random() * 50 + 30; // Random size for fireball
            const radius = size / 2;
            const y = Math.random() * (this.canvas.height - radius * 2); // Ensure obstacle stays visible
            this.obstacles.push({
                x: this.canvas.width, // No horizontal staggering
                y: y + radius,
                radius: radius,
                speed: 6 + Math.random() * 2, // Slightly vary speeds for diversity
            });
        }
    }
    

    spawnCollectible() {
        const x = this.canvas.width + Math.random() * 200;
        const y = Math.random() * (this.canvas.height - 50); // Adjusted for larger bananas
        this.collectibles.push({ x, y, width: 75, height: 75 }); // Increased banana size
    }

    gameLoop() {
        if (!this.running) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.applyPhysics();
        this.moveObstacles();
        this.moveCollectibles();
        this.checkCollision();
        this.render();

        requestAnimationFrame(() => this.gameLoop());
    }

    applyPhysics() {
        if (this.keys.space) {
            // Apply upward thrust
            this.hanuman.dy += this.hanuman.thrust;
            if (this.hanuman.dy < this.hanuman.maxUpwardSpeed) {
                this.hanuman.dy = this.hanuman.maxUpwardSpeed;
            }
        } else {
            // Apply gravity
            this.hanuman.dy += this.hanuman.gravity;
            if (this.hanuman.dy > this.hanuman.maxDownwardSpeed) {
                this.hanuman.dy = this.hanuman.maxDownwardSpeed;
            }
        }

        // Update Hanuman's position
        this.hanuman.y += this.hanuman.dy;

        // Prevent Hanuman from going off the canvas
        if (this.hanuman.y < this.hanuman.maxHeight) {
            this.hanuman.y = this.hanuman.maxHeight;
            this.hanuman.dy = 0;
        } else if (this.hanuman.y > this.canvas.height - this.hanuman.height) {
            this.hanuman.y = this.canvas.height - this.hanuman.height;
            this.hanuman.dy = 0;
        }
    }

    render() {
        // Draw the scrolling background
        this.ctx.drawImage(this.backgroundImage, this.backgroundX, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImage, this.backgroundX + this.canvas.width, 0, this.canvas.width, this.canvas.height);

        // Update background position
        this.backgroundX -= this.backgroundSpeed;
        if (this.backgroundX <= -this.canvas.width) {
            this.backgroundX = 0; // Reset position
        }

        // Draw Hanuman
        this.ctx.drawImage(
            this.hanumanImage,
            this.hanuman.x,
            this.hanuman.y,
            this.hanuman.width,
            this.hanuman.height
        );

        // Draw Obstacles (Fireballs with circular hitbox)
        for (const obs of this.obstacles) {
            this.ctx.drawImage(
                this.fireballImage,
                obs.x - obs.radius, // Center the image horizontally
                obs.y - obs.radius, // Center the image vertically
                obs.radius * 2, // Diameter for width
                obs.radius * 2  // Diameter for height
            );
        }

        // Draw Collectibles (bananas)
        for (const col of this.collectibles) {
            this.ctx.drawImage(
                this.bananaImage,
                col.x,
                col.y,
                col.width,
                col.height
            );
        }

        // Draw Score
        this.ctx.fillStyle = "white";
        this.ctx.font = "24px Arial";
        this.ctx.fillText(`Score: ${this.score}`, 20, 40);
    }

    checkCollision() {
        // Check collision with obstacles (fireballs with circular hitbox)
        for (const obs of this.obstacles) {
            const dx = (this.hanuman.x + this.hanuman.width / 2) - obs.x; // Distance x-axis
            const dy = (this.hanuman.y + this.hanuman.height / 2) - obs.y; // Distance y-axis
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < obs.radius + this.hanuman.width / 2) {
                this.gameOver(); // Collision detected
                return;
            }
        }
    }

    gameOver() {
        this.stop();
        clearInterval(this.spawnInterval);
        clearInterval(this.difficultyInterval); // Stop difficulty scaling
        this.gameOverContainer.classList.remove("hidden");
        this.finalScoreElement.textContent = this.score;
    }

    restart() {
        this.start();
    }

    returnToMenu() {
        this.stop();
        document.querySelector(".game-container").classList.add("hidden");
        document.querySelector(".menu-container").classList.remove("hidden");
    }

    moveObstacles() {
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].x -= this.obstacles[i].speed;
            if (this.obstacles[i].x + this.obstacles[i].radius < 0) {
                this.obstacles.splice(i, 1);
            }
        }
    }

    moveCollectibles() {
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            this.collectibles[i].x -= 4;
            if (
                this.hanuman.x < this.collectibles[i].x + this.collectibles[i].width &&
                this.hanuman.x + this.hanuman.width > this.collectibles[i].x &&
                this.hanuman.y < this.collectibles[i].y + this.collectibles[i].height &&
                this.hanuman.y + this.hanuman.height > this.collectibles[i].y
            ) {
                this.score += 10;
                this.collectibles.splice(i, 1);
            }

            if (this.collectibles[i]?.x + this.collectibles[i].width < 0) {
                this.collectibles.splice(i, 1);
            }
        }
    }

    addEventListeners() {
        document.addEventListener("keydown", (e) => {
            if (e.key === " ") {
                this.keys.space = true; // Spacebar pressed
            }
        });

        document.addEventListener("keyup", (e) => {
            if (e.key === " ") {
                this.keys.space = false; // Spacebar released
            }
        });
    }
}
