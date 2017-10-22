const path     = require('path'),
      http     = require('http'),
      express  = require('express'),
      socketIO = require('socket.io')

const publicPath = path.join(__dirname, './../public')

const port = process.env.PORT || 4000

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', socket => {
	console.log('New user connected')

	socket.on('createMessage', message => {
		console.log('createMessage', message)
		io.emit('newMessage', {
			from:      message.from,
			text:      message.text,
			createdAt: new Date().getTime()
		})
	})

	socket.on('disconnect', () => {
		console.log('User disconnected')
	})
})

server.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})




