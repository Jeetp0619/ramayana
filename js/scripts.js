// Add console log to confirm script is running
console.log("JavaScript is working!");

// Function to generate glowing stars using CSS
function generateGlowingStars(count) {
    const container = document.createElement('div');
    container.classList.add('glowing-stars');
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.top = Math.random() * window.innerHeight + 'px';
        star.style.left = Math.random() * window.innerWidth + 'px';
        container.appendChild(star);
    }
}

// Add 50 glowing stars to the background
generateGlowingStars(50);

// Starfield animation
const canvas = document.getElementById('starfield');
const context = canvas.getContext('2d');

// Set canvas size to window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Array to store star objects
let stars = [];

// Function to create stars
function generateStars(count) {
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * canvas.width,   // Random X position
            y: Math.random() * canvas.height,  // Random Y position
            radius: Math.random() * 3 + 1, // Random size (0.5px minimum size for visibility)
            velocity: Math.random() * 0.5      // Random speed for stars
        });
    }
}

// Function to draw stars
function drawStars() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    stars.forEach(star => {
        context.beginPath();
        const opacity = Math.random() * 0.5 + 0.5;  // Simulate "twinkling" effect
        context.globalAlpha = opacity;
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fillStyle = 'white';
        context.fill();

        // Move stars downwards
        star.y += star.velocity;

        // Reposition stars at the top if they go off-screen
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });

    // Recursive animation
    requestAnimationFrame(drawStars);
}

// Generate stars and start animation
generateStars(150); // You can adjust this number
drawStars();

// Recalculate canvas size if window is resized
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = []; // Clear stars array
    generateStars(150); // Re-generate stars with new size
});

particlesJS('particles-js', {
    "particles": {
        "number": {
            "value": 200,   // Increase the number of stars
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ffffff"  // White stars
        },
        "shape": {
            "type": "circle",   // Circular stars
            "stroke": {
                "width": 0,
                "color": "#000000"
            }
        },
        "opacity": {
            "value": 0.9,
            "random": true,  // Random opacity for a twinkling effect
            "anim": {
                "enable": true,
                "speed": 2,   // Speed of twinkling
                "opacity_min": 0.3,
                "sync": false
            }
        },
        "size": {
            "value": 2.5,    // Slightly larger star size
            "random": true,  // Random star sizes for variety
            "anim": {
                "enable": true,
                "speed": 2,  // Slightly animated size for twinkle effect
                "size_min": 1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": false  // No lines between particles (for a clean star look)
        },
        "move": {
            "enable": true,
            "speed": 0.2,   // Very slow speed for a calm starry night effect
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse"  // Stars repel slightly when hovered
            },
            "onclick": {
                "enable": true,
                "mode": "push"     // Clicking adds stars
            },
            "resize": true
        },
        "modes": {
            "repulse": {
                "distance": 100,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4  // Add a few stars when clicked
            }
        }
    },
    "retina_detect": true
});

