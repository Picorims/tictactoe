//Copyright (c) 2022 Charly Schmidt - MIT License

import * as player from "./player.js";

let canvas;
const GAME_DURATION_SECONDS = 180;

/**
 * Handles a complete game session with multiple plays.
 *
 * @export
 * @class Game
 */
export class Game {

    /**
     * Creates an instance of Game. The game is
     * automatically setup on creation.
     * The same Game instance handles multiple
     * plays.
     * @memberof Game
     */
    constructor() {
        this._canvas = document.getElementById("canvas");
        this._timerElt = document.getElementById("timer");
        this._player1Title = document.getElementById("player1-title");
        this._player2Title = document.getElementById("player2-title");
        this._timeInterval;
        this._timeLeft;
        this._player1 = new player.Player(1);
        this._player2 = new player.Player(2);
        this._player1Turn;
        this._grid;

        //Setup click event handling on the canvas
        this._canvas.addEventListener("click", (e) => {
            this._canvasClick(e);
        });

        //new game initialization
        this._init();
    }

    /**
     * Initialize a new game. It resets the grid,
     * but not the players' score.
     *
     * @memberof Game
     */
    _init() {
        this._timeLeft = GAME_DURATION_SECONDS;
        this._player1.reset();
        this._player2.reset();
        this._player1Turn = false;
        this._newTurn();
        
        /**
         * Represents each cell.
         * 0 means the cell is empty.
         * Otherwise it contains the player's id.
         * This is used as following: [X][Y]
         */
        this._grid = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];

