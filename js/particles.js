/* ============================================
   Hero particle background
   Plain Canvas 2D, no libraries: drifting dots joined by faint lines,
   gently pushed away by the mouse.

   - Sized to the hero section itself (on phones the hero is taller than
     the window), and sharp on high-resolution screens.
   - Only animates while the hero is on screen, to save battery.
   - With { animate: false } it draws a single still frame
     (used for visitors who have asked their device for reduced motion).
   ============================================ */

class ParticleSystem {
    constructor(canvas, { animate = true } = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.animated = animate;
        this.running = false;
        this.frame = null;
        this.width = 0;
        this.height = 0;

        this.resize();
        this.addEventListeners();

        if (this.animated) {
            this.start();
        } else {
            this.draw();
        }
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        const width = Math.round(rect.width);
        const height = Math.round(rect.height);

        // Mobile browsers fire resize events while scrolling (the address bar
        // slides in and out). Only rebuild when the hero really changed size.
        if (width === this.width && height === this.height) return;

        this.width = width;
        this.height = height;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = Math.round(width * dpr);
        this.canvas.height = Math.round(height * dpr);
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        this.createParticles();
        if (!this.running) this.draw();
    }

    createParticles() {
        this.particles = [];
        // Same density as before, capped so very large screens stay smooth
        const numberOfParticles = Math.min(160, Math.floor((this.width * this.height) / 15000));

        for (let i = 0; i < numberOfParticles; i++) {
            const size = Math.random() * 2 + 0.5;
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const directionX = (Math.random() - 0.5) * 0.5;
            const directionY = (Math.random() - 0.5) * 0.5;
            const color = this.getRandomColor();

            this.particles.push({ x, y, size, directionX, directionY, color });
        }
    }

    getRandomColor() {
        const colors = [
            'rgba(99, 102, 241, 0.8)',   // Primary
            'rgba(236, 72, 153, 0.8)',   // Secondary
            'rgba(6, 182, 212, 0.8)',    // Accent
            'rgba(129, 140, 248, 0.6)',  // Primary light
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    addEventListeners() {
        if ('ResizeObserver' in window) {
            new ResizeObserver(() => this.resize()).observe(this.canvas);
        } else {
            window.addEventListener('resize', () => this.resize());
        }

        if (!this.animated) return;

        // The hero text sits on top of the canvas, so listen on the whole hero
        const area = this.canvas.parentElement || this.canvas;

        area.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        area.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        // Pause while the hero is scrolled out of view
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    this.start();
                } else {
                    this.stop();
                }
            }).observe(this.canvas);
        }
    }

    start() {
        if (this.running) return;
        this.running = true;

        const loop = () => {
            if (!this.running) return;
            for (const particle of this.particles) {
                this.updateParticle(particle);
            }
            this.draw();
            this.frame = requestAnimationFrame(loop);
        };

        this.frame = requestAnimationFrame(loop);
    }

    stop() {
        this.running = false;
        cancelAnimationFrame(this.frame);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (const particle of this.particles) {
            this.drawParticle(particle);
        }
        this.connectParticles();
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
    }

    connectParticles() {
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a + 1; b < this.particles.length; b++) {
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = 1 - (distance / 120);
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.15})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
                    this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticle(particle) {
        // Bounce off the edges (only when heading outwards, so a particle
        // sitting exactly on an edge can't get stuck flipping back and forth)
        if ((particle.x - particle.size <= 0 && particle.directionX < 0) ||
            (particle.x + particle.size >= this.width && particle.directionX > 0)) {
            particle.directionX = -particle.directionX;
        }
        if ((particle.y - particle.size <= 0 && particle.directionY < 0) ||
            (particle.y + particle.size >= this.height && particle.directionY > 0)) {
            particle.directionY = -particle.directionY;
        }

        // Mouse interaction
        if (this.mouse.x !== null && this.mouse.y !== null) {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0 && distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                particle.x -= (dx / distance) * force * 2;
                particle.y -= (dy / distance) * force * 2;
            }
        }

        // Natural movement
        particle.x += particle.directionX;
        particle.y += particle.directionY;

        // Keep particles the mouse pushed past the edge from getting stuck there
        particle.x = Math.min(Math.max(particle.x, particle.size), this.width - particle.size);
        particle.y = Math.min(Math.max(particle.y, particle.size), this.height - particle.size);
    }
}
