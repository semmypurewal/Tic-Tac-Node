var redis = require("redis").createClient(),
    id = require("../helpers/id.js")(),
    Game;

Game = function (attrs) {
    var status = "open",
        gameID = id.next(),
        board = ["_", "_", "_", "_", "_", "_", "_", "_", "_"];
    
    if (!(this instanceof Game)) {
        var result = new Game(attrs);
        return result;
    }

    if (attrs !== undefined) {
        if (attrs.gameID !== undefined) {
            gameID = attrs.gameID;
        }
        if (attrs.status !== undefined) {
            status = attrs.status;
        }
        if (attrs.board !== undefined) {
            board = attrs.board;
        }
    }

    this.toJSON = function () {
        return {
            "gameID":this.id(),
            "status":this.status(),
            "board":this.board()
        }
    };

    this.applyMove = function (sym, row, col) {
        if (row < 0 || row > 2 || col < 0 || col > 0) {
            throw new RangeError("row and col must be between 0 and 2 inclusive");
        } else if (sym !== "X" && sym !== "O") {
            throw new TypeError("sym must be X or O");
        } else {
            board[row*3+col] = sym;
        }
    };

    this.board = function () {
        return board;
    };

    this.status = function (newStatus) {
        if (newStatus === undefined) {
            return status;
        } else {
            status = newStatus;
            return this;
        }
    };

    this.id = function () {
        return gameID;
    };

    this.save = function (callback) {
        var jsonObj = {};
        jsonObj.gameID = this.id();
        jsonObj.status = this.status();
        jsonObj.board = this.board();
        redis.set("game:"+jsonObj.gameID, JSON.stringify(jsonObj), callback);
    };
};

Game.find = function (query, callback) {
    redis.get("game:"+query.gameID, function (err, game) {
        if (game !== null) {
            var attrs = JSON.parse(game);
            var game = new Game(attrs);
        }
        callback(err, game);
    });
};

module.exports = Game;
