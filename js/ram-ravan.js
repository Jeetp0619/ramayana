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
        this.heartImage.src = "img/game-images/heart.png";

        this.backgroundImage = new Image();
        this.backgroundImage.src = "img/game-images/ram-background.webp";

        // Game elements
        this.rama = { x: 10, y: 0, width: 0, height: 0, dy: 0, velocityY: 0 };
        this.ravanas = [];
        this.arrows = [];
        this.lives = 3;
        this.score = 0;

        this.maxRavanaCount = 1;
        this.ravanaSpeed = this.canvas.width * 0.005;

        // UI Elements
        this.gameOverContainer = document.getElementById("gameOver");
        this.finalScoreElement = document.getElementById("finalScore");
        this.restartButton = document.getElementById("restartButton");
        this.menuButton = document.getElementById("menuButton");

        this.restartButton.addEventListener("click", () => this.restart());
        this.menuButton.addEventListener("click", () => this.returnToMenu());

        // Detect mobile
        this.isMobile = /Mobi|Android/i.test(navigator.userAgent);
    }

    start() {
        this.running = true;
        this.initializeGame();
        this.addEventListeners();
        this.gameLoop();
    }

    stop() {
        this.running = false;
        clearInterval(this.ravanaInterval);
    }

    initializeGame() {
        this.updateCanvasSize();

        this.rama.width = this.canvas.width * 0.1;
        this.rama.height = this.canvas.height * 0.15;
        this.rama.dy = this.canvas.height * 0.05;
        this.rama.y = this.canvas.height / 2 - this.rama.height / 2;

        this.ravanas = [];
        this.arrows = [];
        this.lives = 3;
        this.score = 0;

        this.ravanaInterval = setInterval(() => {
            if (this.running) this.createRavana();
        }, 1000);
    }

    createRavana() {
        const size = this.canvas.height * 0.15;
        const y = Math.random() * (this.canvas.height - size);
        this.ravanas.push({ x: this.canvas.width, y, width: size, height: size });
    }

    addEventListeners() {
        // Keyboard controls
        document.addEventListener("keydown", (event) => {
            if (!this.running) return;
            if (event.key === "ArrowUp") this.rama.velocityY = -this.rama.dy;
            if (event.key === "ArrowDown") this.rama.velocityY = this.rama.dy;
            if (event.key === " ") this.shootArrow();
        });

        document.addEventListener("keyup", (event) => {
            if (["ArrowUp", "ArrowDown"].includes(event.key)) this.rama.velocityY = 0;
        });

        // Touch controls for mobile
        this.canvas.addEventListener("touchstart", (event) => {
            const touchX = event.touches[0].clientX - this.canvas.offsetLeft;
            const touchY = event.touches[0].clientY - this.canvas.offsetTop;

            if (touchX < this.canvas.width * 0.5) {
                // Movement logic
                this.rama.velocityY = touchY < this.canvas.height / 2 ? -this.rama.dy : this.rama.dy;
            } else {
                // Shoot
                this.shootArrow();
            }
        });

        this.canvas.addEventListener("touchend", () => {
            this.rama.velocityY = 0;
        });

        // Responsive resizing
        window.addEventListener("resize", () => this.updateCanvasSize());
    }

    updateCanvasSize() {
        const prevWidth = this.canvas.width;
        const prevHeight = this.canvas.height;

        this.canvas.width = window.innerWidth * (this.isMobile ? 0.95 : 0.8);
        this.canvas.height = window.innerHeight * (this.isMobile ? 0.8 : 0.8);

        const scaleX = this.canvas.width / prevWidth;
        const scaleY = this.canvas.height / prevHeight;

        // Scale game elements
        this.rama.width *= scaleX;
        this.rama.height *= scaleY;
        this.rama.dy *= scaleY;

        this.ravanas.forEach((ravana) => {
            ravana.x *= scaleX;
            ravana.y *= scaleY;
            ravana.width *= scaleX;
            ravana.height *= scaleY;
        });

        this.arrows.forEach((arrow) => {
            arrow.x *= scaleX;
            arrow.y *= scaleY;
            arrow.width *= scaleX;
            arrow.height *= scaleY;
        });
    }

    updateRamaPosition() {
        this.rama.y += this.rama.velocityY;

        if (this.rama.y < 0) this.rama.y = 0;
        if (this.rama.y + this.rama.height > this.canvas.height) {
            this.rama.y = this.canvas.height - this.rama.height;
        }
    }

    moveRavanas() {
        for (let i = this.ravanas.length - 1; i >= 0; i--) {
            this.ravanas[i].x -= this.ravanaSpeed;

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

            if (this.ravanas[i].x + this.ravanas[i].width < 0) {
                this.ravanas.splice(i, 1);
            }
        }
    }

    shootArrow() {
        this.arrows.push({
            x: this.rama.x + this.rama.width,
            y: this.rama.y + this.rama.height / 2 - 5,
            width: this.canvas.width * 0.02,
            height: this.canvas.height * 0.01,
        });
    }

    moveArrows() {
        for (let i = this.arrows.length - 1; i >= 0; i--) {
            this.arrows[i].x += this.canvas.width * 0.02;

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

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);

        this.ctx.drawImage(this.ramaImage, this.rama.x, this.rama.y, this.rama.width, this.rama.height);

        for (const ravana of this.ravanas) {
            this.ctx.drawImage(this.ravanaImage, ravana.x, ravana.y, ravana.width, ravana.height);
        }

        for (const arrow of this.arrows) {
            this.ctx.fillStyle = "yellow";
            this.ctx.fillRect(arrow.x, arrow.y, arrow.width, arrow.height);
        }

        for (let i = 0; i < this.lives; i++) {
            this.ctx.drawImage(this.heartImage, 20 + i * 50, 20, 40, 40);
        }

        this.ctx.fillStyle = "white";
        this.ctx.font = "20px Arial";
        this.ctx.fillText(`Score: ${this.score}`, 20, 80);
    }

    gameLoop() {
        if (!this.running) return;

        this.updateRamaPosition();
        this.moveRavanas();
        this.moveArrows();
        this.render();

        requestAnimationFrame(() => this.gameLoop());
    }

    gameOver() {
        this.running = false; // Stop the game loop
        clearInterval(this.ravanaInterval); // Stop spawning Ravanas
    
        // Update the final score
        this.finalScoreElement.textContent = `Score: ${this.score}`;
    
        // Show the game-over container
        this.gameOverContainer.classList.remove("hidden");
    
        // Optionally hide the canvas if needed
        this.canvas.classList.add("hidden");
    }

    restart() {
        this.gameOverContainer.style.display = "none"; // Hide the game-over screen
        this.canvas.style.display = "block"; // Show the canvas
        this.start(); // Restart the game
    }

    returnToMenu() {
        this.stop();
        document.querySelector(".game-container").classList.add("hidden");
        document.querySelector(".menu-container").classList.remove("hidden");
    }
}
