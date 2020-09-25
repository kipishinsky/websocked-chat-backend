import express from 'express'
import http from 'http'
import io from 'socket.io'

const app = express()
const server = http.createServer(app)
const socketBus = io(server)


const stateMessages = [
	{
		userId: 'userID_1', userName: 'Anton:', userMessage: {
			id: 'messID_1', text: 'privet brodyga'
		}
	},
	{
		userId: 'userID_2', userName: 'Igor:', userMessage: {
			id: 'messID_2', text: 'privet anton'
		}
	},
	{
		userId: 'userID_3', userName: 'Sveta:', userMessage: {
			id: 'messID_3', text: 'privet vsem!!!!!!'
		}
	}
]


app.get('/', (req, res) => {
	res.send('server is currently running')
})

socketBus.on('connection', (connection) => {


	connection.on('client-message-sent', (message: string) => {
		console.log(message)
		let clientMessage = {
			userId: 'userID_' + new Date().getTime(), userName: 'New Message of Client:', userMessage: {
				id: 'messID_' + new Date().getTime(), text: message
			}
		}
		stateMessages.push(clientMessage)

		socketBus.emit('new-client-message-sent', clientMessage)
	})



	connection.emit('init-messages-published', stateMessages)


	console.log('USER CONNECTED')
})

const PORT = process.env.PORT || 3003

server.listen(PORT, () => {
	console.log('listening on *:3003')
})

