const socket = io()

socket.on('connect', function() {
	const params = jQuery.deparam(window.location.search)

	socket.emit('join', params, (err, data) => {
		if (err) {
			alert(err)
			window.location.href = '/'
		} else {
			console.log('No error')
		}
	})
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


