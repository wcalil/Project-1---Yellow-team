var map;
var infowindow;
var idRestaurant;
var request;
var selectedRestaurant = document.getElementById("selectedRestaurant");

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

        request = {
            location: currentLocation,
            radius: userDistance,
            types: [type],
        };
        console.log(userDistance)

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);

        service.nearbySearch(request, callback);

        // Place Restaurants in the marker using a loop

        var resultsArray = [];

        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                    // console.log(results[i].name)
                    // resultsArray = results[i];
                    // console.log(resultsArray)

                }

                var randomRestaurant = Math.floor((Math.random() * results.length) + 1);
                console.log(randomRestaurant)


                var requestPrice = {
                    placeId: results[randomRestaurant].place_id,
                    fields: ['name', 'price_level', 'rating', 'formatted_address','icon', 'url']
                };

                console.log(requestPrice)
                service.getDetails(requestPrice, callbackPrice);
                

                function callbackPrice(price, status) {
                    console.log(price);
                    console.log(price.price_level);
               
                    if (price.price_level == sliderPrice.value) {
                        
                        
                        
                        var paragraph1 = document.createElement("p");
                        var node1 = document.createTextNode("Your Food Place: " + price.name);
                        paragraph1.appendChild(node1);
                        selectedRestaurant.appendChild(paragraph1)

                        var paragraph2 = document.createElement("p");
                        var node1 = document.createTextNode("Price Index: " + price.price_level);
                        paragraph2.appendChild(node1);
                        selectedRestaurant.appendChild(paragraph2)

                        var paragraph3 = document.createElement("p");
                        var node1 = document.createTextNode("Rating: " + price.rating);
                        paragraph3.appendChild(node1);
                        selectedRestaurant.appendChild(paragraph3)

                        var paragraph4 = document.createElement("p");
                        var node1 = document.createTextNode("Address: " + price.formatted_address);
                        paragraph4.appendChild(node1);
                        paragraph4.style.borderBottom = "solid";
                        paragraph4.style.paddingBottom = "2%";
                        selectedRestaurant.appendChild(paragraph4)

                    }

                    else {
                        service.nearbySearch(request, callback);
                      
                    }
                }
            }
        }

        function createMarker(place) {
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            })


            google.maps.event.addListener(marker, 'mouseover', function () {
                infowindow.setContent(place.name + "<br>" + place.vicinity)
                infowindow.open(map, this)
            });

        }
    });

}

google.maps.event.addDomListener(window, 'load', initMap)

