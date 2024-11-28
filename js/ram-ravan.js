const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load the image of Ram
const ramImage = new Image();
ramImage.src = 'img/ram.png'; // Update this path to point to your Ram image

let ram = { x: 50, y: canvas.height / 2, width: 100, height: 100 };
let arrows = [];
let ravans = [];

// Start the game once the image has loaded
ramImage.onload = function() {
    startGame();
};

function startGame() {
    // Reset game state
    arrows = [];
    ravans = generateRavans();
    requestAnimationFrame(gameLoop);
}

function generateRavans() {
    let ravanArray = [];
    for (let i = 0; i < 5; i++) {
        ravanArray.push({
            x: Math.random() * (canvas.width - 100) + 100,
            y: Math.random() * (canvas.height - 50),
            width: 50,
            height: 50,
            hit: false
        });
    }
    return ravanArray;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Ram using the image
    ctx.drawImage(ramImage, ram.x, ram.y, ram.width, ram.height);

    // Draw Arrows
    ctx.fillStyle = "#ff4500";
    arrows.forEach((arrow, index) => {
        arrow.x += 5;
        ctx.fillRect(arrow.x, arrow.y, 10, 5);
        if (arrow.x > canvas.width) {
            arrows.splice(index, 1);
        }
    });

    // Draw Ravans
    ctx.fillStyle = "#8b0000";
    ravans.forEach((ravan) => {
        if (!ravan.hit) {
            ctx.fillRect(ravan.x, ravan.y, ravan.width, ravan.height);
        }
    });

    // Check for collisions
    arrows.forEach((arrow) => {
        ravans.forEach((ravan) => {
            if (!ravan.hit &&
                arrow.x < ravan.x + ravan.width &&
                arrow.x + 10 > ravan.x &&
                arrow.y < ravan.y + ravan.height &&
                arrow.y + 5 > ravan.y) {
                ravan.hit = true;
            }
        });
    });

    requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && ram.y > 0) {
        ram.y -= 10;
    } else if (e.key === "ArrowDown" && ram.y < canvas.height - ram.height) {
        ram.y += 10;
    } else if (e.key === " ") {
        // Shoot arrow
        arrows.push({ x: ram.x + ram.width, y: ram.y + ram.height / 2 });
    }
});
