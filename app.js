
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')
const PORT = process.env.PORT || 3000 
const APP = express()
const prove12 = require('./routes/prove12')
APP.set('view engine', 'ejs')
    .set('views', 'views')
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(express.static(path.join(__dirname, 'public')))
    .use(
        session({
            secret: 'random_text',
            cookie: {
                httpOnly: false 
            }
        })
    )
    .use('/', prove12);
const server = APP.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = require('socket.io')(server);
io.on('connection', socket => {
    console.log('Client is connected!');    
    socket.emit('register');
    socket
        .on('disconnect', () => {
            console.log('A client disconnected!')
            if(users[socket.id] !== undefined){
                var userName = users[socket.id];
                delete users[socket.id];
                socket.broadcast.emit("userLeft", {message: userName + ' left the conversation.', user: 'Admin' });
            }
        })
        .on('newUser', (username, time) => {
            const message = `${username} joined the conversation.`
            const data = {message: message, user: 'Admin', time: time};
            socket.broadcast.emit('newMessage', data); 
        })
        .on('message', data => {
            console.log('Message received')
            socket.broadcast.emit('newMessage', data);
        })  
        .on('registerUser', data => {
            console.log(socket.id)
            console.log(data.userName)
            if(users[socket.id] === undefined){
                users[socket.id] = data.userName;
            }
        })      
    });
const users = {};