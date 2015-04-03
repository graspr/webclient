define([
	'socketio'
], function (io) {
    'use strict';
    var exports = {
        data: [0,0,0,0,0,0,0,0,0,0]
    };
    var socket = io();
    socket.on('chat message', function (msg) {
      exports.data = msg;
    });

    return exports;
});