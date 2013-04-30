(function () {
    var main = function () {
        var gameID = window.location.pathname.match(/\/games\/(.*)/)[1],
            socket = io.connect("/games/"+gameID),
            mySymbol = null,
            myTurn = false;

        // load the current state of the board
        $.getJSON("/games/"+gameID+".json", function (game) {
            var i;
            for (i = 0; i < game.board.length; ++i) {
                if (game.board[i] !== "_") {
                    $("#c"+i).text(game.board[i]);
                }
            }
        });

        socket.on("status", function (data) {
            if (data.status === "waiting") {
                mySymbol = "X";
                $(".status").html("<p>waiting for opponent</p>");
            } else if (data.status === "playing") {
                mySymbol = mySymbol || "O";
                myTurn = (mySymbol === "X");
                $(".status").html("<p>found opponent</p>");
            } else if (data.status === "viewable") {
                $(".status").html("<p>You are viewing this game</p>");
            }
        });

        socket.on("move", function (data) {
            $("#c"+data.cell).text(data.symbol);
            if (mySymbol !== null && data.symbol !== mySymbol) {
                myTurn = true;
            } else {
                myTurn = false;
            }
            console.log("myTurn: " + myTurn);
        });

        $("h1 span").html(gameID);

        $(".cell").each(function (index, elt) {
            $(this).click(function () {
                if (myTurn && $("#c"+index).html() === "&nbsp;") {
                    // post the move
                    $.ajax({
                        url: "/games/"+gameID,
                        type: "PUT",
                        data: "cell="+index+"&symbol="+mySymbol,
                    });
                }
            });
        });
    }

    $(document).ready(main);
}());
