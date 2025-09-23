// Get the canvas element and its 2D rendering context
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

// Set canvas size to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Track mouse position
const mouse = { x: 0, y: 0 };
document.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// Star configuration
const STAR_COUNT = 100;
const COLORS = ["#ffffffff", "#FFD700", "#de3affff", "#3f14fdff", "#00ffffff"];
const stars = [];

// Initialize stars with random properties
for (let i = 0; i < STAR_COUNT; i++) {
    const baseRadius = Math.random() * 6;
    stars.push({
        x: Math.random() * canvas.width, // Star's center x position
        y: Math.random() * canvas.height, // Star's center y position
        baseRadius: baseRadius, // Base radius for the star
        color: COLORS[Math.floor(Math.random() * COLORS.length)], // Random color
        radius: 0.01, // Initial radius (will grow)
        angle: Math.random() * Math.PI * 2, // Orbit angle
        speed: (Math.random() - 0.5) * 0.02, // Orbit speed
        orbit: Math.random() * 50 + 10, // Orbit radius
    });
}

let lastTime = performance.now(); // For animation timing

// Main animation loop
function drawStars(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    const deltaTime = (now - lastTime) / 1000; // Time since last frame in seconds
    lastTime = now;

    for (const star of stars) {
        // Calculate star's current position in its orbit
        const x = star.x + Math.cos(star.angle) * star.orbit;
        const y = star.y + Math.sin(star.angle) * star.orbit;
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const dist = Math.hypot(dx, dy); // Distance from mouse

        // Animate star radius based on mouse proximity
        if (star.radius >= star.baseRadius) {
            if (dist < 200) {
                // Grow if mouse is close
                star.radius = Math.min(star.radius * 1.3, star.baseRadius * 2);
            } else {
                // Shrink back to base radius if mouse is far
                star.radius = Math.max(star.baseRadius, star.radius * 0.97);
            }
        } else {
            // Gradually grow to base radius
            star.radius = Math.min(star.baseRadius, star.radius * 1.02 + 0.001);
        }

        // Update orbit angle for animation
        star.angle += star.speed * 60 * deltaTime;

        // Draw the star with glow effect
        ctx.beginPath();
        ctx.arc(x, y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 30;
        ctx.fill();
    }

    // Request next animation frame
    requestAnimationFrame(drawStars);
}

// Start the animation
requestAnimationFrame(drawStars);