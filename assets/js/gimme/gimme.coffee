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
