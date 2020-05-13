'use strict';
/**
 * Состояния поля:
 * 0 - пусто
 * 1 - отметка первого игрока
 * 2 - отметка второго игрока
 * 3 - отметка победной линии первого игрока
 * 4 - отметка победной линии второго игрока
 */
class Field {
    /**
     * 
     * @param {HTMLTableElement} table - контейнер для визуализации
     */
    constructor(table) {
        this.size = 3;

        this.emptyMarker = 0;
        this.firstMarker = 1;
        this.secondMarker = 2;
        this.firstWinMarker = 3;
        this.secondWinMarker = 4;

        this.table = table;

        this.model = new Array(this.size);
        for (let i = 0; i < this.model.length; i++) {
            this.model[i] = new Array(this.size);
        }

        this.clear();
    }

    clear() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.model[i][j] = this.emptyMarker;
            }       
        }
    }

    /**
     * Подготовка отображения поля перед игрой
     */
    prepare() {
        let html = '<tbody>';
        for (let i = 0; i < this.size; i++) {
            html += '<tr>';
            for (let j = 0; j < this.size; j++) {
                html += `<td>${this.renderCell()}</td>`;
            }
            html += '</tr>'  ;     
        }
        html += '</tbody>';
        this.table.innerHTML = html;
    }

    /**
     * Отметка на поле
     * @param {number} x 
     * @param {number} y 
     * @param {boolean} isFirstPlayer 
     */
    mark(x, y, isFirstPlayer = true) {
        if(this.model[y][x] === 0) {
            const marker = isFirstPlayer ? this.firstMarker : this.secondMarker;
            this.model[y][x] = marker;
            return true;
        }
        return false;
    }

    /**
     * Полная отрисовка поля
     */
    draw(isPlayerFirst = true){
        const markerFirstPlayer = isPlayerFirst ? 'X' : 'O';
        const markerSecondPlayer = isPlayerFirst ? 'O' : 'X';

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                let cell;
                switch (this.model[i][j]) {
                    case this.firstMarker:
                        cell = this.renderCell(markerFirstPlayer);
                        break;
                    case this.secondMarker:
                        cell = this.renderCell(markerSecondPlayer);
                        break;
                    case this.firstWinMarker:
                        cell = this.renderCell(markerFirstPlayer, true);
                        break;
                    case this.secondWinMarker:
                        cell = this.renderCell(markerSecondPlayer, true);
                        break;
                    default:
                        cell = this.renderCell();
                        break;
                }
                this.table.rows[i].cells[j].innerHTML = cell;
            }           
        }
    }

    renderCell(marker = '', isWinner = false) {
        return `<div class="field__cell ${isWinner ? 'field__cell_win' : ''}">${marker}</div>`;
    }

    /**
     * Проверка и отрисовка победы
     * @returns {boolean}
     */
    markWin(isFirstPlayer = true){
        let result = this.isWinHorizontal();
        if(result){
            this.markWinHorizontal(result.row, isFirstPlayer);
            return true;
        }

        result = this.isWinVertical();
        if(result){
            this.markWinVertical(result.column, isFirstPlayer);
            return true;
        }

        result = this.isWinDiagonal();
        if(result){
            this.markWinDiagonal(result.diagonal, isFirstPlayer)
            return true;
        }

        return false;
    }

    /**
     * Проверка заполненности строк 
     * @returns {Object|null}
     */
    isWinHorizontal(){
        for (let i = 0; i < 3; i++) {
            if((this.model[i][0] === this.model[i][1]) && (this.model[i][0] !== this.emptyMarker)){
                if(this.model[i][0] === this.model[i][2]){
                    return { row: i};
                }
            }    
        }
        return null;
    }

    /**
     * Проверка заполнен ли столбец одинаковыми символами
     * @returns {Object|null}
     */
    isWinVertical(){
        for (let j = 0; j < 3; j++) {
            if( (this.model[0][j] === this.model[1][j]) && (this.model[0][j] !== this.emptyMarker)){
                if(this.model[0][j] === this.model[2][j]){
                    return { column: j};
                }
            }    
        }
        return null;
    }

    /**
     * Проверка заполнена ли диагональ одинаковыми символами
     * @returns {Object|null}
     */
    isWinDiagonal(){
        if((this.model[0][0] === this.model[1][1]) && (this.model[0][0] === this.model[2][2]) && (this.model[0][0] !== this.emptyMarker)){
            return { diagonal: 'major' }; //главная диагональ
        }

        if((this.model[0][2] === this.model[1][1]) && (this.model[0][2] === this.model[2][0]) && (this.model[0][2] !== this.emptyMarker)){
            return { diagonal: 'minor' }; //побочная диагональ
        }

        return null;
    }

    /**
     * Отрисовка победной строки
     * @param {number} row 
     * @param {boolean} isFirstPlayer 
     */
    markWinHorizontal(row, isFirstPlayer = true){
        const marker = isFirstPlayer ? this.firstWinMarker : this.secondWinMarker;
        for (let j = 0; j < this.size; j++) {
            this.model[row][j] = marker;
        }
    }

    /**
     * Отрисовка победного столбца
     * @param {number} column
     * @param {boolean} isFirstPlayer 
     */
    markWinVertical(column, isFirstPlayer = true){
        const marker = isFirstPlayer ? this.firstWinMarker : this.secondWinMarker;
        for (let i = 0; i < this.size; i++) {
            this.model[i][column] = marker;
        }
    }

    /**
     * Отрисовка победной диагонали
     * @param {string} diagonal 
     * @param {boolean} isFirstPlayer 
     */
    markWinDiagonal(diagonal, isFirstPlayer = true){
        const marker = isFirstPlayer ? this.firstWinMarker : this.secondWinMarker;
        if(diagonal === 'major') {
            for (let i = 0; i < this.size; i++) {
                this.model[i][i] = marker;
            }
        }

        if(diagonal === 'minor') {
            for (let i = 0; i < this.size; i++) {
                this.model[i][this.size - i - 1] = marker;
            }
        }
    }

    /**
     * Пусто ли поле
     * @returns {boolean}
     */
    isEmpty(){
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if(this.model[i][j] !== this.emptyMarker){
                    return false;
                }  
            }
        }
        return true;
    }

    /**
     * Заполнено ли поле полностью 
     * @returns {boolean}
     */
    isFull(){
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if(this.model[i][j] === this.emptyMarker){
                    return false;
                }  
            }
        }
        return true;
    }

    /**
     * Есть ли хотя бы 1 элемент
     * @returns {boolean}
     */
    hasElement(){
        return !this.isEmpty();
    }
}