import map from "./map.js";
import warZonesData from "./BattleZones.js";
import {
    Sprite,
    canvas,
    ctx,
    boundary
} from "./classes.js";
import {
    warBackgroundImage,
    warBackground,
    draggle,
    emby,
    renderedSprites,
    animateWar,
    initWar
} from './WarScene.js'
import attacks from "./Attacks.js";
import sound from "./audio.js";

// Creat background-image in the canvas
const image = new Image();
image.src = './images/mapGamePokemon.png';


// foreground Object
const foregroundImage = new Image();
foregroundImage.src = './images/foregroundObject.png';

//Creat image player
const imagePlayerDown = new Image();
imagePlayerDown.src = './images/playerDown.png';

const imagePlayerUp = new Image();
imagePlayerUp.src = './images/playerUP.png';

const imagePlayerLeft = new Image();
imagePlayerLeft.src = './images/playerLeft.png';

const imagePlayerRight = new Image();
imagePlayerRight.src = './images/playerRight.png';

const keys = {

    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    }
}

// Array for mapPlayer
const mapArray = [];
for (let i = 0; i < map.length; i += 70) {
    mapArray.push(map.slice(i, i + 70));
}

// Array for warZone
const warZonesMap = [];
for (let i = 0; i < warZonesData.length; i += 70) {
    warZonesMap.push(warZonesData.slice(i, i + 70));
}


const boundaries = [];
const offset = {
    x: -150,
    y: -300
}

mapArray.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 3077)
            boundaries.push(
                new boundary({
                    position: {
                        x: j * boundary.with + offset.x,
                        y: i * boundary.height + offset.y
                    }
                })
            )
    })
})

const warZones = [];
warZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 3077)
            warZones.push(
                new boundary({
                    position: {
                        x: j * boundary.with + offset.x,
                        y: i * boundary.height + offset.y
                    }
                })
            )
    })
})

//  Class image

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 19 / 6,
        y: canvas.height / 2 - 6 / 6
    },
    image: imagePlayerDown,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: imagePlayerUp,
        left: imagePlayerLeft,
        right: imagePlayerRight,
        down: imagePlayerDown
    }
})
const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const forground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: foregroundImage
})

// onload images
const movables = [background, ...boundaries, forground, ...warZones];

function rectangularCollision(rectangle1, rectangle2) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}

const war = {
    initiated: false
}

animate()
    // initWar()

function animate() {
    document.querySelector('.container .userInterface').style.display = 'none';
    document.querySelector('.container .userInterface2').style.display = 'none';
    document.querySelector('.container .userInterface3').style.display = 'none';
    const animationId = requestAnimationFrame(animate);
    background.draw()
    boundaries.forEach((boundary) => {
        boundary.draw()
    })
    warZones.forEach((boundary) => {
        boundary.draw();
    })

    // console.log(warZones)
    player.draw();
    forground.draw();

    let moving = true;
    player.animate = false;
    if (war.initiated) return

    // Activate a Battle
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < warZones.length; i++) {
            const warZone = warZones[i];
            const rectangle2 = warZone;
            const overlappingArea =
                (Math.min(
                        player.position.x + player.width,
                        warZone.position.x + warZone.width
                    ) -
                    Math.max(player.position.x, warZone.position.x)) *
                (Math.min(
                        player.position.y + player.height,
                        warZone.position.y + warZone.height
                    ) -
                    Math.max(player.position.y, warZone.position.y))
            if (
                rectangularCollision(player, rectangle2) && overlappingArea < (player.width * player.height) / 2 &&
                Math.random() < 0.01
            ) {
                console.log('activate battle zones ');
                // deactivate current animation 
                cancelAnimationFrame(animationId)

                sound.Map.stop()
                sound.InitWar.play()
                sound.War.play()

                war.initiated = true;
                gsap.to('.pageBlack', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        gsap.to('.pageBlack', {
                            opacity: 1,
                            duration: 0.4,
                            onComplete() {
                                // activate a new animation loop
                                initWar()
                                animateWar()
                                gsap.to('.pageBlack', {
                                    opacity: 0,
                                    duration: 0.4
                                })
                            }
                        })
                    }
                })
                break;
            }
        }
    }

    if (keys.w.pressed && lastKey === 'w') {
        player.animate = true;
        player.image = player.sprites.up;

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            const rectangle2 = {
                ...boundary,
                position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 3
                }
            }
            if (
                rectangularCollision(
                    player,
                    rectangle2
                )
            ) {
                moving = false;
                break;
            }
        }
        if (moving)
            movables.forEach(movables => {
                movables.position.y += 3
            })
    } else if (keys.a.pressed && lastKey === 'a') {
        player.animate = true;
        player.image = player.sprites.left;

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            const rectangle2 = {
                ...boundary,
                position: {
                    x: boundary.position.x + 3,
                    y: boundary.position.y
                }
            }
            if (
                rectangularCollision(
                    player,
                    rectangle2
                )
            ) {
                moving = false;
                break;
            }
        }

        if (moving)
            movables.forEach(movables => {
                movables.position.x += 3
            })
    } else if (keys.s.pressed && lastKey === 's') {
        player.animate = true;
        player.image = player.sprites.down;

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            const rectangle2 = {
                ...boundary,
                position: {
                    x: boundary.position.x - 3,
                    y: boundary.position.y
                }
            }
            if (
                rectangularCollision(
                    player,
                    rectangle2
                )
            ) {
                console.log('colliding')
                moving = false;
                break;
            }
        }

        if (moving)
            movables.forEach(movables => {
                movables.position.y -= 3;
            })
    } else if (keys.d.pressed && lastKey === 'd') {
        player.animate = true;
        player.image = player.sprites.right;

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            const rectangle2 = {
                ...boundary,
                position: {
                    x: boundary.position.x,
                    y: boundary.position.y - 3
                }
            }
            if (
                rectangularCollision(
                    player,
                    rectangle2
                )
            ) {
                moving = false;
                break;
            }
        }

        if (moving)
            movables.forEach(movables => {
                movables.position.x -= 3
            })
    }
}

//  Creat key player

let lastKey = '';
addEventListener('keydown', (e) => {
    if (e.key == "a") {
        keys.a.pressed = true;
        lastKey = 'a';
    } else if (e.key == "s") {
        keys.s.pressed = true;
        lastKey = 's';
    } else if (e.key == "d") {
        keys.d.pressed = true;
        lastKey = 'd';
    } else if (e.key == "w") {
        keys.w.pressed = true;
        lastKey = 'w';
    }
});

addEventListener('keyup', (e) => {
    if (e.key == "a") {
        keys.a.pressed = false;
    } else if (e.key == "s") {
        keys.s.pressed = false;
    } else if (e.key == "d") {
        keys.d.pressed = false;
    } else if (e.key == "w") {
        keys.w.pressed = false;
    }
});

let clicked = false;
addEventListener('click', () => {
    if (!clicked) {
        sound.Map.play()
    }
    clicked = true
})

export {
    animate,
    war
}