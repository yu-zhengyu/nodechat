var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    mongoose = require ('mongoose'),
    nicknameArray = [];

server.listen(3000); // listen the 3000 port, and start the server.

// connect our mongodb database;  
mongoose.connect('mongodb://localhost/nodechat', function(err) {
    if(err) {
        console.log(err);
    }
    else {
        console.log('Mongodb connect successful'); 
    }
}); 

var chatschema = mongoose.Schema({
    nick: String,
    msg: String
});

var Chat = mongoose.model('Message', chatschema);


app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

io.sockets.on('connection', function(socket){
    Chat.find({}, function(err, docs) {
        if(err){
            throw err;
        }
        socket.emit('load message', docs); 

    });

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
        var newMessage = new Chat({nick:socket.nickname, msg:data});
        newMessage.save(function(err) {
            if(err) throw err;
            io.sockets.emit('new message', {msg:data, nick:socket.nickname}); // send message for every one include me
        });
        
    });
});