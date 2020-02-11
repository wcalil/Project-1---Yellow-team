$(document).ready(function(){
    $('.carousel').carousel();

});

autoplay();

function autoplay() {
    $('.carousel').carousel('next');
    setTimeout(autoplay, 4500);
}

$('.carousel.carousel-slider').carousel({fullWidth: true});

$(document).ready(function(){
    $('.parallax').parallax();
});