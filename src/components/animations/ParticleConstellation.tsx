'use client';

import React, { useRef, useEffect } from 'react';

// TypeScript interface for Particle
interface Particle {
    x: number;
    y: number;
    directionX: number;
    directionY: number;
    size: number;
    color: string;
    draw: (ctx: CanvasRenderingContext2D) => void;
    update: (ctx: CanvasRenderingContext2D) => void;
}

const ParticleConstellation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctxRef.current = ctx;

        let animationFrameId: number;
        let particles: Particle[] = [];

        const setCanvasSize = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();

        const mouse = {
            x: 0,
            y: 0,
            radius: 150
        };

        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = event.x;
            mouse.y = event.y;
        };

        const handleResize = () => {
            setCanvasSize();
            init();
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        class ParticleImpl implements Particle {
            x: number;
            y: number;
            directionX: number;
            directionY: number;
            size: number;
            color: string;

            constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update(ctx: CanvasRenderingContext2D) {
                const canvas = canvasRef.current;
                if (!canvas) return;

                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 5;
                    if (mouse.x > this.x && this.x > this.size * 10) this.x -= 5;
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 5;
                    if (mouse.y > this.y && this.y > this.size * 10) this.y -= 5;
                }

                this.x += this.directionX;
                this.y += this.directionY;
                this.draw(ctx);
            }
        }

        const init = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            particles = [];
            const numberOfParticles = Math.min((canvas.width * canvas.height) / 9000, 200);

            for (let i = 0; i < numberOfParticles; i++) {
                const size = Math.random() * 2 + 1;
                const x = Math.random() * (canvas.width - size * 4) + size * 2;
                const y = Math.random() * (canvas.height - size * 4) + size * 2;
                const directionX = Math.random() * 0.4 - 0.2;
                const directionY = Math.random() * 0.4 - 0.2;
                const color = 'rgba(128, 128, 128, 0.8)';

                particles.push(new ParticleImpl(x, y, directionX, directionY, size, color));
            }
        };

        const connect = (ctx: CanvasRenderingContext2D) => {
            const maxDistance = 120 * 120;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = dx * dx + dy * dy;

                    if (distance < maxDistance) {
                        const opacity = 1 - distance / maxDistance;
                        ctx.strokeStyle = `rgba(140, 85, 200, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            const ctx = ctxRef.current;
            const canvas = canvasRef.current;
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update(ctx);
            }

            connect(ctx);
            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full z-0"
        />
    );
};

export default ParticleConstellation;
