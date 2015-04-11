'use strict';
var express = require('express');
var net = require('net');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var dataProvider = require('./dataProvider');

var app = express();
var http = require('http').Server(app);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var HOST = 'graspr';
var PORT = 8080;

var io = require('socket.io')(http);
var TCPClient = new net.Socket();
var TCP_SOCKET_PAUSED = false;

var lastWebSocket;
var buffer = "";
var FAKE = false;
var NUMBER_GRASPR_VALUES = 16;

function initTCPSocket() {
    console.log('Initializing TCP Socket..');
    if (FAKE) {
        var sendData;
        setInterval(function () {
            // TCPClient.emit('data', dataProvider.getRandomData());
            sendData = dataProvider.nextData();
            // console.log('sendData is', sendData);
            TCPClient.emit('data', sendData);
        }, 16);
    }
    TCPClient.connect(PORT, HOST, function() {
        console.log('TCP SOCKET Connected to: ' + HOST + ':' + PORT);
    });

    // Add a 'close' event handler for the TCPClient socket
    TCPClient.on('close', function() {
        console.log('TCP SOCKET Connection closed');
    });

    TCPClient.on('error', function (err) {
        console.log('TCP/SOCKET Client error!', err);
    });

    TCPClient.on('end', function () {
        console.log('END ===============');
    });
}

function initWebserver() {
    // uncomment after placing your favicon in /public
    //app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', routes);
    app.use('/users', users);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    console.log('hello!', app.get('env'));
    if (app.get('env') === 'development') {
      app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
      });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });
    app.get('/', function(req, res){
        res.sendFile('index.html', { root: __dirname });
    });

    app.use('/js', express.static(__dirname + '/js'));
    http.listen(3000, function(){
        console.log('listening on *:3000');
    });
}

function initWebsocket() {
    io.on('connection', function(websocket){
        console.log('Got a websocket connection! ');
        lastWebSocket = websocket;

        websocket.on('data message', function(msg){
            console.log('message: ' + msg);
        });

        var reads;
        // data is what the server sent to this socket
        TCPClient.on('data', function(data) {
            buffer += data.toString();
            reads = [buffer.slice(0,95)];
            buffer = ""; //clear the buffer
            var read;
            for (var i=0; i<reads.length;i++) {
                read = reads[i].split(',');
                if (read.length < NUMBER_GRASPR_VALUES) {
                    //throw it back on the buffer
                    buffer += "\n" + reads[i];
                    console.log('c');
                    continue;
                }
                websocket.emit('data message', read);  //WHEN YOU SEND JSON YOU GET JSON AT THE BROWSER!!!
            }
            // websocket.emit('data message', data.toString());
        });
    });
}

function initOSSignals() {
    process.on('SIGINT', function() {
        console.log( "\nShutting Down Graspr Node Client Server..." );
        TCPClient.destroy();
        if(lastWebSocket) {
            lastWebSocket.emit('data message', '=============== Shutting Down Server! ===============');
        }
        process.exit( );
    });
}

function initialize() {
    initWebserver();
    initTCPSocket();
    initWebsocket();
    initOSSignals();
}

module.exports = app;

initialize();



