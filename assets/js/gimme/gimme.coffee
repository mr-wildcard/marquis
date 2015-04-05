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
		draggable:true
		animation: google.maps.Animation.DROP
		icon:
			url: window.originalImage
	)

	Caman.remoteProxy = "proxy";
	Caman "#uploaded-marker", () ->
		@colorize("#ff0000", 80)
		@render();

	Caman.Event.listen "processStart", () ->
		console.log 'started'

	Caman.Event.listen "processStart", () ->
		console.log "ended"