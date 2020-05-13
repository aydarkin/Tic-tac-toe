window.onload = () => {
    const form = document.querySelector('.register');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const gameContainer = document.querySelector('.game');
        gameContainer.className = 'game game_process';
        
        const input = document.querySelector('.register__input_text');
        const gameTable = document.querySelector('.field');
        const info = document.querySelector('.game__status');
        const score = document.querySelector('.game__score');
        const history = document.querySelector('.game__history');
    
        const game = new TicTacToe(input.value, gameTable, info, score, history);

        const restartBtn = document.querySelector('.game__restart');
        restartBtn.addEventListener('click', (event) => {
            event.preventDefault();

            game.prepare();
        })

    })    
}