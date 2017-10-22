const path     = require('path'),
      http     = require('http'),
      express  = require('express'),
      socketIO = require('socket.io')

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 5000

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', socket => {
	console.log('New user connected')

	socket.emit('newMessage', {
		from: 'will',
		text: 'will you ever fucking learn',
		createdAt: new Date()
	})

	socket.on('createMessage', newMessage => {
		console.log('Create message', newMessage)
	})

	socket.on('disconnect', () => {
		console.log('User disconnected')
	})
})

server.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})




