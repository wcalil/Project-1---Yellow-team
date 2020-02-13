var map;
var infowindow;
var idRestaurant;
var request;
var requestDetails;
var randomRestaurant;
var currentLocation;
var selectedRestaurant = document.getElementById("selectedRestaurant");
var service;
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
        var currentLocation;
        currentLocation = { lat: latText, lng: longText };
        map = new google.maps.Map(document.getElementById("map"), {
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
        currentLocation = { lat: latText, lng: longText };
        map = new google.maps.Map(document.getElementById("map"), {
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
            // minPriceLevel: 0,
            maxPriceLevel: sliderPrice.value,
          
        };

        infowindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    });
}

// Place Restaurants in the marker using a loop
function callback(results, status) {
    console.log(results)
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);

        }

        randomRestaurant = Math.floor((Math.random() * results.length));

        var paragraph1 = document.createElement("h2");
        var node1 = document.createTextNode(results[randomRestaurant].name);
        paragraph1.appendChild(node1);
        selectedRestaurant.appendChild(paragraph1)

        var paragraph2 = document.createElement("p");
        var node1 = document.createTextNode("Price Index: " + results[randomRestaurant].price_level);
        paragraph2.appendChild(node1);
        selectedRestaurant.appendChild(paragraph2)

        var paragraph3 = document.createElement("p");
        var node1 = document.createTextNode("Rating: " + results[randomRestaurant].rating);
        paragraph3.appendChild(node1);
        selectedRestaurant.appendChild(paragraph3)

    }

    var requestDetails = {
        placeId: results[randomRestaurant].place_id,
        fields: ['name', 'price_level', 'rating', 'formatted_address', 'icon', 'url', 'photo', 'website', 'formatted_phone_number']
    };

    service.getDetails(requestDetails, callbackDetails);

}


function callbackDetails(details, status) {
    console.log(details)
    if (status === google.maps.places.PlacesServiceStatus.OK) {

        var paragraph4 = document.createElement("p");
        var node1 = document.createTextNode("Address: " + details.formatted_address);
        paragraph4.appendChild(node1);
        selectedRestaurant.appendChild(paragraph4)

        // var webIcon = document.createElement("img");
        // webIcon.setAttribute('src', 'Google-Logo.png');
        // document.webIcon.setAttribute(<a href="http://www.addaxtactical.com"><img src='Google-Logo.png'></a>);
        // {/* /* // webIcon.href = "http://www.cnn.com/";
        // // webIcon.setAttribute('alt', 'Google Icon'); */
        // webIcon.setAttribute('height', '50px');
        // webIcon.setAttribute('width', '50px');
        // selectedRestaurant.appendChild(webIcon);


        var paragraph5 = document.createElement("p");
        var node1 = document.createTextNode("URL: " + details.url);
        paragraph5.appendChild(node1);
        selectedRestaurant.appendChild(paragraph5)

        var paragraph6 = document.createElement("p");
        var node1 = document.createTextNode("Phone Number: " + details.formatted_phone_number);
        paragraph6.appendChild(node1);
        paragraph6.style.borderBottom = "solid";
        paragraph6.style.paddingBottom = "2%";
        selectedRestaurant.appendChild(paragraph6)
   

    }
    window.scrollTo(0, 10000);
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
google.maps.event.addDomListener(window, 'load', initMap)