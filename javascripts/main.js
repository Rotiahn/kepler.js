//console.log('This would be the main JS file.');

$( document ).ready(function() {
    //Create scene and camera
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( 690, 690 );

    var demoBox = $('#demo');
    var demoTabs = $('#tabs');
    demoTabs.tabs();

    $("#slider-star-a").slider();
    $("#slider-star-ecc").slider();
    $("#slider-star-mAnomaly").slider();
    $("#slider-star-rotI").slider();
    $("#slider-star-rotW").slider();
    $("#slider-star-rotOmeg").slider();

    $('#demo').append( renderer.domElement );
});