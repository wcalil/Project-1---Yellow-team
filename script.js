

// function initMap() {

//     navigator.geolocation.getCurrentPosition(function (position) {
//         let lat = position.coords.latitude;
//         let long = position.coords.longitude;
//         var latText = parseInt(lat);
//         var longText = parseInt(long);

//         var location = { lat: latText, lng: longText };
//         var map = new google.maps.Map(document.getElementById("map"), {
//             zoom: 4,
//             center: location
//         });
//         var marker = new google.maps.Marker({
//             position: location,
//             map: map
//         });
//     });
// }




var map;
var infowindow;
var inputVal;
var idRestaurant;

document.getElementById("myInput").addEventListener("click", function(){
    inputVal = document.getElementById("val").value;
    initMap()
  });

  
  function initMap() {
    console.log(inputVal)

    navigator.geolocation.getCurrentPosition(function (position) {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        var latText = parseFloat(lat);
        var longText = parseFloat(long);

        var currentLocation = { lat: latText, lng: longText };
        var map = new google.maps.Map(document.getElementById("map"), {
            zoom: 12,
            center: currentLocation
        });

        var marker = new google.maps.Marker({
            position: currentLocation,
            map: map
        });

                var request = {
                location: currentLocation,
                radius: 18047,
                types: [inputVal]
            };
            infowindow = new google.maps.InfoWindow();
            var service = new google.maps.places.PlacesService(map);

            service.nearbySearch(request, callback);

            function callback(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                    }
                    console.log(results[0].id)
                    console.log(results)
                }
            }

            function createMarker(place) {
                var placeLoc = place.geometry.location;
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                })
            

            google.maps.event.addListener(marker, 'mouseover', function () {
                //template literal version
                // infowindow.setContent(`${place.name} <br>${place.vicinity}`)
                //basic string concatenation version
                infowindow.setContent(place.name + "<br>" + place.vicinity)
                // infowindow.setContent(place.vicinity)
                infowindow.open(map, this)
            });
        
        }
    });

}

google.maps.event.addDomListener(window, 'load', initMap)



