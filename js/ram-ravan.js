export class RamRavanGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.running = false;

        console.log("Initializing game...");

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

        // Detect Mobile
        this.isMobile = /Mobi|Android/i.test(navigator.userAgent);
        console.log("Is Mobile:", this.isMobile);

        if (this.isMobile) {
            const joystickContainer = document.getElementById("joystickContainer");
            joystickContainer.style.display = "block"; // Show joystick on mobile
        }

        // Joystick for mobile
        if (this.isMobile) {
            this.joystick = document.getElementById("joystick");
            this.joystickContainer = document.getElementById("joystickContainer");
            this.joystickCenter = { x: 0, y: 0 };
            this.isDraggingJoystick = false;
            this.setupJoystick();
        }
    }

    start() {
        console.log("Starting game...");
        this.running = true;

        // Request fullscreen on mobile
        if (this.isMobile) {
            if (this.canvas.requestFullscreen) {
                this.canvas.requestFullscreen();
            } else if (this.canvas.webkitRequestFullscreen) {
                this.canvas.webkitRequestFullscreen();
            }
        }

        this.initializeGame();
        this.addEventListeners();
        console.log("Canvas dimensions:", this.canvas.width, this.canvas.height);
        this.gameLoop();
    }

    initializeGame() {
        console.log("Initializing game elements...");
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

    updateCanvasSize() {
        this.canvas.width = window.innerWidth * 0.95;
        this.canvas.height = window.innerHeight * 0.8;
        console.log("Canvas size updated:", this.canvas.width, this.canvas.height);
    }

    setupJoystick() {
        console.log("Setting up joystick...");
        const rect = this.joystickContainer.getBoundingClientRect();
        this.joystickCenter.x = rect.left + rect.width / 2;
        this.joystickCenter.y = rect.top + rect.height / 2;
    
        this.joystick.addEventListener("touchstart", () => {
            console.log("Joystick touched");
            this.isDraggingJoystick = true;
        });
    
        this.joystick.addEventListener("touchmove", (event) => {
            console.log("Joystick moved");
            if (!this.isDraggingJoystick) return;
    
            const touch = event.touches[0];
            const dx = touch.clientX - this.joystickCenter.x;
            const dy = touch.clientY - this.joystickCenter.y;
            const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 50);
            const angle = Math.atan2(dy, dx);
    
            this.joystick.style.transform = `translate(${distance * Math.cos(angle)}px, ${distance * Math.sin(angle)}px)`;
            this.rama.velocityY = Math.sin(angle) * this.rama.dy;
        });
    
        this.joystick.addEventListener("touchend", () => {
            console.log("Joystick released");
            this.isDraggingJoystick = false;
            this.joystick.style.transform = "translate(-50%, -50%)";
            this.rama.velocityY = 0;
        });
    }
    

    addEventListeners() {
        if (!this.isMobile) {
            document.addEventListener("keydown", (event) => {
                if (!this.running) return;
                if (event.key === "ArrowUp") this.rama.velocityY = -this.rama.dy;
                if (event.key === "ArrowDown") this.rama.velocityY = this.rama.dy;
                if (event.key === " ") this.shootArrow();
            });

            document.addEventListener("keyup", (event) => {
                if (["ArrowUp", "ArrowDown"].includes(event.key)) this.rama.velocityY = 0;
            });
        }
        if (!this.isMobile) {
            document.addEventListener("keydown", (event) => {
                if (!this.running) return;
                if (event.key === " ") this.shootArrow(); // Spacebar shoots
            });
        }
    }

    createRavana() {
        const size = this.canvas.height * 0.15;
        const y = Math.random() * (this.canvas.height - size);
        this.ravanas.push({ x: this.canvas.width, y, width: size, height: size });
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

            // Check for collision with Ram
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

    moveArrows() {
        for (let i = this.arrows.length - 1; i >= 0; i--) {
            this.arrows[i].x += this.canvas.width * 0.02; // Move arrow to the right
    
            // Check collision with Ravanas
            for (let j = this.ravanas.length - 1; j >= 0; j--) {
                if (
                    this.arrows[i].x < this.ravanas[j].x + this.ravanas[j].width &&
                    this.arrows[i].x + this.arrows[i].width > this.ravanas[j].x &&
                    this.arrows[i].y < this.ravanas[j].y + this.ravanas[j].height &&
                    this.arrows[i].y + this.arrows[i].height > this.ravanas[j].y
                ) {
                    // Remove the Ravana and the arrow
                    this.ravanas.splice(j, 1);
                    this.arrows.splice(i, 1);
                    this.score++;
                    break;
                }
            }
    
            // Remove arrow if it goes off screen
            if (this.arrows[i] && this.arrows[i].x > this.canvas.width) {
                this.arrows.splice(i, 1);
            }
        }
    }
    

    shootArrow() {
        console.log("Arrow shot");
        this.arrows.push({
            x: this.rama.x + this.rama.width, // Start at Ram's position
            y: this.rama.y + this.rama.height / 2 - 5, // Center vertically
            width: this.canvas.width * 0.02, // Arrow width
            height: this.canvas.height * 0.01, // Arrow height
        });
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.ramaImage, this.rama.x, this.rama.y, this.rama.width, this.rama.height);
    
        // Draw Ravanas
        for (const ravana of this.ravanas) {
            this.ctx.drawImage(this.ravanaImage, ravana.x, ravana.y, ravana.width, ravana.height);
        }
    
        // Draw Arrows
        for (const arrow of this.arrows) {
            this.ctx.fillStyle = "yellow";
            this.ctx.fillRect(arrow.x, arrow.y, arrow.width, arrow.height);
        }
    
        // Draw Hearts
        for (let i = 0; i < this.lives; i++) {
            this.ctx.drawImage(this.heartImage, 20 + i * 50, 20, 40, 40); // Adjust positioning if necessary
        }
    
        // Draw Score
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
        this.running = false;
        clearInterval(this.ravanaInterval);

        // Display game over container
        this.gameOverContainer.classList.remove("hidden");
        this.finalScoreElement.textContent = `Score: ${this.score}`;
    }

    restart() {
        this.gameOverContainer.classList.add("hidden");
        this.start();
    }

    returnToMenu() {
        this.running = false;
        this.canvas.classList.add("hidden");
    }
}
