// const io = require("socket.io")(8000);
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
// const router = require('./router');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
// app.use(router);

const users = {};

io.on('connection', socket =>{
    socket.on('new-user-joined', name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send',text =>{
        socket.broadcast.emit('receive', {message: text, name: users[socket.id]})
    });
    
    socket.on('disconnect',text =>{
        socket.broadcast.emit('user-left', users[socket.id]);
        delete users[socket.id];
    });
})

server.listen(process.env.PORT || 8000, () => console.log(`Server has started.`));