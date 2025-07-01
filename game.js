// BlokSpace Game - Classic Paintball Game
class BlokSpaceGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Game state
        this.gameState = 'playing'; // playing, paused, gameOver
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.isMuted = false;

        // Game objects
        this.player = {
            x: 400,
            y: 500,
            width: 30,
            height: 30,
            speed: 5,
            color: '#00ff00',
            invincible: false
        };

        this.bullets = [];
        this.enemies = [];
        this.enemyBullets = [];
        this.particles = [];

        // Game timing
        this.lastTime = 0;
        this.enemySpawnTimer = 0;
        this.enemySpawnDelay = 2000; // 2 seconds
        this.shootCooldown = 0;
        this.shootDelay = 150; // Prevent spam shooting

        // Input handling
        this.keys = {};
        this.touchControls = {};

        // Performance optimization
        this.maxBullets = 20;
        this.maxEnemyBullets = 30;
        this.maxParticles = 50;

        // Initialize
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.updateCopyright();
        this.spawnInitialEnemies();
        this.gameLoop();
    }

    setupCanvas() {
        // Make canvas responsive
        const resizeCanvas = () => {
            const container = this.canvas.parentElement;
            const containerWidth = container.clientWidth;
            const containerHeight = Math.min(600, window.innerHeight * 0.6);

            // Maintain aspect ratio
            const aspectRatio = 800 / 600;
            let canvasWidth = containerWidth;
            let canvasHeight = canvasWidth / aspectRatio;

            if (canvasHeight > containerHeight) {
                canvasHeight = containerHeight;
                canvasWidth = canvasHeight * aspectRatio;
            }

            this.canvas.style.width = canvasWidth + 'px';
            this.canvas.style.height = canvasHeight + 'px';
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Button events
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('muteBtn').addEventListener('click', () => this.toggleMute());
        document.getElementById('restartBtn').addEventListener('click', () => this.resetGame());
        
        // Mobile controls
        this.setupMobileControls();
        
        // Prevent context menu on canvas
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    setupMobileControls() {
        const dpadButtons = document.querySelectorAll('.dpad-btn');
        const actionButtons = document.querySelectorAll('.action-btn');
        
        dpadButtons.forEach(btn => {
            const key = btn.dataset.key;
            if (key) {
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.touchControls[key] = true;
                });
                btn.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.touchControls[key] = false;
                });
            }
        });
        
        actionButtons.forEach(btn => {
            const key = btn.dataset.key;
            if (key) {
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    if (key === 'shoot') {
                        this.shoot();
                    }
                });
            }
        });
    }
    
    handleKeyDown(e) {
        this.keys[e.code] = true;
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                if (this.gameState === 'playing') {
                    this.shoot();
                } else if (this.gameState === 'paused') {
                    this.togglePause();
                }
                break;
            case 'KeyP':
                this.togglePause();
                break;
            case 'KeyR':
                this.resetGame();
                break;
            case 'KeyM':
                this.toggleMute();
                break;
        }
    }
    
    handleKeyUp(e) {
        this.keys[e.code] = false;
    }
    
    updateCopyright() {
        document.getElementById('currentYear').textContent = new Date().getFullYear();
    }
    
    spawnInitialEnemies() {
        for (let i = 0; i < 5; i++) {
            this.spawnEnemy();
        }
    }
    
    spawnEnemy() {
        const enemy = {
            x: Math.random() * (this.canvas.width - 30),
            y: Math.random() * 200 + 50,
            width: 25,
            height: 25,
            speed: 1 + Math.random() * 2,
            color: '#ff4444',
            direction: Math.random() > 0.5 ? 1 : -1,
            shootTimer: 0,
            shootDelay: 1000 + Math.random() * 2000
        };
        this.enemies.push(enemy);
    }
    
    shoot() {
        if (this.gameState !== 'playing' || this.shootCooldown > 0) return;

        // Limit bullets for performance
        if (this.bullets.length >= this.maxBullets) return;

        const bullet = {
            x: this.player.x + this.player.width / 2 - 2,
            y: this.player.y,
            width: 4,
            height: 10,
            speed: 8,
            color: '#00ffff'
        };
        this.bullets.push(bullet);
        this.playSound('shoot');
        this.shootCooldown = this.shootDelay;
    }
    
    enemyShoot(enemy) {
        const bullet = {
            x: enemy.x + enemy.width / 2 - 2,
            y: enemy.y + enemy.height,
            width: 4,
            height: 8,
            speed: 4,
            color: '#ff8800'
        };
        this.enemyBullets.push(bullet);
    }
    
    update(deltaTime) {
        if (this.gameState !== 'playing') return;

        // Update cooldowns
        if (this.shootCooldown > 0) {
            this.shootCooldown -= deltaTime;
        }

        this.updatePlayer();
        this.updateBullets();
        this.updateEnemies(deltaTime);
        this.updateEnemyBullets();
        this.updateParticles();
        this.checkCollisions();
        this.spawnEnemiesOverTime(deltaTime);
        this.updateUI();

        // Performance optimization - limit arrays
        this.limitArraySizes();
    }

    limitArraySizes() {
        if (this.bullets.length > this.maxBullets) {
            this.bullets = this.bullets.slice(-this.maxBullets);
        }
        if (this.enemyBullets.length > this.maxEnemyBullets) {
            this.enemyBullets = this.enemyBullets.slice(-this.maxEnemyBullets);
        }
        if (this.particles.length > this.maxParticles) {
            this.particles = this.particles.slice(-this.maxParticles);
        }
    }
    
    updatePlayer() {
        // Keyboard controls
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            this.player.x = Math.max(0, this.player.x - this.player.speed);
        }
        if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + this.player.speed);
        }
        if (this.keys['KeyW'] || this.keys['ArrowUp']) {
            this.player.y = Math.max(0, this.player.y - this.player.speed);
        }
        if (this.keys['KeyS'] || this.keys['ArrowDown']) {
            this.player.y = Math.min(this.canvas.height - this.player.height, this.player.y + this.player.speed);
        }
        
        // Touch controls
        if (this.touchControls.left) {
            this.player.x = Math.max(0, this.player.x - this.player.speed);
        }
        if (this.touchControls.right) {
            this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + this.player.speed);
        }
        if (this.touchControls.up) {
            this.player.y = Math.max(0, this.player.y - this.player.speed);
        }
        if (this.touchControls.down) {
            this.player.y = Math.min(this.canvas.height - this.player.height, this.player.y + this.player.speed);
        }
    }
    
    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            bullet.y -= bullet.speed;
            return bullet.y > -bullet.height;
        });
    }
    
    updateEnemies(deltaTime) {
        this.enemies.forEach(enemy => {
            // Move enemy
            enemy.x += enemy.direction * enemy.speed;
            
            // Bounce off walls
            if (enemy.x <= 0 || enemy.x >= this.canvas.width - enemy.width) {
                enemy.direction *= -1;
                enemy.y += 20; // Move down when hitting wall
            }
            
            // Enemy shooting
            enemy.shootTimer += deltaTime;
            if (enemy.shootTimer >= enemy.shootDelay) {
                this.enemyShoot(enemy);
                enemy.shootTimer = 0;
                enemy.shootDelay = 1000 + Math.random() * 2000;
            }
        });
    }
    
    updateEnemyBullets() {
        this.enemyBullets = this.enemyBullets.filter(bullet => {
            bullet.y += bullet.speed;
            return bullet.y < this.canvas.height + bullet.height;
        });
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 1;
            particle.alpha = particle.life / particle.maxLife;
            return particle.life > 0;
        });
    }
    
    checkCollisions() {
        // Player bullets vs enemies (use reverse loop to avoid index issues)
        for (let bulletIndex = this.bullets.length - 1; bulletIndex >= 0; bulletIndex--) {
            const bullet = this.bullets[bulletIndex];
            for (let enemyIndex = this.enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
                const enemy = this.enemies[enemyIndex];
                if (this.isColliding(bullet, enemy)) {
                    // Remove bullet and enemy
                    this.bullets.splice(bulletIndex, 1);
                    this.enemies.splice(enemyIndex, 1);

                    // Add score
                    this.score += 100;

                    // Create explosion particles
                    this.createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#ff4444');

                    // Play sound
                    this.playSound('hit');

                    // Spawn new enemy occasionally
                    if (Math.random() < 0.6) {
                        this.spawnEnemy();
                    }
                    break; // Exit inner loop since bullet is destroyed
                }
            }
        }

        // Enemy bullets vs player
        for (let bulletIndex = this.enemyBullets.length - 1; bulletIndex >= 0; bulletIndex--) {
            const bullet = this.enemyBullets[bulletIndex];
            if (this.isColliding(bullet, this.player)) {
                this.enemyBullets.splice(bulletIndex, 1);
                this.lives--;
                this.createExplosion(this.player.x + this.player.width/2, this.player.y + this.player.height/2, '#00ff00');
                this.playSound('playerHit');

                // Add brief invincibility
                this.player.invincible = true;
                setTimeout(() => {
                    this.player.invincible = false;
                }, 1000);

                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        }

        // Enemies vs player (only if not invincible)
        if (!this.player.invincible) {
            this.enemies.forEach(enemy => {
                if (this.isColliding(enemy, this.player)) {
                    this.lives--;
                    this.createExplosion(this.player.x + this.player.width/2, this.player.y + this.player.height/2, '#00ff00');
                    this.playSound('playerHit');

                    // Add brief invincibility
                    this.player.invincible = true;
                    setTimeout(() => {
                        this.player.invincible = false;
                    }, 1000);

                    if (this.lives <= 0) {
                        this.gameOver();
                    }
                }
            });
        }
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    createExplosion(x, y, color) {
        for (let i = 0; i < 8; i++) {
            const particle = {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: color,
                life: 30,
                maxLife: 30,
                alpha: 1,
                size: 3 + Math.random() * 3
            };
            this.particles.push(particle);
        }
    }
    
    spawnEnemiesOverTime(deltaTime) {
        this.enemySpawnTimer += deltaTime;
        if (this.enemySpawnTimer >= this.enemySpawnDelay) {
            if (this.enemies.length < 8) {
                this.spawnEnemy();
            }
            this.enemySpawnTimer = 0;
        }
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars background
        this.drawStars();
        
        // Draw game objects
        this.drawPlayer();
        this.drawBullets();
        this.drawEnemies();
        this.drawEnemyBullets();
        this.drawParticles();
    }
    
    drawStars() {
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 50; i++) {
            const x = (i * 137) % this.canvas.width;
            const y = (i * 211) % this.canvas.height;
            this.ctx.fillRect(x, y, 1, 1);
        }
    }
    
    drawPlayer() {
        // Flash player when invincible
        if (this.player.invincible && Math.floor(Date.now() / 100) % 2) {
            this.ctx.globalAlpha = 0.5;
        }

        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);

        // Draw player gun
        this.ctx.fillStyle = '#888888';
        this.ctx.fillRect(this.player.x + this.player.width/2 - 2, this.player.y - 5, 4, 8);

        // Reset alpha
        this.ctx.globalAlpha = 1;
    }
    
    drawBullets() {
        this.bullets.forEach(bullet => {
            this.ctx.fillStyle = bullet.color;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }
    
    drawEnemies() {
        this.enemies.forEach(enemy => {
            this.ctx.fillStyle = enemy.color;
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }
    
    drawEnemyBullets() {
        this.enemyBullets.forEach(bullet => {
            this.ctx.fillStyle = bullet.color;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
            this.ctx.restore();
        });
    }
    
    playSound(type) {
        if (this.isMuted) return;

        try {
            // Create simple sound effects using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            switch(type) {
                case 'shoot':
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.1);
                    break;
                case 'hit':
                    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
                    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.2);
                    break;
                case 'playerHit':
                    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.5);
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.5);
                    break;
            }
        } catch (error) {
            console.log('Audio not supported or blocked');
        }
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseScreen').classList.remove('hidden');
            document.getElementById('pauseBtn').innerHTML = '<span class="btn-icon">▶️</span><span class="btn-text">Resume</span>';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseScreen').classList.add('hidden');
            document.getElementById('pauseBtn').innerHTML = '<span class="btn-icon">⏸️</span><span class="btn-text">Pause</span>';
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        const muteBtn = document.getElementById('muteBtn');
        if (this.isMuted) {
            muteBtn.innerHTML = '<span class="btn-icon">🔇</span><span class="btn-text">Sound</span>';
        } else {
            muteBtn.innerHTML = '<span class="btn-icon">🔊</span><span class="btn-text">Sound</span>';
        }
    }
    
    resetGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        
        // Reset player position
        this.player.x = 400;
        this.player.y = 500;
        
        // Clear arrays
        this.bullets = [];
        this.enemies = [];
        this.enemyBullets = [];
        this.particles = [];
        
        // Reset timers
        this.enemySpawnTimer = 0;
        
        // Hide screens
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('pauseScreen').classList.add('hidden');
        
        // Reset button text
        document.getElementById('pauseBtn').innerHTML = '<span class="btn-icon">⏸️</span><span class="btn-text">Pause</span>';
        
        // Spawn initial enemies
        this.spawnInitialEnemies();
        
        // Update UI
        this.updateUI();
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }
    
    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new BlokSpaceGame();
});
