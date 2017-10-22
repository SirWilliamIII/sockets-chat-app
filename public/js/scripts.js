const socket = io()

socket.on('connect', function() {
	console.log('connected to server')

	socket.emit('createMessage', {
		from: 'Sue',
		text: 'I love you, yo'
	})
})

socket.on('disconnect', function() {
	console.log('disconnected from server')
})

socket.on('createMessage', function(message) {
	console.log('new message', message)
})
