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

	Caman.remoteProxy = "proxy";
	Caman.DEBUG = true
	Caman "#uploaded-marker", () ->
		@brightness(5).render()