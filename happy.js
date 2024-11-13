const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

const spiders = [];

// Create Spider class with follow and tick functions
class Spider {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.speed = 0.02 + Math.random() * 0.05; // Random speed for each spider
        this.inHeartFormation = false; // Flag to check if in heart formation
    }

    follow(mouseX, mouseY) {
        const dx = (mouseX - this.x);
        const dy = (mouseY - this.y);
        this.x += dx * this.speed;
        this.y += dy * this.speed;
    }

    tick(mouseX, mouseY, index, totalSpiders) {
        const distance = Math.hypot(this.x - mouseX, this.y - mouseY);
        
        // If within a certain distance, form a heart shape
        if (distance < 100) {
            const heartRadius = 30; // Smaller heart radius
            const angle = (index / totalSpiders) * Math.PI * 2; // Spread spiders along the heart

            // Heart shape equations for positioning
            this.x = mouseX + heartRadius * (16 * Math.sin(angle) ** 3);
            this.y = mouseY - heartRadius * (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
            this.inHeartFormation = true; // Set the flag to true to stop further adjustments
        } else {
            // If not forming heart, keep moving towards the mouse
            this.follow(mouseX, mouseY);
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2); // Fixed size for heart shape
        ctx.fillStyle = "rgba(255, 0, 0, 0.8)"; // Spider color with slight transparency
        ctx.fill();
    }
}

// Spawn 1000 spiders
for (let i = 0; i < 3000; i++) {
    spiders.push(new Spider());
}

// Update canvas dimensions on resize
window.addEventListener("resize", () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
});

// Track mouse movement
let mouseX = 0;
let mouseY = 0;

addEventListener("pointermove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Main animation loop
function animate() {
    ctx.clearRect(0, 0, w, h); // Clear the canvas for new frame

    spiders.forEach((spider, index) => {
        spider.tick(mouseX, mouseY, index, spiders.length); // Pass mouse position and index to tick
    });

    requestAnimationFrame(animate);
}

animate();
