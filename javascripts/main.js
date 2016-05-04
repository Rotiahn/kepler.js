//console.log('This would be the main JS file.');

$( document ).ready(function() {
    //Create scene and camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, 690 / 690, 0.1, 100 );
	light = new THREE.PointLight(0xFFFFDD);
	amblight = new THREE.AmbientLight(0x444444);
	scene.add(light);
	scene.add(amblight);
    scene.add(camera);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( 690, 690 );

    var demoBox = $('#demo');
    var demoTabs = $('#tabs');
    demoTabs.tabs({
        collapsible:true
    });

    $("[id^=slider][id$=mass]").slider({
         value:1
        ,min:0.0
        ,max:10.1
        ,step:0.1
        ,slide: function(event,ui) {
            $(this).parent().find("input").val($(this).slider("value") + " Sols");
        }
    });
    $('input[id$=mass]').val( function() {
        return ($(this).parent().find("[id^=slider][id$=mass]").slider("value")  + " Sols");
    });
    $("[id^=slider][id$=a]").slider({
         value:1
        ,min:0.0
        ,max:10.1
        ,step:0.1
        ,slide: function(event,ui) {
            $(this).parent().find("input").val($(this).slider("value") + " AU");
        }
    });
    $('input[id$=a]').val( function() {
        return ($(this).parent().find("[id^=slider][id$=a]").slider("value")  + " AU");
    });
    $("[id^=slider][id$=ecc]").slider({
         value:1
        ,min:0.0
        ,max:1
        ,step:0.1
        ,slide: function(event,ui) {
            $(this).parent().find("input").val($(this).slider("value") + "");
        }
    });
    $('input[id$=ecc]').val( function() {
        return ($(this).parent().find("[id^=slider][id$=ecc]").slider("value")  + "");
    });
    $("[id^=slider][id$=mAnomaly]").slider({
         value:0
        ,min:0.0
        ,max:360
        ,step:5
        ,slide: function(event,ui) {
            $(this).parent().find("input").val($(this).slider("value") + " \xB0");
        }
    });
    $('input[id$=mAnomaly]').val( function() {
        return ($(this).parent().find("[id^=slider][id$=mAnomaly]").slider("value")  + " \xB0");
    });
    $("[id^=slider][id$=rotI]").slider({
         value:0
        ,min:-90
        ,max:90
        ,step:5
        ,slide: function(event,ui) {
            $(this).parent().find("input").val($(this).slider("value") + " \xB0");
        }
    });
    $('input[id$=rotI]').val( function() {
        return ($(this).parent().find("[id^=slider][id$=rotI]").slider("value")  + " \xB0");
    });
    $("[id^=slider][id$=rotW]").slider({
         value:0
        ,min:0.0
        ,max:360
        ,step:5
        ,slide: function(event,ui) {
            $(this).parent().find("input").val($(this).slider("value") + " \xB0");
        }
    });
    $('input[id$=rotW]').val( function() {
        return ($(this).parent().find("[id^=slider][id$=rotW]").slider("value")  + " \xB0");
    });
    $("[id^=slider][id$=rotOmeg]").slider({
         value:0
        ,min:0.0
        ,max:360
        ,step:5
        ,slide: function(event,ui) {
            $(this).parent().find("input").val($(this).slider("value") + "\xB0");
        }
    });
    $('input[id$=rotOmeg]').val( function() {
        return ($(this).parent().find("[id^=slider][id$=rotOmeg]").slider("value")  + " \xB0");
    });

    star = new KEPLER.AstroBody(
     'Star'
    ,$("slider-star-mass").slider("value")
    ,new KEPLER.NULL_ORBIT()
    );
    star.geometry = new THREE.SphereGeometry(0.1);
    star.material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    star.mesh = new THREE.Mesh( star.geometry, star.material);
    scene.add(star.mesh);

    camera.position.set(0,10,10);
    camera.lookAt(star.mesh.position);

    render = function() {
        requestAnimationFrame( render );
        renderer.render( scene, camera );
    }
    render();

    $('#demo>h3').after( renderer.domElement );
});