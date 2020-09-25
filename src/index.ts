import express from 'express'
import http from 'http'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.get('/', (req, res) => {
	res.send('server is currently running');
});

io.on('connection', (socket) => {
	console.log('a user connected');
});

server.listen(3003, () => {
	console.log('listening on *:3003');
});