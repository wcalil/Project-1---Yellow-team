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
var sliderPrice = document.getElementById("price");
var outputPrice = document.getElementById("priceIndex");
var userDistance = 16812.4;
var zoom;
var savedRestaurant;
var retrieveRestaurant = JSON.parse(localStorage.getItem("arrayRestaurants"));

if (retrieveRestaurant){
    var arrayRestaurants = retrieveRestaurant;
    retrieveRestaurants()
}

else{
var arrayRestaurants = [];

}



output.innerHTML = slider.value;
slider.oninput = function () {
    output.innerHTML = this.value;
};

outputPrice.innerHTML = sliderPrice.value;
sliderPrice.oninput = function () {
    outputPrice.innerHTML = this.value;
};

sliderPrice.addEventListener("click", function () {
    initMapPlaces()
});

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

document.getElementById("btnClean").addEventListener("click", function () {
    localStorage.clear();  
    location.reload();
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

        new google.maps.Marker({
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
        
        if (userDistance > 16812.4 ){
            zoom = 12
        }
        else{
            zoom = 13
        }

        map = new google.maps.Map(document.getElementById("map"), {
            zoom: zoom,
            center: currentLocation
        });

        new google.maps.Marker({
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

        arrayRestaurants.push({ 
            name: details.name, 
            price: details.price_level, 
            rating: details.rating, 
            address: details.formatted_address,
            phoneNumber:  details.formatted_phone_number,
            url: details.url, 
            website: details.website
        });

        var idName = JSON.stringify(details.name);
        var resultsDiv = document.createElement("div")
        resultsDiv.setAttribute("id", idName);
        resultsDiv.style.position = 'relative'
        selectedRestaurant.appendChild(resultsDiv)

        var paragraph1 = document.createElement("h2");
        var node1 = document.createTextNode(details.name);
        paragraph1.appendChild(node1);
        resultsDiv.appendChild(paragraph1)
        
        var paragraph2 = document.createElement("p");
        var node1 = document.createTextNode("Price Level: " + details.price_level);
        paragraph2.appendChild(node1);
        resultsDiv.appendChild(paragraph2)

        var paragraph3 = document.createElement("p");
        var node1 = document.createTextNode("Rating: " + details.rating);
        paragraph3.appendChild(node1);
        resultsDiv.appendChild(paragraph3)

        var paragraph4 = document.createElement("p");
        var node1 = document.createTextNode("Address: " + details.formatted_address);
        paragraph4.appendChild(node1);
        resultsDiv.appendChild(paragraph4)

        var paragraph6 = document.createElement("p");
        var node1 = document.createTextNode("Phone Number: " + details.formatted_phone_number);
        paragraph6.appendChild(node1);
        resultsDiv.appendChild(paragraph6)

        var googleIcon = document.createElement("img");
        googleIcon.setAttribute('src', './assets/Google-Logo.png');
        googleIcon.setAttribute('height', '50px');
        googleIcon.setAttribute('width', '50px');
        googleIcon.setAttribute('alt', 'Google Icon');

        var googleLink = document.createElement("a");
        googleLink.setAttribute('href', details.url)
        googleLink.style.position = 'absolute'
        googleLink.style.right = '200px'
        googleLink.style.bottom = '20px'
        googleLink.appendChild(googleIcon)
        resultsDiv.appendChild(googleLink);

        var webIcon = document.createElement("img");
        webIcon.setAttribute('src', './assets/Web-Icon.png');
        webIcon.setAttribute('height', '50px');
        webIcon.setAttribute('width', '50px');
        webIcon.setAttribute('alt', 'Web Icon');
       
        var webLink = document.createElement("a");
        webLink.setAttribute('href', details.website)
        webLink.style.position = 'absolute'
        webLink.style.right = '140px'
        webLink.style.bottom = '20px'
        webLink.appendChild(webIcon)
        resultsDiv.appendChild(webLink);

        var deleteIcon = document.createElement("img");
        deleteIcon.setAttribute('src', './assets/trash.png');
        deleteIcon.setAttribute('height', '50px');
        deleteIcon.setAttribute('width', '50px');
        deleteIcon.setAttribute('id', 'deleteIcon');
        deleteIcon.setAttribute('alt', 'Trash Icon');
        deleteIcon.style.position = 'absolute'
        deleteIcon.style.right = '20px'
        deleteIcon.style.bottom = '20px'
        resultsDiv.appendChild(deleteIcon);
                
        deleteIcon.onclick = function() {
          resultsDiv.remove();
        };

        var favoriteIcon = document.createElement("img");
        favoriteIcon.setAttribute('src', './assets/Favorites.png');
        favoriteIcon.setAttribute('height', '50px');
        favoriteIcon.setAttribute('width', '50px');
        favoriteIcon.setAttribute('alt', 'Favorite Icon');
        favoriteIcon.style.position = 'absolute'
        favoriteIcon.style.right = '80px'
        favoriteIcon.style.bottom = '20px'
        resultsDiv.appendChild(favoriteIcon);
    
        console.log(details)
        
        //for(i = 0; i <= 4; i++){
            
        //var newPhotos = details.photos[i].getUrl({maxWidth: 200, maxHeight: 200})
        //var photoList = document.createElement("ul")
        //var photoIMG = document.createElement("img")
          //  photoIMG.setAttribute("src", newPhotos)
            //photoList.append(photoIMG)
            //resultsDiv.appendChild(photoList)

        //}




        favoriteIcon.onclick = function() {
            saveRestaurant();
          };
  


        var myScreen = window.matchMedia("(max-width: 700px)")
        mediaQuery(myScreen)
        myScreen.addListener(mediaQuery)

        function mediaQuery(myScreen) {
            if (myScreen.matches) {
                document.getElementById(idName).style.paddingBottom = "20%";
            } else {
                document.getElementById(idName).style.paddingBottom = "5%"
            }
        }

        document.getElementById(idName).style.borderBottom = "solid";
        document.getElementById(idName).style.margingBottom = "5%";

    }
    window.scrollTo(0, 10000);
}


function createMarker(place) {
    place.geometry.location;

    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location


    })
    google.maps.event.addListener(marker, 'mouseover', function () {
        infowindow.setContent(place.name + "<br>" + place.vicinity)
        infowindow.open(map, this)
    });
}

function saveRestaurant() {
    localStorage.setItem("arrayRestaurants", JSON.stringify(arrayRestaurants))
    alert("Saved!")
}

function retrieveRestaurants() {
    for (i = 0 ; i < arrayRestaurants.length ; i++ ){
        

        savedRestaurant = arrayRestaurants[i]

        var idName = savedRestaurant.name;
        var resultsDiv = document.createElement("div")
        resultsDiv.setAttribute("id", idName);
        resultsDiv.style.position = 'relative'
        selectedRestaurant.appendChild(resultsDiv)

        var paragraph1 = document.createElement("h2");
        var node1 = document.createTextNode(savedRestaurant.name);
        paragraph1.appendChild(node1);
        resultsDiv.appendChild(paragraph1)
        
        var paragraph2 = document.createElement("p");
        var node1 = document.createTextNode("Price Level: " + savedRestaurant.price);
        paragraph2.appendChild(node1);
        resultsDiv.appendChild(paragraph2)

        var paragraph3 = document.createElement("p");
        var node1 = document.createTextNode("Rating: " + savedRestaurant.rating);
        paragraph3.appendChild(node1);
        resultsDiv.appendChild(paragraph3)

        var paragraph4 = document.createElement("p");
        var node1 = document.createTextNode("Address: " + savedRestaurant.address);
        paragraph4.appendChild(node1);
        resultsDiv.appendChild(paragraph4)

        var paragraph6 = document.createElement("p");
        var node1 = document.createTextNode("Phone Number: " + savedRestaurant.phoneNumber);
        paragraph6.appendChild(node1);
        resultsDiv.appendChild(paragraph6)

        var googleIcon = document.createElement("img");
        googleIcon.setAttribute('src', './assets/Google-Logo.png');
        googleIcon.setAttribute('height', '50px');
        googleIcon.setAttribute('width', '50px');
        googleIcon.setAttribute('alt', 'Google Icon');

        var googleLink = document.createElement("a");
        googleLink.setAttribute('href', savedRestaurant.url)
        googleLink.style.position = 'absolute'
        googleLink.style.right = '80px'
        googleLink.style.bottom = '20px'
        googleLink.appendChild(googleIcon)
        resultsDiv.appendChild(googleLink);

        var webIcon = document.createElement("img");
        webIcon.setAttribute('src', './assets/Web-Icon.png');
        webIcon.setAttribute('height', '50px');
        webIcon.setAttribute('width', '50px');
        webIcon.setAttribute('alt', 'Web Icon');
       
        var webLink = document.createElement("a");
        webLink.setAttribute('href', savedRestaurant.website)
        webLink.style.position = 'absolute'
        webLink.style.right = '20px'
        webLink.style.bottom = '20px'
        webLink.appendChild(webIcon)
        resultsDiv.appendChild(webLink);
      
        var myScreen = window.matchMedia("(max-width: 700px)")
        mediaQuery(myScreen)
        myScreen.addListener(mediaQuery)

        function mediaQuery(myScreen) {
            if (myScreen.matches) {
                document.getElementById(idName).style.paddingBottom = "20%";
            } else {
                document.getElementById(idName).style.paddingBottom = "5%"
            }
        }

        document.getElementById(idName).style.borderBottom = "solid";
        document.getElementById(idName).style.margingBottom = "5%";
    }
}

google.maps.event.addDomListener(window, 'load', initMap)
