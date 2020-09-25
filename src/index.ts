import express from 'express'
import http from 'http'
import io from 'socket.io'

const app = express()
const server = http.createServer(app)
const socketBus = io(server)


const stateMessages = [
	{
		userId: 'hdg2231', userName: 'Anton', userMessage: {
			id: '6f3fyh', text: 'privet brodyga'
		}
	},
	{
		userId: 'hdg213211', userName: 'Igor', userMessage: {
			id: '6f3fyh', text: 'privet anton'
		}
	},
	{
		userId: 'hdgddf211', userName: 'Sveta', userMessage: {
			id: '6f32fsh', text: 'privet vsem!!!!!!'
		}
	}
]


app.get('/', (req, res) => {
	res.send('server is currently running')
})

socketBus.on('connection', (connection) => {

	connection.on('client-message-sent', (message: string) => {
		console.log(message)
	})

	connection.emit('init-messages-published', stateMessages)


	console.log('USER CONNECTED')
})

const PORT = process.env.PORT || 3003

server.listen(PORT, () => {
	console.log('listening on *:3003')
})

