const socket = io()

socket.on('connect', function() {
	console.log('Connected to server')
})

socket.on('disconnect', function() {
	console.log('Disconnected from server')
})

socket.on('newMessage', function(message) {
	console.log('New message', message)
	const li = jQuery('<li></li>')
		li.text(`${message.from}: ${message.text}`)
		jQuery('#messages').append(li)
})

jQuery('#message-form').on('submit', evt => {
	evt.preventDefault()

	socket.emit('createMessage', {
		from: 'User',
		text: jQuery('[name=message]').val()
	}, () => {

	})

})


