//console.log('This would be the main JS file.');

$( document ).ready(function() {
    //Create scene and camera
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( 690, 690 );

    var demoBox = $('#demo');
    var demoTabs = $('#tabs');
    demoTabs.tabs({
        collapsible:true
    });

    $("#slider-star-a").slider({
         value:1
        ,min:0.0
        ,max:10.1
        ,step:0.1
        ,slide: function(event,ui) {
            $(this).parent().find("input").val($(this).slider("value") + " AU");
        }
    });
    $('#star-a').val( $("#slider-star-a").slider("value")  + " AU");
    $("#slider-star-ecc").slider({
         value:1
        ,min:0.0
        ,max:1
        ,step:0.1
        ,slide: function(event,ui) {
            $(this).parent().find("input").val($(this).slider("value") + "");
        }
    });
    $('#star-ecc').val( $("#slider-star-ecc").slider("value") + "");
    $("#slider-star-mAnomaly").slider({
         value:0
        ,min:0.0
        ,max:360
        ,step:5
        ,slide: function(event,ui) {
            $(this).parent().find("input").val($(this).slider("value") + " \xB0");
        }
    });
    $('#star-mAnomaly').val( $("#slider-star-mAnomaly").slider("value")  + " \xB0");
    $("#slider-star-rotI").slider({
         value:0
        ,min:-90
        ,max:90
        ,step:5
        ,slide: function(event,ui) {
            $(this).parent().find("input").val($(this).slider("value") + " \xB0");
        }
    });
    $('#star-rotI').val( $("#slider-star-rotI").slider("value")  + " \xB0");
    $("#slider-star-rotW").slider({
         value:0
        ,min:0.0
        ,max:360
        ,step:5
        ,slide: function(event,ui) {
            $(this).parent().find("input").val($(this).slider("value") + " \xB0");
        }
    });
    $('#star-rotW').val( $("#slider-star-rotW").slider("value")  + " \xB0");
    $("#slider-star-rotOmeg").slider({
         value:0
        ,min:0.0
        ,max:360
        ,step:5
        ,slide: function(event,ui) {
            $(this).parent().find("input").val($(this).slider("value") + "\xB0");
        }
    });
    $('#star-rotOmeg').val( $("#slider-star-rotOmeg").slider("value")  + " \xB0");

    $('#demo>h3').after( renderer.domElement );
});