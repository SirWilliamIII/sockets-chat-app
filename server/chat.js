const path = require('path'),
	http = require('http'),
	express = require('express'),
	socketIO = require('socket.io'),
	fs = require('fs')

const { generateMessage } = require('./utils/message'),
	{ isRealString } = require('./utils/validation'),
	{ Users } = require('./utils/users')

const publicPath = path.join(__dirname, './../public'),
	girlPic = path.join(__dirname, './utils/girl.jpg')

const port = process.env.PORT || 5000,
	app = express(),
	server = http.createServer(app),
	io = socketIO(server)

const users = new Users()

app.use(express.static(publicPath))

io.on('connection', socket => {
	console.log('New user connected')

	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and room name are required.')
		}

		socket.join(params.room)
		users.removeUser(socket.id)
		users.addUser(socket.id, params.name, params.room)

		io
			.to(params.room)
			.emit('updateUserList', users.getUserList(params.room))
		socket.emit(
			'newMessage',
			generateMessage('Admin', 'Welcome to Chit-Chater')
		)
		socket.broadcast
			.to(params.room)
			.emit(
				'newMessage',
				generateMessage('Admin', `${params.name} has joined.`)
			)
		callback()
	})

	socket.on('createMessage', (message, callback) => {
		const user = users.getUser(socket.id)

		if (user && isRealString(message.text)) {
			io
				.to(user.room)
				.emit('newMessage', generateMessage(user.name, message.text))
		}

		callback()
	})

	socket.on('disconnect', () => {
		const user = users.removeUser(socket.id)

		if (user) {
			io
				.to(user.room)
				.emit('updateUserList', users.getUserList(user.room))
			io
				.to(user.room)
				.emit(generateMessage('Admin', `${user.name} has left.`))
		}
	})
})

app.get('/img', (req, res) => {
	fs.createReadStream(girlPic).pipe(res)
})

server.listen(port, '0.0.0.0', () => {
	console.log(`Server listening on port ${port}`)
})
