
/* main.js */
window.addEventListener('DOMContentLoaded', () => {
	console.log('DOMContentLoaded')
	if (document.querySelector('aside')) {
		const delay = 2000
		document.querySelector('aside').hidden = false
		window.setTimeout( () => {
			document.querySelector('aside').hidden = true
		}, delay)
	}
	if(document.querySelector('input')) {
		document.querySelectorAll('input').forEach(element => {
			element.addEventListener('invalid', event => {
				if(!event.target.validity.valid) {
					const msg = event.target.dataset.msg || 'Please fill this field!'
					event.target.setCustomValidity(msg)
				}
			})
			element.addEventListner('input', event => {
				event.target.setCustomValidity('')
			})
		}, false)
	}
})
