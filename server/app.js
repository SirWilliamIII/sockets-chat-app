const path     = require('path'),
      http     = require('http'),
      express  = require('express'),
      socketIO = require('socket.io'),
      fs       = require('fs')

const { generateMessage } = require('./utils/message'), { isRealString } = require('./utils/validation'), { Users } = require('./utils/users')

const picPath = path.join(__dirname, './../public')
const cityPic = path.join(__dirname, './utils/city.jpg')

const pic2Path = path.join(__dirname, './../public')
const outdoorPic = path.join(__dirname, './utils/pic.jpg')

const pic3Path = path.join(__dirname, './../public')
const asianBoat = path.join(__dirname, './utils/asian-boat.jpg')

const pic4Path = path.join(__dirname, './../public')
const moab = path.join(__dirname, './utils/moab.jpg')

const pic5Path = path.join(__dirname, './../public')
const park = path.join(__dirname, './utils/park.jpg')

const pic6Path = path.join(__dirname, './../public')
const snow = path.join(__dirname, './utils/snow.jpg')



const port   = process.env.PORT || 3000,
      app    = express(),
      server = http.createServer(app),
      io     = socketIO(server)

const users = new Users()

app.use(express.static(picPath))
app.use(express.static(pic2Path))
app.use(express.static(pic3Path))
app.use(express.static(pic4Path))
app.use(express.static(pic5Path))

io.on('connection', socket => {
	console.log('New user connected')

	socket.on('join', (params, callback) => {
		if(!isRealString(params.name) || !isRealString(params.room)) {
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
			generateMessage('Admin', 'Talk Cock!')
		)
		socket.broadcast
			.to(params.room)
			.emit(
				'newMessage',
				generateMessage('(admin): ', `${params.name} has joined.`)
			)
		callback()
	})

	socket.on('createMessage', (message, callback) => {
		const user = users.getUser(socket.id)

		if(user && isRealString(message.text)) {
			io
				.to(user.room)
				.emit('newMessage', generateMessage(user.name, message.text))
		}

		callback()
	})

	socket.on('disconnect', () => {
		const user = users.removeUser(socket.id)

		if(user) {
			io
				.to(user.room)
				.emit('updateUserList', users.getUserList(user.room))
			io
				.to(user.room)
				.emit(generateMessage('Admin', `${user.name} has left.`))
		}
	})
})

app.get('/pic1', (req, res) => {
	fs.createReadStream(cityPic).pipe(res)
})

app.get('/pic2', (req, res) => {
	fs.createReadStream(outdoorPic).pipe(res)
})

app.get('/pic3', (req, res) => {
	fs.createReadStream(asianBoat).pipe(res)
})

app.get('/pic4', (req, res) => {
	fs.createReadStream(moab).pipe(res)
})

app.get('/pic5', (req, res) => {
	fs.createReadStream(park).pipe(res)
})

app.get('/pic6', (req, res) => {
	fs.createReadStream(snow).pipe(res)
})

server.listen(port, '0.0.0.0', () => {
	console.log(`Server listening on port ${port}`)
})
