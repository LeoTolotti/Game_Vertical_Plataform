// selecionando o canvas do HTML
const canvas = document.querySelector("canvas");
// colocando o contexto do canvas em 2D
const c = canvas.getContext("2d");

// tamanho do quadro do canvas
canvas.width = 1024;
canvas.height = 576;

//estala do fundo
const scaledCanvas = {
  width: canvas.width / 4,
  height: canvas.height / 4,
};
//blocos de colisão
const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += 36) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 36));
}
const collisionBlocks = [];
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      );
    }
  });
});

const platformCollisions2D = [];
for (let i = 0; i < platformCollisions.length; i += 36) {
  platformCollisions2D.push(platformCollisions.slice(i, i + 36));
}
const platformCollisionBlocks = [];
platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      platformCollisionBlocks.push(
        new CollisionBlock({ position: { x: x * 16, y: y * 16 }, height: 8 })
      );
    }
  });
});

const gravity = 0.3;

//criando Player aqui pela classe
const player = new Player({
  position: {
    x: 100,
    y: 300,
  },
  collisionBlocks,
  platformCollisionBlocks,
  imageSrc: "./img/warrior/Idle.png",
  frameRate: 8,
  animations: {
    Idle: {
      imageSrc: "./img/warrior/Idle.png",
      frameRate: 8,
      frameBuffer: 3,
    },
    IdleLeft: {
      imageSrc: "./img/warrior/IdleLeft.png",
      frameRate: 8,
      frameBuffer: 3,
    },
    Run: {
      imageSrc: "./img/warrior/Run.png",
      frameRate: 8,
      frameBuffer: 7,
    },
    RunLeft: {
      imageSrc: "./img/warrior/RunLeft.png",
      frameRate: 8,
      frameBuffer: 7,
    },
    Jump: {
      imageSrc: "./img/warrior/Jump.png",
      frameRate: 2,
      frameBuffer: 5,
    },
    JumpLeft: {
      imageSrc: "./img/warrior/JumpLeft.png",
      frameRate: 2,
      frameBuffer: 5,
    },
    Fall: {
      imageSrc: "./img/warrior/Fall.png",
      frameRate: 2,
      frameBuffer: 5,
    },
    FallLeft: {
      imageSrc: "./img/warrior/FallLeft.png",
      frameRate: 2,
      frameBuffer: 5,
    },
  },
});

//definindo uma variavel para as teclas que vão ser usadas
const keys = {
  d: {
    pressed: false,
  },
  arrowright: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  arrowleft: {
    pressed: false,
  },
};
//Criando fundo pela classe
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});
const backgroundImageHeight = 432;

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
};

// função de atualizar pagina para criar o movimento
function animate() {
  window.requestAnimationFrame(animate);
  //pintando cor e tamanho do canvas na tela
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.save();
  c.scale(4, 4);
  c.translate(camera.position.x, camera.position.y);
  background.update();
  /*
  collisionBlocks.forEach((collisionBlock) => {
    collisionBlock.update();
  });
  platformCollisionBlocks.forEach((collisionBlock) => {
    collisionBlock.update();
  });
  */
  player.checkForHorizontalCanvasCollision();
  player.update();

  player.velocity.x = 0;
  if (keys.d.pressed || keys.arrowright.pressed) {
    player.lastDirection = "Right";
    player.switchSprite("Run");
    player.velocity.x = 2;
    player.shouldPanCameraToTheLeft({ canvas, camera });
  } else if (keys.a.pressed || keys.arrowleft.pressed) {
    player.lastDirection = "Left";
    player.switchSprite("RunLeft");
    player.velocity.x = -2;
    player.shouldPanCameraToTheRight({ canvas, camera });
  } else if (player.velocity.x === 0) {
    if (player.lastDirection === "Right") {
      player.switchSprite("Idle");
    } else {
      player.switchSprite("IdleLeft");
    }
  }
  if (player.velocity.y < 0) {
    player.shouldPanCameraDown({ canvas, camera });
    if (player.lastDirection === "Right") {
      player.switchSprite("Jump");
    } else {
      player.switchSprite("JumpLeft");
    }
  } else if (player.velocity.y > 0) {
    player.shouldPanCameraUp({ canvas, camera });
    if (player.lastDirection === "Right") {
      player.switchSprite("Fall");
    } else {
      player.switchSprite("FallLeft");
    }
  }
  c.restore();
}

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
    case "ArrowRight":
      keys.d.pressed = true;
      keys.arrowright.pressed = true;
      break;
    case "a":
    case "ArrowLeft":
      keys.a.pressed = true;
      keys.arrowleft.pressed = true;
      break;
    case "w":
    case "ArrowUp":
      player.velocity.y = -6;
      break;
  }
});
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
    case "ArrowRight":
      keys.d.pressed = false;
      keys.arrowright.pressed = false;
      break;
    case "a":
    case "ArrowLeft":
      keys.a.pressed = false;
      keys.arrowleft.pressed = false;
      break;
  }
});

animate();
