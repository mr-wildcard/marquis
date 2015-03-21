window.onload = ->

	qsMaquisLogo = document.querySelector('.marquis-logo')
	qsMaquisChoices = document.querySelector('.marquis-choices')

	if qsMaquisLogo
		qsMaquisLogo.classList.add 'loaded'
		qsMaquisChoices.classList.add 'loaded'