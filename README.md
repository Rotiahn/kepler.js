# kepler.js
A pure Javascript library with the aim of providing a set of tools for managing orbital dynamics.

---

### Build files:
* **kepler.js** - The full kepler.js library, uncompressed
* **kepler.min.js** - The full kepler.js library, minified
* **kepler_use_THREEJS.js** - Use this to have kepler.js use an existing [three.js][threejs] library[1], uncompressed
* **kepler_use_THREEJS.min.js** - Use this to have kepler.js use an existing [three.js][threejs] library[1], minified

---
[1] - kepler.js utilizes the THREE.Vector3() and THREEE.Matrix4() classes for handling 3d spatial calculations.  They are normally included in the src/external/three.js folder.  If you are using the [three.js][threejs] library already, it is more efficient to tie directly to that library. 

[threejs]: https://github.com/mrdoob/three.js/
