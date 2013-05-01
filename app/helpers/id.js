var crypto = require("crypto");

var id = function () {
    if (!(this instanceof id)) {
        return new id(arguments);
    }

    /**
     * Return the next id
     *
     * Code borrowed liberally from
     * http://stackoverflow.com/questions/10985872
     */
    this.next = function () {
        var now = new Date(),
            num = Math.floor(Math.random()*10000000000000) + now.getTime();
        return parseInt(num, 10).toString(31);
    };
};


module.exports = id;
