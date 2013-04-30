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
                res.sendfile("public/game.html");
            }
        });
    };

    // this needs to be authenticated in some way
    this.update = function (req, res) {
        console.log(req.body.cell);
        Game.find({"gameID":req.params.id}, function (err, game) {
            if (err !== null) {
                res.send("Internal Server Error", 500);
            } else if (game === null){
                res.send("Game Not Found", 404);
            } else {
                res.send("OK", 200);
            }
        });
    };

    this.destroy = function (req, res) {
        // delete this game
        res.send(200);
    };
};

module.exports = GameController;
