//mettre un systeme de temps et ajouter de la diff

const container = document.getElementById('game-container');
    const player = document.getElementById('player');
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    let playerX = container.offsetWidth / 2;
    const playerSpeed = 5;
    const keys = {};

    // Resize canvas to match container size
    function resizeCanvas() {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create falling item and check for collision
    function createFallingItem() {
      const item = document.createElement('div');
      item.classList.add('falling-item');

      const randomX = Math.random() * (container.offsetWidth - 30);
      item.style.left = `${randomX}px`;

      const duration = Math.random() * 3 + 2;
      item.style.animationDuration = `${duration}s`;

      container.appendChild(item);

      item.addEventListener('animationend', () => item.remove());

      // Check collision with player
      const collisionInterval = setInterval(() => {
        if (checkCollision(item)) {
          alert('Game Over!');
          clearInterval(collisionInterval);
          location.reload();
        }
      }, 50);
    }

    // Check collision between player and item
    function checkCollision(item) {
      const itemRect = item.getBoundingClientRect();
      const playerRect = player.getBoundingClientRect();

      return (
        itemRect.top < playerRect.bottom &&
        itemRect.bottom > playerRect.top &&
        itemRect.left < playerRect.right &&
        itemRect.right > playerRect.left
      );
    }

    // Handle player movement
    document.addEventListener('keydown', (e) => keys[e.key] = true);
    document.addEventListener('keyup', (e) => keys[e.key] = false);

    function movePlayer() {
      if (keys['ArrowLeft'] || keys['a']) {
        playerX = Math.max(playerX - playerSpeed, 0);
      }
      if (keys['ArrowRight'] || keys['d']) {
        playerX = Math.min(playerX + playerSpeed, container.offsetWidth - player.offsetWidth);
      }
      player.style.left = `${playerX}px`;

      requestAnimationFrame(movePlayer);
    }

    // Draw background canvas animation
    function drawBackground() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 2;
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, 0, Math.PI * 2);
      }
      ctx.fill();
      requestAnimationFrame(drawBackground);
    }

    // Initialize player position, game loop, and background animation
    player.style.left = `${playerX}px`;
    movePlayer();
    setInterval(createFallingItem, 800);
    drawBackground();