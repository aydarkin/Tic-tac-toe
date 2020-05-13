'use strict';
/**
 * Тактика работы бота на поле размером 3x3
 */
class BotAlgorithm3x3 {
    /**
     * 
     * @param {Field} field 
     */
    constructor(field){
        this.field = field;

        this.playerMarker = field.firstMarker;
        this.botMarker = field.secondMarker;
        this.emptyMarker = field.emptyMarker;
    }

    /**
     * Получить шаг
     */
    getStep(){
        let step;
        if(step = this.getWinStep(this.botMarker) || this.getWinStep(this.playerMarker)){
            return step;
        }

        return this.getRandomStep();
    }

    /**
     * Возвращает ячейку, которая может завершить победную комбинацию обладателя маркера
     * @param {string} marker
     */
    getWinStep(marker){
        let step;
        if(step = this.getWinStepHorizontal(marker)){
            return step;
        }

        if(step = this.getWinStepVertical(marker)){
            return step;
        }

        if(step = this.getWinStepDiagonal(marker)){
            return step;
        }

        return false;
    }

    /**
     * Возвращает победную ячейку по горизонтали
     * @param {string} marker
     */
    getWinStepHorizontal(marker){
        let countMarkers;
        let countEmpty;

        let y;
        let x;

        for (let i = 0; i < 3; i++) {
            countMarkers = countEmpty = 0;

            for (let j = 0; j < 3; j++) {
                if ((this.field.model[i][j] === marker)) {
                    countMarkers++;
                }

                if ((this.field.model[i][j] === this.emptyMarker)) {
                    countEmpty++;
                    y = i;
                    x = j;
                }
            }
            if((countMarkers == 2) && (countEmpty == 1)){
                return {y: y, x: x};
            }
        }
        return false;

    }

    /**
     * Возвращает победную ячейку по вертикали
     * @param {string} marker
     */
    getWinStepVertical(marker){
        let countMarkers;
        let countEmpty;

        let y;
        let x;

        for (let j = 0; j < 3; j++) {
            countMarkers = countEmpty = 0;
            for (let i = 0; i < 3; i++) {
                if ((this.field.model[i][j] === marker)) {
                    countMarkers++;
                }

                if ((this.field.model[i][j] === this.emptyMarker)) {
                    countEmpty++;
                    y = i;
                    x = j;
                }
            }
            if((countMarkers == 2) && (countEmpty == 1)){
                return {y: y, x: x};
            }
        }
        return false;

    }

    /**
     * Возвращает победную ячейку по диагоналям
     * @param {string} marker
     */
    getWinStepDiagonal(marker){
        let step;
        if(step = this.getWinStepMajorDiagonal(marker)){
            return step;
        }

        if(step = this.getWinStepMinorDiagonal(marker)){
            return step;
        }

        return false;
    }
    
    /**
     * Возвращает победную ячейку по главной диагонали
     * @param {string} marker
     */
    getWinStepMajorDiagonal(marker) {
        let countMarkers;
        let countEmpty;
        let y;
        let x;

        countMarkers = countEmpty = 0;
        for (let i = 0; i < 3; i++) {
            if ((this.field.model[i][i] === marker)) {
                countMarkers++;
            }

            if ((this.field.model[i][i] === this.emptyMarker)) {
                countEmpty++;
                y = i;
                x = i;
            }
            if((countMarkers == 2) && (countEmpty == 1)){
                return {y: y, x: x};
            }
        }
    }

    /**
     * Возвращает победную ячейку по побочной диагонали
     * @param {string} marker
     */
    getWinStepMinorDiagonal(marker) {
        let countMarkers;
        let countEmpty;
        let y;
        let x;

        countMarkers = countEmpty = 0;
        for (let i = 0; i < 3; i++) {
            if ((this.field.model[i][2 - i] === marker)) {
                countMarkers++;
            }

            if ((this.field.model[i][2 - i] === this.emptyMarker)) {
                countEmpty++;
                y = i;
                x = 2 - i;
            }
            if((countMarkers == 2) && (countEmpty == 1)){
                return {y: y, x: x};
            }
        }
    }

    /**
     * Возвращает рандомный ход
     */
    getRandomStep(){
        let y, x;
        do {
            y = Math.trunc(Math.random() * 10) % 3;
            x = Math.trunc(Math.random() * 10) % 3;
        } while (this.field.model[y][x] !== this.emptyMarker);

        return {y: y, x: x};
    }

}