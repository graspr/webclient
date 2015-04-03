//Gets next data
'use strict';
var isFake = false;

exports.next = function (_isFake) {
    isFake = _isFake;
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomData() {
    return [
        getRandomInt(1,65535),
        getRandomInt(1,65535),
        getRandomInt(1,65535),
        getRandomInt(1,65535),
        getRandomInt(1,65535),
        getRandomInt(1,65535),
        getRandomInt(1,65535),
        getRandomInt(1,65535),
        getRandomInt(1,65535),
        getRandomInt(1,65535),
        getRandomInt(1,65535),
        getRandomInt(1,65535),
        getRandomInt(1,65535),
        getRandomInt(1,65535),
        getRandomInt(1,65535),
        getRandomInt(1,65535)
    ];
}

exports.getRandomData = getRandomData;