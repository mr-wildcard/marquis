window.onload = ->

	qsMaquisLogo = document.querySelector('.marquis-logo')
	qsMaquisChoices = document.querySelector('.marquis-choices')

	if qsMaquisLogo and qsMaquisChoices
		qsMaquisLogo.classList.add 'loaded'
		qsMaquisChoices.classList.add 'loaded'

	# Drag'n'drop upload
	dndAceptedTypes =
		'image/png': true,
		'image/jpeg': true,
		'image/gif': true

	qsDndUploadholder = document.getElementById 'dnd-upload-holder'
	if qsDndUploadholder
		qsDndUploadholder.ondragenter = ->
			@className = 'ondrag'

		qsDndUploadholder.ondragleave = ->
			@className = ''
