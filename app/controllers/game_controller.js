var redis = require("redis").createClient()
    id = require("../helpers/id.js")(),
    GameController;

var GameController = function (io) {
    if (!(this instanceof GameController)) {
        var result = new GameController(io);
        return result;
    }

    this.create = function (req, res) {
        // if there's an open game, let this
        // user join the game, else
        // create the namespace for the game
        // and set to waiting mode

        // create a new id
        var gameID = id.next(), 
            response = { "game": gameID };

        // put the id in redis as a string
        redis.set("game:"+gameID, "welcome to game " + gameID);
        
        // create a socket io namespace for this game
        io.of("/"+gameID)
          .on("connection", function (socket) {
              console.log("someone connected");
          });

        res.json(response);
    };

    this.show = function (req, res) {
        // the behavior is different depending on if the visitor is
        // viewing or playing

        redis.get("game:"+req.params.id, function (err, gameString) {
            if (err !== null) {
                res.send("Internal Server Error", 500);
            } else if (gameString === null) {
                res.send("Game Not Found", 404);
            } else {
                console.log(gameString);
                res.send(gameString);
            }
        });
    };

    this.update = function (req, res) {
        // send the latest move to all listeners
        res.send(200);
    };

    this.destroy = function (req, res) {
        // delete this game
        res.send(200);
    };
};

module.exports = GameController;
