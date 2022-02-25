//Copyright (c) 2022 Charly Schmidt - MIT License

/**
 * Holds all player data
 *
 * @export
 * @class Player
 */
export class Player {
    constructor(id) {
        if (typeof id !== "number") throw new SyntaxError("Expected integer on id");
        if (id <= 0) throw new SyntaxError("id must be strictly positive");
        this._id = id;
        this._score = 0;
    }

    get id() {return this._id}
    get score() {return this._score}

    /**
     * Makes player win the game
     *
     * @memberof Player
     */
    win() {
        this._score++;
    }

    /**
     * Resets player data
     *
     * @memberof Player
     */
    reset() {

    }
}