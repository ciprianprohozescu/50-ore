$(document).ready(function(){
    $("#selectLocation").click(function(){
        getLocation();
    });
    });
    var map="";
    var marker=""
    var latLng = "51.508742,-0.120850";
    var map2="";
    var clat = "51.508742";
    var clong="-0.120850";
    function addMarker(location) {
        var map5 = new google.maps.Map(
            document.getElementById('googleMap'), {zoom: 12, center: location});
        // The marker, positioned at Location
        var marker = new google.maps.Marker({position: location, map: map5});
    }
    function addMarker2(location) {
        var uluru = {lat: ilat, lng: ilong};
        var map5 = new google.maps.Map(
            document.getElementById('googleMap2'), {zoom: 12, center: uluru});
        // The marker, positioned at Uluru
        var marker = new google.maps.Marker({position: uluru, map: map5});
        $("#mapContainer").show();
    }
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
    }
    function getLocation2() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition2);
        }
    }
    function showPosition(position) {
        addMarker({ lat: position.coords.latitude, lng: position.coords.longitude }); 
        latLng = position.coords.latitude+","+position.coords.longitude;
    
        
    }
    function showPosition2(position) {
        clat = position.coords.latitude.toString();
        clong =position.coords.longitude.toString();
        
    }