(function () {
    var main = function () {
        $("#play").click(function () {
            $.post("/games", {}, function (response) {
                window.location = "/games/"+response.gameID;
            });
        });
    };

    $(document).ready(main);
}());
