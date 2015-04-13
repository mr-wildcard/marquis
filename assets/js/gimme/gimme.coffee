do ->

	mapOptions =
		center: new (google.maps.LatLng)(43.8321591, 4.3428536)
		mapTypeId: google.maps.MapTypeId.ROADMAP
		streetViewControl: false
		scrollwheel: false
		navigationControl: false
		mapTypeControl: false
		scaleControl: false
		draggable: false
		zoomControlOptions: style: google.maps.ZoomControlStyle.SMALL
		zoom: 9

	map = new (google.maps.Map)(document.getElementById('map'), mapOptions)

	marker = new (google.maps.Marker)(
		position: map.getCenter()
		map: map
		draggable: true
		animation: google.maps.Animation.DROP
		icon:
			url: window.originalImage
	)

	google.maps.event.addDomListener window, 'resize', ->
		google.maps.event.trigger map, "resize"
		map.setCenter marker.getPosition()

	colorInput = document.getElementById "colorTextInput"
	intensityInput = document.getElementById "intensityInput"
	colorValue = colorInput.value
	intensityValue = parseInt intensityInput.value

	onColorParamsChanged = () ->
		if @type == "text" then colorValue = @value else intensityValue = parseInt @value || 0
		camanImage.revert false
		camanImage.colorize(colorValue, intensityValue).render(_onImageProcessed);

	["paste", "change"].forEach (eventName) ->
		colorInput.addEventListener eventName, onColorParamsChanged, false
		intensityInput.addEventListener eventName, onColorParamsChanged, false

	_onImageProcessed = ->
		marker.setIcon @toBase64()

	Caman.remoteProxy = "proxy";
	camanImage = Caman "#uploaded-marker"
	Caman.Event.listen camanImage, "processStart", ->

	Caman.Event.listen camanImage, "processStart", ->

	# trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
	onInputFocus = (ev) ->
	  classie.add ev.target.parentNode, 'input--filled'
	  return

	onInputBlur = (ev) ->
	  if ev.target.value.trim() == ''
	    classie.remove ev.target.parentNode, 'input--filled'
	  return

	if !String::trim
	  do ->
	    # Make sure we trim BOM and NBSP
	    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g

	    String::trim = ->
	      @replace rtrim, ''

	    return
	[].slice.call(document.querySelectorAll('input.input__field')).forEach (inputEl) ->
	  # in case the input is already filled..
	  if inputEl.value.trim() != ''
	    classie.add inputEl.parentNode, 'input--filled'
	  # events:
	  inputEl.addEventListener 'focus', onInputFocus
	  inputEl.addEventListener 'blur', onInputBlur
	  return
