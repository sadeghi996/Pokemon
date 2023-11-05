import attacks from "./Attacks.js";

const embyImg = new Image();
embyImg.src = './images/embySprite.png';

const draggleImg = new Image();
draggleImg.src = './images/draggleSprite.png';

const monsters = {
    Emby: {
        position: {
            x: 300,
            y: 350
        },
        image: embyImg,
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        name: 'Emby',
        attacks: [attacks.Tackle, attacks.Fireball]
    },
    Draggle: {
        position: {
            x: 850,
            y: 100
        },
        image: draggleImg,
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        isEnemy: true,
        name: 'Draggle',
        attacks: [attacks.Tackle, attacks.Fireball]
    }
}
export {
    monsters,
    embyImg,
    draggleImg
}