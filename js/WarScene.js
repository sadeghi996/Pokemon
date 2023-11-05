import {
    Sprite,
    canvas,
    ctx,
    boundary,
    Monster
} from "./classes.js";

import {
    monsters,
    embyImg,
    draggleImg
} from "./monsters.js";
import { animate, war } from "./index.js";
import attacks from "./Attacks.js";
import sound from "./audio.js";

// Create War Background Image
const warBackgroundImage = new Image(1100, 560);
warBackgroundImage.src = './images/battleBackground.png';
const warBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: warBackgroundImage
})

let draggle;
let emby;
let renderedSprites;
let warAnimationId;
let queue;

function initWar() {
    document.querySelector('.container .userInterface').style.display = 'block';
    document.querySelector('.container .userInterface2').style.display = 'block';
    document.querySelector('.container .userInterface3').style.display = 'flex';
    document.querySelector('.dialogue').style.display = 'none';
    document.querySelector('#enemyHealthBar').style.width = '100%';
    document.querySelector('#playerHealth').style.width = '100%';
    document.querySelector('#attackButton').replaceChildren()

    draggle = new Monster(monsters.Draggle);
    emby = new Monster(monsters.Emby);
    renderedSprites = [draggle, emby];
    queue = [];

    emby.attacks.forEach((attack) => {
        const button = document.createElement('button');
        button.innerHTML = attack.name;

        const attackButton = document.querySelector('#attackButton');
        attackButton.append(button)
    })

    // event for our buttons (attack)
    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML];
            emby.attack({
                attack: selectedAttack,
                recipient: draggle,
                renderedSprites
            })

            if (draggle.health <= 0) {
                queue.push(() => {
                    draggle.faint()
                })
                queue.push(() => {
                    // fade back to black
                    gsap.to('.pageBlack', {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(warAnimationId)
                            animate()
                            document.querySelector('.container .userInterface').style.display = 'none';
                            document.querySelector('.container .userInterface2').style.display = 'none';
                            document.querySelector('.container .userInterface3').style.display = 'none';
                            gsap.to('.container>.pageBlack', {
                                opacity: 0
                            })
                            war.initiated = false;
                            sound.Map.play()
                        }
                    })
                })
            }

            // draggle or enemy attacks
            const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];

            queue.push(() => {
                draggle.attack({
                    attack: randomAttack,
                    recipient: emby,
                    renderedSprites
                })
            })

            if (emby.health <= 0) {
                queue.push(() => {
                    emby.faint()
                })
                queue.push(() => {
                    // fade back to black
                    gsap.to('.pageBlack', {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(warAnimationId)
                            animate()
                            document.querySelector('.container .userInterface').style.display = 'none';
                            document.querySelector('.container .userInterface2').style.display = 'none';
                            document.querySelector('.container .userInterface3').style.display = 'none';
                            gsap.to('.container>.pageBlack', {
                                opacity: 0
                            })

                            war.initiated = false;
                            sound.Map.play()
                        }
                    })
                })
            }

        })
        button.addEventListener('mouseenter', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML];
            document.querySelector('#attackType').innerHTML = selectedAttack.type;
            document.querySelector('#attackType').style.color = selectedAttack.color;
        })
    })
}

function animateWar() {
    warAnimationId = requestAnimationFrame(animateWar);
    warBackground.draw()
    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}

// animate()
initWar()
animateWar()

const dialoguePage = document.querySelector('.dialogue')
dialoguePage.addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else {
        e.currentTarget.style.display = 'none'
    }
})

export {
    warBackgroundImage,
    warBackground,
    draggleImg,
    draggle,
    embyImg,
    emby,
    renderedSprites,
    animateWar,
    initWar
}