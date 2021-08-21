window.addEventListener('load', (event) => {
    const game = new Game('container');
    document.addEventListener('click', () => {
        game.restart();
    })
});


