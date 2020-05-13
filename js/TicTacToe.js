'use strict;'
class TicTacToe {
    /**
     * 
     * @param {string} playerName 
     * @param {HTMLTableElement} table 
     * @param {HTMLElement} infoContainer 
     * @param {HTMLElement} scoreContainer 
     * @param {HTMLElement} historyContainer 
     */
    constructor(playerName, table, infoContainer, scoreContainer, historyContainer) {
        this.playerName = playerName;
        this.table = table;
        this.field = new Field(table);

        this.infoContainer = infoContainer;
        this.scoreContainer = scoreContainer;
        this.historyContainer = historyContainer;
        
        this.bot = new BotAlgorithm3x3(this.field);

        this.numberGame = 1;
        this.scorePlayer = 0;
        this.scoreBot = 0;
        
        this.firstPlayer = 'user';
        this.currentPlayer = this.firstPlayer;
        
        this.scoreContainer.innerHTML = '0 - 0';
        this.table.addEventListener('click', this.clickPlayer.bind(this));
        this.prepare();
    }

    /**
     * Подготовка игры
     */
    prepare() {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.field.clear();
        this.field.prepare();
        this.field.draw();

        this.currentPlayer = this.firstPlayer;
        this.prepareFirstPlayer();
    }

    /**
     * Подготовка хода первого игрока
     */
    prepareFirstPlayer() {
        if(this.currentPlayer == 'user') {
            this.prepareStepPlayer();
        }

        if(this.currentPlayer == 'bot') {
            this.prepareStepBot();
        }
    }

    /**
     * Подготовка хода игрока
     */
    prepareStepPlayer() {
        this.infoContainer.innerHTML = `${this.playerName}, время вашего хода`;
        this.currentPlayer = 'user';
    }

    /**
     * Подготовка хода бота
     */
    prepareStepBot() {
        this.infoContainer.innerHTML = 'Ходит соперник...';
        this.currentPlayer = 'bot';

        this.timer = setTimeout(this.stepBot.bind(this), 2000)
    }

    /**
     * Обработчик события нажатия на поле
     * @param {MouseEvent} event 
     */
    clickPlayer(event) {
        const fieldCell = event.target;
        const cell = fieldCell.parentElement;

        if (cell.tagName.toLowerCase() != 'td') {
            return false;
        }

        const y = cell.parentNode.rowIndex;
        const x = cell.cellIndex;

        this.stepPlayer(x, y);
    }
    
    /**
     * Ход игрока
     * @param {number} x 
     * @param {number} y 
     */
    stepPlayer(x, y) {
        if (this.currentPlayer == 'user') {
            if (this.field.mark(x, y)) {
                this.endStep(); 
            }
        }
    }

    /**
     * Ход бота
     */
    stepBot(){
        if (this.currentPlayer == 'bot') {
            const step = this.bot.getStep();

            if(step){
                this.field.mark(step.x, step.y, false);
                this.endStep();              
            }
        }
    }

    /**
     * Окончание хода
     */
    endStep() {
        //если был победный ход
        if(this.field.markWin(this.currentPlayer === 'user')){
            this.numberGame++;
            this.endRound();
            return;
        }

        if(this.field.isFull()){
            this.numberGame++;
            this.endRound(true);
            return;
        }

        this.field.draw(this.firstPlayer === 'user');
        switch(this.currentPlayer) {
            case 'user':
                this.prepareStepBot();
                break;
            case 'bot':
                this.prepareStepPlayer();
                break;
        }
    }


    /**
     * Завершение раунда
     * @param {boolean} isDraw - завершилась ли игра вничью
     */
    endRound(isDraw = false){
        //по логике игры 1-й игрок - пользователь, 2-й игрок - бот
        this.field.draw(this.firstPlayer == 'user');

        let result = 'draw';
        if(!isDraw) {
            if(this.currentPlayer == 'user'){
                this.scorePlayer++;
                this.firstPlayer = 'user';
                result = 'user';
            }
    
            if(this.currentPlayer == 'bot'){
                this.scoreBot++;
                this.firstPlayer = 'bot';
                result = 'bot';
            }
        }   

        this.showResult(result);

        this.currentPlayer = 'none';
        this.scoreContainer.innerHTML = `${this.scorePlayer} - ${this.scoreBot}`;
    }

    /**
     * Вывод результата раунда
     * @param {string} result 
     */
    showResult(result){
        let elem = document.createElement('div');
        elem.className = 'game__result';
        
        let resultText = '';
        switch(result) {
            case 'user':
                resultText = 'Победа';
                this.infoContainer.innerHTML = 'Вы победили!';
                break;
            case 'bot':
                resultText = 'Поражение';
                this.infoContainer.innerHTML = 'Вы проиграли';
                break;   
            case 'draw':
                resultText = 'Ничья';
                this.infoContainer.innerHTML = 'Ничья!';
                break; 
        }

        elem.innerHTML = `${this.numberGame - 1}. ${resultText} ${this.scorePlayer} - ${this.scoreBot}`;
        this.historyContainer.append(elem);
    }
}