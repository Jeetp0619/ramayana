import { RamRavanGame } from "./ram-ravan.js";
import { HanumanFlyGame } from "./hanuman-fly.js"; // Import the new game

// Select menu and game containers
const playRamRavanButton = document.getElementById("playRamRavan");

const playHanumanFlyButton = document.getElementById("playHanumanFly");
const menuContainer = document.querySelector(".menu-container");
const gameContainer = document.querySelector(".game-container");
const gameCanvas = document.getElementById("gameCanvas");

let currentGame = null;

// Function to start a game
function startGame(gameName) {
    menuContainer.classList.add("hidden");
    gameContainer.classList.remove("hidden");

    // Set canvas dimensions
    gameCanvas.width = window.innerWidth * 0.8;
    gameCanvas.height = window.innerHeight * 0.8;

    // Stop the current game if running
    if (currentGame) currentGame.stop();

    // Initialize and start the selected game
    if (gameName === "ram-ravan") {
        currentGame = new RamRavanGame(gameCanvas);
    } else if (gameName === "hanuman-fly") {
        currentGame = new HanumanFlyGame(gameCanvas);
    }

    currentGame.start();
}

// Event listeners for menu buttons
playRamRavanButton.addEventListener("click", () => startGame("ram-ravan"));
playHanumanFlyButton.addEventListener("click", () => startGame("hanuman-fly"));
