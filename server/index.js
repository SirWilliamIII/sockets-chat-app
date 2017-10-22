const path     = require('path'),
      http     = require('http'),
      express  = require('express'),
      socketIO = require('socket.io')

const publicPath = path.join(__dirname, './../public')
const { generateMessage } = require('./utils/message')

const port = process.env.PORT || 8181

const app = express()

const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', socket => {
	console.log('New user connected')

	socket.emit('newMessage', generateMessage('Admin', 'Welcome to' +
		' chit-chat'))

	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User' +
		' Joined'))

	socket.on('createMessage', (message, callback) => {
		console.log('createMessage', message)
			io.emit('newMessage', generateMessage(message.from, message.text))
			callback('All is good, continue.')
		/*socket.broadcast.emit('newMessage', {
			from: message.from,
			text: message.text,
			createdAt: new Date().getTime()
		})*/
	})

	socket.on('disconnect', () => {
		console.log('User disconnected')
	})
})

server.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})




