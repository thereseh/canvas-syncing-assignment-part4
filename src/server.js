// attempt to use express, I guess it's working
const express = require('express');

const app = express();

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const path = require('path');

const server = require('http').createServer(app);

const socketio = require('socket.io');

const images = {};

// not sure if this is supposed to be better than the way you showed us
app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../client/index.html`));
});

server.listen(PORT);

const io = socketio(server);

io.on('connection', (socket) => {
  socket.join('room1');
  
  if (Object.keys(images).length > 0) {
    socket.emit('updateCanvas', images);
  }
  
  socket.on('addImage', (data) => {
    const time = new Date().getTime();
    images[time] = data;
    socket.broadcast.emit('fromServer', data);
  });

  socket.on('disconnect', () => {
    socket.leave('room1');
  });
});

console.log(`listening on port ${PORT}`);