        this._draw();
        //this is not the most accurate way,
        //but is enough for our use case.
        this._timeInterval = setInterval(() => {
            this._updateTimer();
        }, 1000);
    }

    /**
     * Trigger a new turn, switch player
     *
     * @memberof Game
     */
    _newTurn() {
        //switch player turn
        this._player1Turn = !this._player1Turn;

        if (this._player1Turn) {
            this._player1Title.classList.add("show-arrow");
            this._player2Title.classList.remove("show-arrow");
        } else {
            this._player1Title.classList.remove("show-arrow");
            this._player2Title.classList.add("show-arrow");

        }
    }

    /**
     * Check if a player won the game.
     * Returns 0 if nobody won, or the id
     * of the player if one did.
     *
     * @memberof Game
     * @returns {Number}
     */
    _checkIfPlayerWon() {
        let winner = 0;
        let grid = this._grid;        
        //there may be a better implementation, but I haven't much time to think
        //about it.

        //check lines
        for (let x = 0; x < this._grid.length; x++) {
            let line = this._grid[x];
            if (line[0] === line[1] && line[0] === line[2] && line[0] !== 0) {
                winner = line[0];
                break;
            }
        }

        //check columns
        if (winner === 0) {
            for (let x = 0; x < grid.length; x++) {
                if (grid[x][0] === grid[x][1] && grid[x][0] === grid[x][2] && grid[x][0] !== 0) {
                    winner = grid[x][0];
                    break;
                }
            }
        }

        //check diagonals
        if (winner === 0 && grid[0][0] === grid[1][1] && grid[2][2] && grid[0][0] !== 0) winner = grid[0][0];
        if (winner === 0 && grid[2][0] === grid[1][1] && grid[0][2] && grid[0][0] !== 0) winner = grid[0][0];
        
        return winner;
    }

    /**
     * Finishes the game, find the winner and display the results
     *
     * @param {Number} winner equals 0 if draw, or the winner's id otherwise.
     * @memberof Game
     */
    _endGame(winner) {
        if (winner === this._player1.id) this._player1.win();
        else this._player2.win();
        alert(`Winner: Player ${winner} - ${this._player1.score}/${this._player2.score}`);
        this._init();
    }
    







    /**
     * Called every second to keep track of the current
     * time left. If it reaches zero, the game ends.
     *
     * @memberof Game
     */
    _updateTimer() {
        this._timeLeft--;
        if (this._timeLeft === 0) this._endGame();

        //display
        this._displayTime();
    }

    /**
     * Updates the timer on screen
     *
     * @memberof Game
     */
    _displayTime() {
        let minutes = Math.floor(this._timeLeft/60);
        let seconds = this._timeLeft % 60;

        let minutesStr = (minutes < 10) ? "0" + minutes : minutes;
        let secondsStr = (seconds < 10) ? "0" + seconds : seconds;

        this._timerElt.innerHTML = `${minutesStr}:${secondsStr}`;
    }






    /**
     * Handles the click on a canvas
     * with appropriate player action
     *
     * @param {MouseEvent} event
     * @memberof Game
     */
    _canvasClick(event) {
        //get clicked cell
        let gridX = Math.floor(event.offsetX/this._canvas.width * 3);
        let gridY = Math.floor(event.offsetY/this._canvas.height * 3);

        console.log(`Clicked on cell ${gridX} ${gridY}`);
        
        //handle action
        if (this._grid[gridX][gridY] !== 0) alert("Cell already taken!");
        else {
            this._grid[gridX][gridY] = (this._player1Turn)? this._player1.id : this._player2.id;
            this._draw();
        }

        let winner = this._checkIfPlayerWon();
        if (winner > 0) this._endGame(winner);
        else this._newTurn();
    }

    /**
     * Draw the current state of the game on screen
     *
     * @memberof Game
     */
    _draw() {
        let canvas = this._canvas;
        let ctx = canvas.getContext("2d");
        ctx.lineWidth = 5;

        //clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        //Draw the borders

        //vertical left
        ctx.moveTo(Math.floor(canvas.width/3), 0);
        ctx.lineTo(Math.floor(canvas.width/3), canvas.height);

        //vertical right
        ctx.moveTo(Math.floor(2*canvas.width/3), 0);
        ctx.lineTo(Math.floor(2*canvas.width/3), canvas.height);

        //horizontal top
        ctx.moveTo(0, Math.floor(canvas.width/3));
        ctx.lineTo(canvas.width, Math.floor(canvas.width/3));

        //horizontal bottom
        ctx.moveTo(0, Math.floor(2*canvas.width/3));
        ctx.lineTo(canvas.width, Math.floor(2*canvas.width/3));

        ctx.stroke();


        //draw the cells
        const PADDING = 10;
        const CELL_SIZE = canvas.width/3;
        const SHAPE_SIZE = Math.floor(canvas.width/3 - 2 * PADDING);
        //for each line
        for (let x = 0; x < this._grid.length; x++) {
            //for each column
            for (let y = 0; y < this._grid[x].length; y++) {
                let cell = this._grid[x][y];
                
                //if the cell is not empty
                if (cell > 0) {
                    //get the top left corner of the cell in
                    //canvas coordinates
                    let canvasX = Math.floor(CELL_SIZE * x);
                    let canvasY = Math.floor(CELL_SIZE * y);

                    let shapeX = canvasX + PADDING;
                    let shapeY = canvasY + PADDING;

                    //Draw the shape
                    if (cell === this._player1.id) { //ellipse
                        let ellipseX = shapeX + SHAPE_SIZE/2;
                        let ellipseY = shapeY + SHAPE_SIZE/2;
                        let radius = SHAPE_SIZE/2;
                        ctx.moveTo(ellipseX + radius, ellipseY); //fixes display bug
                        ctx.ellipse(ellipseX, ellipseY, radius, radius, 0, 0, 2*Math.PI);
                    
                    } else if (cell === this._player2.id) { //cross
                        this._drawCross(ctx, shapeX, shapeY, SHAPE_SIZE, SHAPE_SIZE);
                    
                    } else {
                        throw new Error("Unknown cell id: " + cell);
                    }

                    //display
                    ctx.stroke();
                }
            }
        }
    }

    /**
     * Draw a cross at the specified location
     *
     * @param {*} context
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @memberof Game
     */
    _drawCross(ctx, x, y, width, height) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y + height);
        ctx.moveTo(x + width, y);
        ctx.lineTo(x, y + height);
    }
}