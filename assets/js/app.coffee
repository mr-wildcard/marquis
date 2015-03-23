dndAcceptedTypes =
	'image/png': true,
	'image/jpeg': true,
	'image/gif': true

qsMaquisLogo = document.querySelector('.marquis-logo')
qsMaquisChoices = document.querySelector('.marquis-choices')

# Drag'n'drop upload
qsDndUploadholder = document.getElementById 'dnd-upload-holder'
uploading = false

window.onload = ->

	if qsMaquisLogo and qsMaquisChoices
		qsMaquisLogo.classList.add 'loaded'
		qsMaquisChoices.classList.add 'loaded'

	if qsDndUploadholder
		qsDndUploadholder.ondragenter = (e) ->
			e.stopPropagation()
			e.preventDefault()

			@className = 'ondrag'

		qsDndUploadholder.ondragleave = ->
			if !uploading
				@className = ''

		# http://www.quirksmode.org/blog/archives/2009/09/the_html5_drag.html
		qsDndUploadholder.addEventListener 'dragover', onDragEvent, false
		qsDndUploadholder.addEventListener 'drop', onDragEvent, false

onDragEvent = (e) ->
	e.stopPropagation()
	e.preventDefault()

	if e.type == "drop"
		dndFile = e.target.files || e.dataTransfer.files;
		console.log isUnique(dndFile), isAcceptedType(dndFile)
		if isUnique(dndFile) && isAcceptedType(dndFile)
			formData = new FormData
			formData.append 'file', dndFile

			uploading = true

			xhr = new XMLHttpRequest
			xhr.open 'POST', '/'
			xhr.onload = ->
				console.log 'upload terminé'
				uploading = false
				qsDndUploadholder.className = ''
				return

			xhr.upload.onprogress = (e) ->
				if e.lengthComputable
					complete = e.loaded / e.total * 100 | 0

					console.log 'upload progression:', complete
				return

			xhr.send formData

isUnique = (file) ->
	return file.length == 1


isAcceptedType = (file) ->
	console.log file
	return dndAcceptedTypes[file[0].type] == true

displayErrorMessage = (message) ->
	console.log message

