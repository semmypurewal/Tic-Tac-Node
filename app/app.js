var express = require("express"),
    app = express(),
    server = require("http").createServer(app).listen(3000),
    io = require("socket.io").listen(server),
    gameController = require("./controllers/game_controller.js")(io);

io.set("transports", [
    "flashsocket",
    "htmlfile",
    "xhr-polling",
    "jsonp-polling"
]);

app.configure(function () {
    app.use(express.static("public"));
    app.use(express.bodyParser());
});

app.post("/games", gameController.create);
app.get("/games/:id.:format?", gameController.show);
app.put("/games/:id", gameController.update);
app.del("/games/:id", gameController.destroy);
