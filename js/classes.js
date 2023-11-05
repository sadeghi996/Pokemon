import sound from "./audio.js";

// variables data
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
    constructor({
        position,
        image,
        frames = {
            max: 1,
            hold: 10
        },
        sprites,
        animate = false,
        rotation = 0
    }) {
        this.position = position
        this.image = new Image()
        this.frames = {
            ...frames,
            val: 0,
            elapsed: 0
        }
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.image.src = image.src
        this.animate = animate
        this.sprites = sprites
        this.opacity = 1
        this.rotation = rotation
    }

    draw() {
        ctx.save()
        ctx.translate(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        )
        ctx.rotate(this.rotation)
        ctx.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2)
        ctx.globalAlpha = this.opacity
        ctx.drawImage(this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        );
        ctx.restore()

        if (!this.animate) return

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }
        if (this.frames.elapsed % this.frames.hold === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
                else this.frames.val = 0;

        }
    }
}

// Monster();

class Monster extends Sprite {
    constructor({
        position,
        image,
        frames = {
            max: 1,
            hold: 10
        },
        sprites,
        animate = false,
        rotation = 0,
        isEnemy = false,
        name,
        attacks
    }) {
        super({
            position,
            image,
            frames,
            sprites,
            animate,
            rotation,
        })
        this.health = 100
        this.isEnemy = isEnemy
        this.name = name
        this.attacks = attacks
    }

    faint() {
        document.querySelector('.dialogue').innerHTML = this.name + ' fainted! ';
        gsap.to(this.position, {
            y: this.position.y + 20
        })
        gsap.to(this, {
            opacity: 0
        })
        sound.War.stop()
        sound.victory.play()
    }

    attack({
        attack,
        recipient,
        renderedSprites
    }) {
        const dialogue = document.querySelector('.dialogue');
        dialogue.style.display = "block";
        dialogue.innerHTML = this.name + ' used ' + attack.name;

        let moveDis = 20;
        if (this.isEnemy) moveDis = -20;

        let healthBar = '#enemyHealthBar';
        if (this.isEnemy) healthBar = '#playerHealth';

        let rotation = 1
        if (this.isEnemy) rotation = -2.2

        recipient.health -= attack.damage

        if (attack.name == 'Fireball') {
            sound.initFireball.play()
            const fireballImage = new Image();
            fireballImage.src = './images/fireball.png';


            const fireball = new Sprite({
                position: {
                    x: this.position.x,
                    y: this.position.y
                },
                image: fireballImage,
                frames: {
                    max: 4,
                    hold: 10
                },
                animate: true,
                rotation
            })
            renderedSprites.splice(1, 0, fireball)
            gsap.to(fireball.position, {
                x: recipient.position.x,
                y: recipient.position.y,
                onComplete: () => {
                    sound.fireballHit.play()
                    gsap.to(healthBar, {
                        width: recipient.health + '%'
                    })
                    gsap.to(recipient.position, {
                        x: recipient.position.x + 10,
                        yoyo: true,
                        repeat: 5,
                        duration: 0.08
                    })
                    gsap.to(recipient, {
                        opacity: 0,
                        repeat: 5,
                        yoyo: true,
                        duration: 0.08
                    })
                    renderedSprites.splice(1, 1)
                }
            })
        } else
        if (attack.name == 'Tackle') {
            const tl = gsap.timeline()

            tl.to(this.position, {
                x: this.position.x - moveDis
            }).to(this.position, {
                x: this.position.x + moveDis * 2,
                duration: 0.1,
                onComplete: () => {
                    // Enemy actually gets hit
                    sound.tackleHit.play()
                    gsap.to(healthBar, {
                        width: recipient.health + '%'
                    })
                    gsap.to(recipient.position, {
                        x: recipient.position.x + 10,
                        yoyo: true,
                        repeat: 5,
                        duration: 0.08
                    })
                    gsap.to(recipient, {
                        opacity: 0,
                        repeat: 5,
                        yoyo: true,
                        duration: 0.08
                    })
                }
            }).to(this.position, {
                x: this.position.x
            })
        }
    }
}

// boundary();
class boundary {
    static with = 36
    static height = 36
    constructor({
        position
    }) {
        this.position = position
        this.width = 36
        this.height = 36
    }

    draw() {
        ctx.fillStyle = 'rgba(255,0,0,0)'
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }
}

export {
    Sprite,
    canvas,
    ctx,
    boundary,
    Monster
}