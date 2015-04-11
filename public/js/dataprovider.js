define([
	'socketio'
], function (io) {
    'use strict';
    console.log('Initializing socket.');
    var exports = {
        data: [0,0,0,0,0,0,0,0,0,0]
    };
    var socket = io();
    socket.on('chat message', function (msg) {
        console.log('got data', msg);
      exports.data = msg;
    });

    return exports;
});