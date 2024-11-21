export default class WaterFlow {
    constructor(scene, startX, startY) {
        this.scene = scene;
        this.startX = startX;
        this.startY = startY;
        this.waterSprites = [];
    }
  
    createParticles(x, y) {
        const particles = this.scene.add.particles(x, y, 'water', {
            scale: { start: 0.2, end: 0 },
            speed: { min: 20, max: 40 },
            angle: { min: 0, max: 360 },
            lifespan: 600,
            frequency: 100,
            quantity: 2,
            alpha: { start: 0.5, end: 0 },
            blendMode: 'ADD'
        });
    
        this.scene.time.delayedCall(1000, () => {
            particles.destroy();
        });
    
        return particles;
    }

    createWaterFlow(startPoint, endPoint, duration = 200) {
        const dx = endPoint.x - startPoint.x;
        const dy = endPoint.y - startPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        const waterSprite = this.scene.add.sprite(startPoint.x, startPoint.y, 'water')
        .setOrigin(0, 0.5)
        .setRotation(angle)
        .setScale(0, 1)
        .setAlpha(0.7);

        this.waterSprites.push(waterSprite);

        this.scene.tweens.add({
        targets: waterSprite,
        scaleX: distance / waterSprite.width,
        duration: duration,
        ease: 'Linear'
        });

        this.createParticles(startPoint.x, startPoint.y);
        
        this.scene.time.delayedCall(duration, () => {
            this.createParticles(endPoint.x, endPoint.y);
        });

        return waterSprite;
    }
  
    destroy() {
        this.waterSprites.forEach(sprite => sprite.destroy());
        this.waterSprites = [];
    }
  }