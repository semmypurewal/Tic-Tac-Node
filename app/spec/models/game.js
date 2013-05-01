var Game = require("../../models/game.js"),
    assert = require("assert");

describe("Game", function () {
    describe("#toJSON", function () {
        it("should return a JSON object with the correct attributes", function () {
            var g = Game({"gameID":"abc", "status":"open", "board":["_"]}),
                jsonObj = g.toJSON();
            console.log(jsonObj);
            assert(jsonObj.gameID === "abc");
            assert(jsonObj.status === "open");
            assert(jsonObj.board.length === 1 && jsonObj.board[0] === "_");
        });
    });
});
