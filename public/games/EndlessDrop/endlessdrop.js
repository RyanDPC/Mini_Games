const container = document.getElementById('game-container');

function createFallingItem() {
  const item = document.createElement('div');
  item.classList.add('falling-item');

  const randomX = Math.random() * window.innerWidth;
  item.style.left = `${randomX}px`;

  const duration = Math.random() * 3 + 2;
  item.style.animationDuration = `${duration}s`;

  container.appendChild(item);

  item.addEventListener('animationend', () => {
    item.remove();
  });
}

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
  
  function createFallingItem() {
    const item = document.createElement('div');
    item.classList.add('falling-item');
  
    const randomX = Math.random() * window.innerWidth;
    item.style.left = `${randomX}px`;
  
    const duration = Math.random() * 3 + 2;
    item.style.animationDuration = `${duration}s`;
  
    container.appendChild(item);
  
    item.addEventListener('animationend', () => {
      item.remove();
    });

    const collisionInterval = setInterval(() => {
      if (checkCollision(item)) {
        alert('Game Over !');
        clearInterval(collisionInterval);
        item.remove();
        location.reload();
      }
    }, 50);
  }
  

  const player = document.getElementById('player');
  let playerX = window.innerWidth / 2;
  const playerSpeed = 5;
  const keys = {};

  document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
  });

  document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });

  function movePlayer() {
    if (keys['ArrowLeft'] || keys['a']) {
      playerX = Math.max(playerX - playerSpeed, 0 + player.offsetWidth / 2);
    }
    if (keys['ArrowRight'] || keys['d']) {
      playerX = Math.min(playerX + playerSpeed, window.innerWidth - player.offsetWidth / 2
        
      );
    }
    player.style.left = `${playerX}px`;
  
    requestAnimationFrame(movePlayer);
  }

  movePlayer();  

setInterval(createFallingItem, 500);