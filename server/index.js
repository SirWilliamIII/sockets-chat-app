const path     = require('path'),
      http     = require('http'),
      express  = require('express'),
      socketIO = require('socket.io')

const {generateMessage} = require('./utils/message')
const { isRealString } = require('./utils/validation')

const publicPath = path.join(__dirname, './../public')

const port   = process.env.PORT || 8000,
      app    = express(),
      server = http.createServer(app),
      io     = socketIO(server)

app.use(express.static(publicPath))


io.on('connection', socket => {

	console.log('New user connected')

	socket.emit('newMessage', generateMessage('Admin', 'Welcome to chit-chat'))
	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User'))

	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and room name are required.')
		}
		callback()
	})

	socket.on('createMessage', (message, callback) => {

		console.log('createMessage', message)

		io.emit('newMessage', generateMessage(message.from, message.text))
		callback('All is good, continue.')
	})


	socket.on('disconnect', () => {
		console.log('User disconnected')
	})

})


server.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})




