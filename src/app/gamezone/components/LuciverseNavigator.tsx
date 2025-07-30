'use client';

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';


// --- Data Structures (No changes) ---
interface Project { id: number; name: string; }
interface Achievement { id: number; title: string; }
interface UniverseObject { x: number; y: number; label: string; type: 'project' | 'achievement'; size: number; }
interface Spaceship { x: number; y: number; angle: number; velocity: { x: number; y: number; }; }

const LuciverseNavigator = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [universeObjects, setUniverseObjects] = useState<UniverseObject[]>([]);
    const [nearbyObject, setNearbyObject] = useState<UniverseObject | null>(null);

    // Data fetching logic remains the same
    useEffect(() => {
        const placeholderProjects: Project[] = [ { id: 1, name: 'AlgoRhythm' }, { id: 2, name: 'Luciverse Portfolio' }, { id: 3, name: 'Code Snippet Manager' } ];
        const placeholderAchievements: Achievement[] = [ { id: 1, title: 'GFG Campus Mantri' }, { id: 2, title: 'Hackathon Winner' }, ];
        const objects: UniverseObject[] = [];
        // FIX: Universe ko wapas bada karte hain
        const universeWidth = 2000, universeHeight = 1500;
        placeholderProjects.forEach(proj => { objects.push({ x: Math.random() * universeWidth, y: Math.random() * universeHeight, label: proj.name, type: 'project', size: 40 + Math.random() * 20, }); });
        placeholderAchievements.forEach(ach => { objects.push({ x: Math.random() * universeWidth, y: Math.random() * universeHeight, label: ach.title, type: 'achievement', size: 20, }); });
        setUniverseObjects(objects);
    }, []);

    useEffect(() => {
        if (universeObjects.length === 0 || !canvasRef.current) return;
        
        canvasRef.current.innerHTML = "";

        const sketch = (p: p5) => {
            // Start spaceship at the center of the universe, not the canvas
            let localSpaceship: Spaceship = { x: 1000, y: 750, angle: -p.PI / 2, velocity: { x: 0, y: 0 } };

            p.setup = () => p.createCanvas(800, 600);

            const updateSpaceship = () => {
                if (p.keyIsDown(p.LEFT_ARROW)) localSpaceship.angle -= 0.05;
                if (p.keyIsDown(p.RIGHT_ARROW)) localSpaceship.angle += 0.05;
                if (p.keyIsDown(p.UP_ARROW)) {
                    const force = { x: Math.cos(localSpaceship.angle) * 0.1, y: Math.sin(localSpaceship.angle) * 0.1 };
                    localSpaceship.velocity.x += force.x;
                    localSpaceship.velocity.y += force.y;
                }
                localSpaceship.x += localSpaceship.velocity.x;
                localSpaceship.y += localSpaceship.velocity.y;
                localSpaceship.velocity.x *= 0.99;
                localSpaceship.velocity.y *= 0.99;

                let foundObject: UniverseObject | null = null;
                for (const obj of universeObjects) {
                    const distance = p.dist(localSpaceship.x, localSpaceship.y, obj.x, obj.y);
                    if (distance < obj.size / 2 + 40) {
                        foundObject = obj;
                        break;
                    }
                }
                setNearbyObject(current => current?.label !== foundObject?.label ? foundObject : current);
            };

            const drawSpaceship = () => {
                p.push();
                // Spaceship hamesha screen ke center mein draw hogi
                p.translate(p.width / 2, p.height / 2);
                p.rotate(localSpaceship.angle + p.PI / 2);
                p.fill(255);
                p.stroke(255, 0, 0);
                p.triangle(-15, 15, 15, 15, 0, -15);
                p.pop();
            };
            
            const drawUniverse = () => {
                universeObjects.forEach(obj => {
                    p.push();
                    if (obj.type === 'project') {
                        p.fill(100, 100, 250);
                        p.noStroke();
                        p.ellipse(obj.x, obj.y, obj.size, obj.size);
                    } else if (obj.type === 'achievement') {
                        p.fill(255, 223, 0);
                        p.noStroke();
                        p.ellipse(obj.x, obj.y, obj.size, obj.size);
                    }
                    p.fill(255);
                    p.textAlign(p.CENTER);
                    p.text(obj.label, obj.x, obj.y + obj.size / 2 + 15);
                    p.pop();
                });
            };

            p.draw = () => {
                p.background(0);
                updateSpaceship();
                
                // FIX: Camera ko pehle set karo
                p.push();
                p.translate(-localSpaceship.x + p.width / 2, -localSpaceship.y + p.height / 2);
                
                // Fir universe draw karo
                drawUniverse();
                
                p.pop();

                // Aakhir mein spaceship draw karo
                drawSpaceship();
            };
        };
        
        let p5Instance = new p5(sketch, canvasRef.current!);
        
        return () => p5Instance.remove();

    }, [universeObjects]);

    return (
        <div className="flex flex-col items-center relative">
            <h2 className="text-3xl font-bold mb-4">Luciverse Navigator</h2>
            {nearbyObject && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white p-2 px-4 rounded-lg border border-primary z-10 animate-pulse">
                    <p className="font-bold text-lg">{nearbyObject.label}</p>
                    <p className="text-sm text-gray-300 capitalize text-center">{nearbyObject.type}</p>
                </div>
            )}
            <div ref={canvasRef} className="border-2 border-primary rounded-lg overflow-hidden" />
            <p className="mt-4 text-gray-400">Use Arrow Keys. Fly close to planets to see details.</p>
        </div>
    );
};

export default LuciverseNavigator;