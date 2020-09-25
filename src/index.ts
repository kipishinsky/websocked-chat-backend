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


const usersState = new Map()

app.get('/', (req, res) => {
	res.send('server is currently running')
})

socketBus.on('connection', (connection) => {

	usersState.set(connection, {userId: 'userID_' + new Date().getTime().toString(), userName: 'anonymus'})

	socketBus.on('disconnect', () => {
		usersState.delete(connection)
	})

	connection.on('set-client-name', (name: string) => {

		if (typeof name !== 'string') {
			return
		}

		const user = usersState.get(connection)
		user.userName = name
	})

	connection.on('client-typing', () => {
		connection.broadcast.emit('user-typing-message', usersState.get(connection))
	})


	connection.on('client-message-sent', (message: string, successFn) => {
		console.log(message)

		if (typeof message !== 'string' || message === '' || message.length > 20){
			console.log('typeof message !== \'string\' || message === \'\'')
			successFn('Message length should be less than 20 chars')
			return
		}

		const user = usersState.get(connection)

		let clientMessage = {
			userId: user.userId, userName: user.userName, userMessage: {
				id: 'messID_' + new Date().getTime(), text: message
			}
		}
		stateMessages.push(clientMessage)

		socketBus.emit('new-client-message-sent', clientMessage)

		successFn(null)
	})


	connection.emit('init-messages-published', stateMessages, () => {
		console.log('init messages received')
	})

	console.log('USER CONNECTED')
})


const PORT = process.env.PORT || 3003
server.listen(PORT, () => {
	console.log('listening on *:3003')
})

