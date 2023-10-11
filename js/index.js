const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Creat background-image in the canvas
const image = new Image();
image.src = './images/mapGamePokemon.png';

//Creat image player
const imagePlayer = new Image();
imagePlayer.src = './images/playerDown.png';

// onload images
image.onload = () => {
    ctx.drawImage(image, -150, -300);
    ctx.drawImage(
        imagePlayer,
        0,
        0,
        imagePlayer.width / 4,
        imagePlayer.height,
        canvas.width / 2 - (imagePlayer.width / 6) / 6,
        canvas.height / 2 - imagePlayer.height / 2,
        imagePlayer.width / 4,
        imagePlayer.height,
    );
}