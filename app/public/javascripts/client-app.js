(function () {
    var main = function () {
        $.post("/games", {}, function (response) {
            window.location = "/games/"+response.game;
        });

        console.log("hello world!");
    };

    $(document).ready(main);
}());
