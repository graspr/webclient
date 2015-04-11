//Gets next data
'use strict';

var seriesLength = 200;
// var indices = [0, 100, 200, 300, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var indices = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var seriesData = getSineSeries();

function getSineSeries() {
    var data = [];
    for (var i=0; i<seriesLength; i++) {
        data[i] = Math.round(Math.sin((i/seriesLength)*(Math.PI/8)) * 65535);
    }
    return data;
}



function iterateIndices() {
    var idx;
    for (var i=0; i<indices.length; i++) {
        idx = indices[i];
        if (idx >= seriesLength) {
            idx = 0;
        } else {
            idx += 1;
        }
        indices[i] = idx;
    }
}

function getNextSinData() {
    var ret = [];
    for (var i=0; i<indices.length; i++) {
        ret[i] = seriesData[indices[i]];
    }

    iterateIndices();
    return ret;

}

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
exports.getNextSinData = getNextSinData;