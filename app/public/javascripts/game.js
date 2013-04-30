(function () {
    var main = function () {
        var gameID = window.location.pathname.match(/\/games\/(.*)/)[1],
            socket = io.connect("/games/"+gameID),
            myTurn = true;

        // load the current state of the board
        $.getJSON("/games/"+gameID+".json", function (game) {
            var i;
            for (i = 0; i < game.board.length; ++i) {
                if (game.board[i] !== "_") {
                    $("#c"+i).text(game.board[i]);
                }
            }
        });


        socket.on("connect", function () {
            console.log("connected!");
        });

        socket.on("status", function (data) {
            if (data.status === "waiting") {
                $(".status").html("<p>waiting for opponent</p>");
            } else if (data.status === "playing") {
                $(".status").html("<p>found opponent</p>");
            } else if (data.status === "viewable") {
                $(".status").html("<p>You are viewing this game</p>");
            }
        });

        $("h1 span").html(gameID);

        $(".cell").each(function (index, elt) {
            $(this).click(function () {
                var sym = "X";
                if (myTurn) {
                    // post the move
                    $.ajax({
                        url: "/games/"+gameID,
                        type: "PUT",
                        data: "cell="+index+"&symbol="+sym,
                        success: function (data) {
                            $("#c"+index).text(sym);
                            console.log("put was successful: " + data);
                        }
                    });
                }
            });
        });
    }

    $(document).ready(main);
}());

