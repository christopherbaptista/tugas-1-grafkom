function main() {
    const canvas = document.querySelector('#myCanvas');
    const renderer = new THREE.WebGLRenderer({canvas});
  
    const fov = 40;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 40;
    camera.position.y = 0;
  
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffff);
    // 0xD1117
    {
      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      scene.add(light);
    }
    {
      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(1, -2, -4);
      scene.add(light);
    }
  
    const objects = [];
    const spread = 20;
  
    function addObject(x, y, obj) {
      obj.position.x = x * spread;
      obj.position.y = y * spread;
  
      scene.add(obj);
      objects.push(obj);
    }
  
    function createMaterial() {
      const material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
      });
  
      const hue = Math.random();
      const saturation = 1;
      const luminance = .5;
      material.color.setHSL(hue, saturation, luminance);
  
      return material;
    }
  
    function addSolidGeometry(x, y, geometry) {
      const mesh = new THREE.Mesh(geometry, createMaterial());
      addObject(x, y, mesh);
    }
  
    {
      const loader = new THREE.FontLoader();
      
      function loadFont(url) {
        return new Promise((resolve, reject) => {
          loader.load(url, resolve, undefined, reject);
        });
      }
  
      async function doit() {
        const radius =  1.0;
        const height = 10.0;
        const radialSegments = 50;
        const heightSegments = 10;
        const openEnded = false;
        const thetaStart = Math.PI * 2.00;
        const thetaLength = Math.PI * 2.00;
        const geometry = new THREE.ConeGeometry(
          radius, height,
          radialSegments, heightSegments,
          openEnded,
          thetaStart, thetaLength);
  
        addSolidGeometry(-.5, 0, geometry);
  
        const mesh = new THREE.Mesh(geometry, createMaterial());
        geometry.computeBoundingBox();
        geometry.boundingBox.getCenter(mesh.position).multiplyScalar(-1);
  
        const parent = new THREE.Object3D();
        parent.add(mesh);
  
        addObject(.5, 0, parent);
      }
      doit();
    }
  
    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }
  
    var freeze = true;
    var speed = 0.0001;
    // function onMouseClick(event){
    //   freeze = !freeze;
    // }
    // document.addEventListener('click', onMouseClick, false);
  
    function render(time) {
      time *= 0.01;
      
  
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
  
      objects.forEach((obj, ndx) => {
        const speed = .5 + ndx * .05;
        const rot = time * speed;
        obj.rotation.x = rot;
        obj.rotation.y = rot;
      });
  
      renderer.render(scene, camera);
  
      requestAnimationFrame(render);
    }
  
    requestAnimationFrame(render);
  }
  
  main();
  
