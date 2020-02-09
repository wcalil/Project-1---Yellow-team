var map;
var infowindow;
var idRestaurant;

var slider = document.getElementById("myRange");
var output = document.getElementById("distance");
output.innerHTML = slider.value;

slider.oninput = function () {
    output.innerHTML = this.value;
}

var sliderPrice = document.getElementById("price");
var outputPrice = document.getElementById("priceIndex");
outputPrice.innerHTML = sliderPrice.value;

sliderPrice.oninput = function () {
    outputPrice.innerHTML = this.value;
}

var userDistance = 16812.4;
console.log(userDistance)

document.getElementById("myRange").addEventListener("click", function () {
    userDistance = slider.value * 1609.34
    initMapPlaces()
});

document.getElementById("btnRest").addEventListener("click", function () {
    initMapPlaces("restaurant")
});

document.getElementById("btnBar").addEventListener("click", function () {
    initMapPlaces("bar")
});

document.getElementById("btnCafe").addEventListener("click", function () {
    initMapPlaces("cafe")
});

document.getElementById("btnBakery").addEventListener("click", function () {
    initMapPlaces("bakery")
});

// Initialize function

function initMap() {

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
    });
}

// Retrieve restaurants nearby

function initMapPlaces(type) {

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
            radius: userDistance,
            types: [type],
        };
        console.log(userDistance)

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);

        service.nearbySearch(request, callback);

        // Place Restaurants in the marker using a loop

        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                    console.log(results[i].name)

                    var requestPriceRating = {
                        placeId: results[i].place_id,
                        fields: ['name', 'price_level', 'rating']
                    };
                }

                // Use the same function get price and rating information with the function getDetails and the id
                service.getDetails(requestPriceRating, callbackPriceRating);
               
                function callbackPriceRating(placePriceRating, status) {
                    for (var i = 0; i < results.length; i++) {
                            if (status == google.maps.places.PlacesServiceStatus.OK) {
                            console.log(placePriceRating);
                        }
                    }
                }
                console.log(results[0])
                console.log(results[0].place_id)
            }
        }



        function createMarker(place) {
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            })



            // function getDetails(details) {
            //     var queryURLforecast ="https://maps.googleapis.com/maps/api/place/details/json?place_id=2ffadeac9ba720db1d175c718483bdeecdd06190&fields=name,rating,formatted_phone_number&key=https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJN1t_tDeuEmsRUsoyG83frY4&fields=name,rating,formatted_phone_number&key=AIzaSyAejCVcVUkYiYvaLeQ8v84SSXfi4F30ucw";
            //     // var queryURLforecast = "https://maps.googleapis.com/maps/api/place/details/json?place_id=25faf0a7ef1056b980f3a19237cfa8e295668123&fields=name,rating,photos,website,price_level&key=AIzaSyAejCVcVUkYiYvaLeQ8v84SSXfi4F30ucw";
            //     $.ajax({
            //         url: queryURLforecast,
            //         method: "GET"
            //     }).then(function (response) {
            //         console.log(details)

            //     })
            // }


            google.maps.event.addListener(marker, 'mouseover', function () {
                infowindow.setContent(place.name + "<br>" + place.vicinity)
                infowindow.open(map, this)
            });

        }
    });

}


google.maps.event.addDomListener(window, 'load', initMap)
