//Copyright (c) 2022 Charly Schmidt - MIT License

import * as game from "./game.js";

let currentGame;

//when the DOM is ready, initialize the game
window.addEventListener("load", () => {
    currentGame = new game.Game();
});