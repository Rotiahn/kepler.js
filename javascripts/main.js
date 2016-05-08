//console.log('This would be the main JS file.');

elementChange = function() {

    $('canvas').remove();
    try {clearInterval(interval);} catch(err) {/*do nothing*/};
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

     star = new KEPLER.AstroBody(
         'Star'
        ,$("#slider-star-mass").slider("value") * KEPLER.SOL_MASS
    ,new KEPLER.NULL_ORBIT()
    );
    star.geometry = new THREE.SphereGeometry(0.1);
    star.material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    star.mesh = new THREE.Mesh( star.geometry, star.material);
    scene.add(star.mesh);
    //scene.add(star.trail);
    star.update = function(time){
        this.orbit.addTime(time);
        pos = this.getPosition().divideScalar(KEPLER.AU);
        this.mesh.position.set(
             pos.x
            ,pos.y
            ,pos.z
        );
    }
    star.update(0);
    star.zoom = function() {
        focus = this;
        camera.position.set(
              this.mesh.position.x
             ,this.mesh.position.y
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
            ,$('#slider-planet-rotI').slider("value") * KEPLER.DEGREE
            ,$('#slider-planet-rotW').slider("value") * KEPLER.DEGREE
            ,$('#slider-planet-rotOmeg').slider("value") * KEPLER.DEGREE
        )
    );
    planet.geometry = new THREE.SphereGeometry(0.1);
    planet.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    planet.mesh = new THREE.Mesh( planet.geometry, planet.material);
    planet.mesh.scale.set(0.4,0.4,0.4);
    scene.add(planet.mesh);
    planet.trailGeom = new THREE.Geometry();
    var testE;
    for (var i=0;i<=361;i++) {
        testE = i*((2*Math.PI)/361);
        planet.trailGeom.vertices.push(planet.orbit.getPositionAtE(testE).divideScalar(KEPLER.AU));
    }
    planet.trail = new THREE.Line( planet.trailGeom);
    scene.add(planet.trail);
    planet.update = function(time){
        this.orbit.addTime(time);
        pos = this.getPosition().divideScalar(KEPLER.AU);
        this.mesh.position.set(
             pos.x
            ,pos.y
            ,pos.z
        );
   }
    planet.update(0);
    planet.zoom = function() {
        focus = this;
        camera.position.set(
              this.mesh.position.x
             ,this.mesh.position.y
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
            ,$('#slider-moon-rotI').slider("value") * KEPLER.DEGREE
            ,$('#slider-moon-rotW').slider("value") * KEPLER.DEGREE
            ,$('#slider-moon-rotOmeg').slider("value") * KEPLER.DEGREE
        )
    );
    moon.geometry = new THREE.SphereGeometry(0.1);
    moon.material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    moon.mesh = new THREE.Mesh( moon.geometry, moon.material);
    moon.mesh.scale.set(0.1,0.1,0.1);
    scene.add(moon.mesh);
    //moon.trailGeom = new THREE.Geometry();
    //var testE;
    //for (var i=0;i<=361;i++) {
    //    testE = i*((2*Math.PI)/361);
    //    moon.trailGeom.vertices.push(moon.orbit.getPositionAtE(testE).divideScalar(KEPLER.AU));
    //}
    //moon.trail = new THREE.Line( moon.trailGeom);
    //scene.add(moon.trail);
    moon.update = function(time){
        this.orbit.addTime(time);
        pos = this.getPosition().divideScalar(KEPLER.AU);
        this.mesh.position.set(
             pos.x
            ,pos.y
            ,pos.z
        );
     }
    moon.zoom = function() {
        focus = this;
        camera.position.set(
             this.mesh.position.x
            ,this.mesh.position.y
            ,this.mesh.position.z+.05
        );
        planet.mesh.scale.set(0.01,0.01,0.01);
        moon.mesh.scale.set(0.002,0.002,0.002);
        camera.lookAt(this.mesh.position);
    }


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
    interval = setInterval(update_1d,1000/30);


    $('#demo>h3').after( renderer.domElement );
};


$( document ).ready(function() {
    //ADD FUNCTIONS TO KEPLER.Orbit()
    KEPLER.Orbit.prototype.getPositionAtE = function(E) {
        //Part I: gather Orbital Elements
        this.updateAllElements();
        var elements = this.getElements();
        var tempMAnomaly = E - (elements.ecc * Math.sin(E));

        //Part II: Create clone
        //console.log(this);
        var clone = new KEPLER.Orbit(
             this.primary
            ,elements.a
            ,elements.ecc
            ,tempMAnomaly //elements.mAnomaly
            ,elements.rotI
            ,elements.rotW
            ,elements.rotOmeg
        );
        //console.log(clone,clone.primary);
        return clone.getPosition();
    }
    KEPLER.NULL_ORBIT.prototype.getPositionAtE = function(E) {
        //Part I: gather Orbital Elements
        return this.getPosition();
    }

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
            $(this).parent().find("input").val(ui.value + " Sols");
        }
        ,stop: function(event, ui) {
            elementChange()
        }
    });
    $('#slider-planet-mass').slider({
         value:1
        ,min:0.0
        ,max:10.1
        ,step:0.1
        ,slide: function(event,ui) {
            $(this).parent().find("input").val(ui.value + " Earths");
        }
        ,stop: function(event, ui) {
            elementChange()
        }
    });
    $('#slider-moon-mass').slider({
         value:1
        ,min:0.0
        ,max:10.1
        ,step:0.1
        ,slide: function(event,ui) {
            $(this).parent().find("input").val(ui.value + " Moons");
        }
        ,stop: function(event, ui) {
            elementChange()
        }
    });
    $('#star-mass').val( function() {
        return ($('#slider-star-mass').slider("value")  + " Sols");
    });
    $('#planet-mass').val( function() {
        return ($('#slider-planet-mass').slider("value")  + " Earths");
    });
    $('#moon-mass').val( function() {
        return ($('#slider-moon-mass').slider("value")  + " Moons");
    });
    $('#slider-planet-a').slider({
         value:1
        ,min:0.0
        ,max:10.1
        ,step:0.1
        ,slide: function(event,ui) {
            $(this).parent().find("input").val(ui.value + " AU");
        }
        ,stop: function(event, ui) {
            elementChange()
        }
    });
    $('#slider-moon-a').slider({
         value:300000
        ,min: 0.0
        ,max: 3030000
        ,step:30000
        ,slide: function(event,ui) {
            $(this).parent().find("input").val(ui.value + " km");
        }
        ,stop: function(event, ui) {
            elementChange()
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
            $(this).parent().find("input").val(ui.value + "");
        }
        ,stop: function(event, ui) {
            elementChange()
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
            $(this).parent().find("input").val(ui.value + " \xB0");
        }
        ,stop: function(event, ui) {
            elementChange()
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
            $(this).parent().find("input").val(ui.value + " \xB0");
        }
        ,stop: function(event, ui) {
            elementChange()
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
            $(this).parent().find("input").val(ui.value + " \xB0");
        }
        ,stop: function(event, ui) {
            elementChange()
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
            $(this).parent().find("input").val(ui.value + "\xB0");
        }
        ,stop: function(event, ui) {
            elementChange()
        }
    });
    $('input[id$=rotOmeg]').val( function() {
        return ($(this).parent().find("[id^=slider][id$=rotOmeg]").slider("value")  + " \xB0");
    });


    elementChange();
});
