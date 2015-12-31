var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    nicknameArray = [];

server.listen(3000);


app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
    socket.on('new user', function(data, callback){
        if(nicknameArray.indexOf(data) != -1) {
            callback(false);
        } else { 
            callback(true);
            socket.nickname = data;
            nicknameArray.push(socket.nickname);
            io.sockets.emit('usernames', nicknameArray );
        }
    });
    
    socket.on('disconnect', function(data){
        if(!nicknameArray) return;
        nicknameArray.splice(nicknameArray.indexOf(socket.nickname), 1);
        io.sockets.emit('usernames', nicknameArray );
    });
    
    socket.on('send message', function(data){
       io.sockets.emit('new message', {msg:data, nick:socket.nickname}); // send message for every one include me
    });
});