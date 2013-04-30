var redis = require("redis").createClient(),
    id = require("../helpers/id.js")(),
    Game = require("../models/game.js"),
    GameController;

var GameController = function (io) {
    if (!(this instanceof GameController)) {
        var result = new GameController(io);
        return result;
    }

    this.create = function (req, res) {
        var game = new Game();

        // create a new id
        var gameID = game.id(),
            namespace;

        // create the namespace
        namespace = io.of("/games/"+gameID);

        // set up the connection behavior for clients
        namespace.on("connection", function (socket) {
            if (game.status() === "open") {
                game.status("waiting");
                game.save(function (err, response) {
                    namespace.emit("status", { "status":"waiting" });
                });
            } else if (game.status() === "waiting") {
                game.status("playing");
                game.save(function (err, response) {
                    namespace.emit("status", { "status":"playing" });
                });
            } else if (game.status() === "playing") {
                // send this only to the connecting client
                socket.emit("status", { "status":"viewable" });
            }
        });

        game.save(function (err, response) { 
            res.json({ "gameID":game.id() });
        });
    };

    this.show = function (req, res) {
        var game;

        game = Game.find({"gameID":req.params.id}, function (err, game) {
            if (err !== null) {
                res.send("Internal Server Error", 500);
            } else if (game === null) {
                res.send("Game Not Found", 404);
            } else {
                if (req.params.format === "json") {
                    res.json(game.toJSON());
                } else {
                    res.sendfile("public/game.html");
                }
            }
        });
    };

    // this needs to be authenticated in some way
    this.update = function (req, res) {
        console.log("HEY PUT");
        Game.find({"gameID":req.params.id}, function (err, game) {
            if (err !== null) {
                res.send("Internal Server Error", 500);
            } else if (game === null){
                res.send("Game Not Found", 404);
            } else {
                if (game.board()[req.body.cell] !== "_") {
                    throw new Error("cell was already set!");
                } else {
                    if (game.status() === "playing") {
                        game.applyMove(req.body.symbol, Math.floor(req.body.cell/3), req.body.cell%3);
                        
                        game.save(function (err, result) {
                            var namespace = io.of("/games/"+game.id());
                            if (err !== null) {
                                res.send(500);
                            } else {
                                namespace.emit("move", {"cell":req.body.cell, "symbol":req.body.symbol});
                                if (game.status().indexOf("Wins") > -1) {
                                    namespace.emit("status", {"status":game.status()});
                                }
                                res.send("OK", 200);
                            }
                        });
                    }
                }
            }
        });
    };

    this.destroy = function (req, res) {
        // delete this game
        res.send(200);
    };
};

module.exports = GameController;
