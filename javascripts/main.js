//console.log('This would be the main JS file.');

$( document ).ready(function() {
    //Create scene and camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, 690 / 690, 0.001, 100 );
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

    $('#slider-star-mass').slider({
         value:1
        ,min:0.0
        ,max:10.1
        ,step:0.1
        ,slide: function(event,ui) {
            $(this).parent().find("input").val($(this).slider("value") + " Sols");
        }
    });
    $('#slider-planet-mass').slider({
         value:1
        ,min:0.0
        ,max:10.1
        ,step:0.1
        ,slide: function(event,ui) {
            $(this).parent().find("input").val($(this).slider("value") + " Earths");
        }
    });
    $('#slider-moon-mass').slider({
         value:1
        ,min:0.0
        ,max:10.1
        ,step:0.1
        ,slide: function(event,ui) {
            $(this).parent().find("input").val($(this).slider("value") + " Moons");
        }
    });
    $('#star-mass').val( function() {
        return ($('#slider-star-mass').slider("value")  + " Sols");
    });
    $('#planet-mass').val( function() {
        return ($('#slider-planet-mass').slider("value")  + " Earths");
    });
    $('#moon-mass').val( function() {
        return ($('#slider-moon-mass').slider("value")  + " Lunas");
    });
    $('#slider-planet-a').slider({
         value:1
        ,min:0.0
        ,max:10.1
        ,step:0.1
        ,slide: function(event,ui) {
            $(this).parent().find("input").val($(this).slider("value") + " AU");
        }
    });
    $('#slider-moon-a').slider({
         value:30000000
        ,min: 0.0
        ,max: 3030000
        ,step:30000
        ,slide: function(event,ui) {
            $(this).parent().find("input").val($(this).slider("value") + " km");
        }
    });
    $('#planet-a').val( function() {
        return ($('#slider-planet-a').slider("value")  + " AU");
    });
    $('#moon-a').val( function() {
        return ($('#slider-moon-a').slider("value")  + " km");
    });
    $("[id^=slider][id$=ecc]").slider({
         value:0.0
        ,min:0.0
        ,max:1.1
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
        ,$("#slider-star-mass").slider("value") * KEPLER.SOL_MASS
    ,new KEPLER.NULL_ORBIT()
    );
    star.geometry = new THREE.SphereGeometry(0.1);
    star.material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    star.mesh = new THREE.Mesh( star.geometry, star.material);
    scene.add(star.mesh);
    star.trailGeom = new THREE.Geometry();
    star.trail = new THREE.Mesh( star.trailGeom, star.material);
    scene.add(star.trail);
    star.update = function(time){
        this.orbit.addTime(time);
        var pos = this.getPosition().divideScalar(KEPLER.AU);
        this.mesh.position.set(
             pos.x
            ,pos.y
            ,pos.z
        );
        this.trailGeom.vertices.unshift(pos);
    }
    star.update(0);
    star.zoom = function() {
        focus = this;
        camera.position.set(
              this.mesh.position.x
             ,this.mesh.position.y+5
             ,this.mesh.position.z+5
        );
        planet.mesh.scale.set(0.4,0.4,0.4);
        moon.mesh.scale.set(0.1,0.1,0.1);
        camera.lookAt(this.mesh.position);
    }

    planet = new KEPLER.AstroBody(
         'Planet'
        ,$("#slider-planet-mass").slider("value") * KEPLER.EARTH_MASS
        ,new KEPLER.Orbit(
             star
            ,$('#slider-planet-a').slider("value") * KEPLER.AU
            ,$('#slider-planet-ecc').slider("value")
            ,$('#slider-planet-mAnomaly').slider("value")
            ,$('#slider-planet-rotI').slider("value")
            ,$('#slider-planet-rotW').slider("value")
            ,$('#slider-planet-rotOmeg').slider("value")
        )
    );
    planet.geometry = new THREE.SphereGeometry(0.1);
    planet.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    planet.mesh = new THREE.Mesh( planet.geometry, planet.material);
    planet.mesh.scale.set(0.4,0.4,0.4);
    scene.add(planet.mesh);
    planet.update = function(time){
        planet.orbit.addTime(time);
        var pos = planet.getPosition().divideScalar(KEPLER.AU);
        planet.mesh.position.set(
             pos.x
            ,pos.y
            ,pos.z
        );
        //this.trailGeom.unshift(pos);
    }
    planet.update(0);
    planet.zoom = function() {
        focus = this;
        camera.position.set(
              this.mesh.position.x
             ,this.mesh.position.y+.3
             ,this.mesh.position.z+.3
        );
        planet.mesh.scale.set(0.04,0.04,0.04);
        moon.mesh.scale.set(0.01,0.01,0.01);
        camera.lookAt(this.mesh.position);
    }

    moon = new KEPLER.AstroBody(
         'Moon'
        ,$("#slider-moon-mass").slider("value") * KEPLER.EXAMPLE.Luna.mass
        ,new KEPLER.Orbit(
             planet
            ,$('#slider-moon-a').slider("value") * KEPLER.KM
            ,$('#slider-moon-ecc').slider("value")
            ,$('#slider-moon-mAnomaly').slider("value")
            ,$('#slider-moon-rotI').slider("value")
            ,$('#slider-moon-rotW').slider("value")
            ,$('#slider-moon-rotOmeg').slider("value")
        )
    );
    moon.geometry = new THREE.SphereGeometry(0.1);
    moon.material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    moon.mesh = new THREE.Mesh( moon.geometry, moon.material);
    moon.mesh.scale.set(0.1,0.1,0.1);
    scene.add(moon.mesh);
    moon.update = function(time){
        this.orbit.addTime(time);
        var pos = this.getPosition().divideScalar(KEPLER.AU);
        this.mesh.position.set(
             pos.x
            ,pos.y
            ,pos.z
        );
        //this.trailGeom.unshift(pos);
    }
    moon.zoom = function() {
        focus = this;
        camera.position.set(
             this.mesh.position.x
            ,this.mesh.position.y+.05
            ,this.mesh.position.z+.05
        );
        planet.mesh.scale.set(0.04,0.04,0.04);
        moon.mesh.scale.set(0.01,0.01,0.01);
        camera.lookAt(this.mesh.position);
    }


    camera.position.set(0,5,5);
    camera.lookAt(star.mesh.position);

    star.zoom();

    render = function() {
        requestAnimationFrame( render );
        renderer.render( scene, camera );
    }
    render();

    update_1d = function() {
        //star.orbit.addTime(KEPLER.DAY);
        //planet.orbit.addTime(KEPLER.DAY);
        //moon.orbit.addTime(KEPLER.DAY);

        star.update(KEPLER.DAY);
        planet.update(KEPLER.DAY);
        moon.update(KEPLER.DAY);


        focus.zoom();
        //render();
    }
    setInterval(update_1d,1000/30);


    $('#demo>h3').after( renderer.domElement );
});