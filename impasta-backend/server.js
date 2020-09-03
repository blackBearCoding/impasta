import http from 'http';
import express from 'express';
import socketIO from 'socket.io';
import path from 'path';

import Room from './Room.js';

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer);
const port = 3001;

const allRooms = {};

app.use(express.static(path.resolve('../impasta-frontend/build')));

app.get('/new-room', (req, res) => {
  const room = new Room();
  allRooms[room.code] = room;
  console.log('New room created. Code: ' + room.code);
  res.send(room.code);
});

const screenIO = io.of('/screen');
screenIO.on('connect', socket => {
  const code = socket.handshake.query.code;
  const room = allRooms[code];
  room.screenSocket = socket;

  socket.on('start turn', room.startTurn);

  socket.on('start game', room.startGame);

  socket.on('disconnect', () => console.log('disconnect'));
});

const roomIO = io.of('/room');
roomIO.on('connect', socket => {
  const { code, playerId, playerName } = socket.handshake.query;

  console.log(playerId, playerName);
  console.log('Adding new player to: ' + code);

  const room = allRooms[code];
  room.addPlayer(socket);

  socket.on('start game', room.startGame);

  socket.on('start turn', room.startTurn);

  socket.on('player voted', room.addVote);

  socket.on('disconnect', () => {
    room.removePlayer(playerId);
    console.log('disconnect');
  });
});

httpServer.listen(port, () => console.log(`Now listening on port: ${port}`));
