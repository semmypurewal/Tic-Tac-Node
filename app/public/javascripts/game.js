(function () {
    var main = function () {
        var gameID = window.location.pathname.match(/\/games\/(.*)/)[1],
            socket = io.connect("/games/"+gameID),
            timeout = null,
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
            $(".status").html("<p>"+game.status+"</p>");
        });

        socket.on("status", function (data) {
            if (data.status === "waiting") {
                mySymbol = "X";
                $(".status").html("<p>waiting for someone to join...</p>");
            } else if (data.status === "playing") {
                mySymbol = mySymbol || "O";
                myTurn = (mySymbol === "X");
                $(".status").html("<p>someone joined!</p>");
                timeout = setTimeout(function () {
                    if (mySymbol === "X") {
                        $(".status").html("<p>It's your turn!</p>");
                    } else {
                        $(".status").html("<p>Waiting for opponent's move...</p>");                                     
                    }
                }, 3000);
            } else if (data.status === "viewable") {
                $(".status").html("<p>You are viewing this game</p>");
            } else if (data.status.indexOf("Wins") > -1) {
                $(".status").html("<p>"+data.status+"</p>");
            }
        });

        socket.on("move", function (data) {
            clearTimeout(timeout);
            $("#c"+data.cell).text(data.symbol);
            if (mySymbol !== null && data.symbol !== mySymbol) {
                $(".status").html("<p>It's your turn!</p>");
                myTurn = true;
            } else if (mySymbol !== null && data.symbol === mySymbol) {
                $(".status").html("<p>Waiting for opponent's move...</p>");                
                myTurn = false;
            } else {
                myTurn = false;
            }
        });

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
