<script>
  import { onMount, getContext } from 'svelte'
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";

  onMount(() => {
    let { scene, camera, renderer } = getContext('three')

    let controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    let ambient = new THREE.AmbientLight(0x2e1009, 3.0);
    scene.add(ambient);

    let dLight = new THREE.DirectionalLight(0xf97316, 5.0);
    dLight.position.set(6, 6, 4);
    scene.add(dLight);

    let golgiGroup = new THREE.Group();
    scene.add(golgiGroup);

    let cisternaCount = 6;
    let cisternae = [];

    for (let i = 0; i < cisternaCount; i++) {
      let curveFactor = 1.0 - i * 0.08;
      let scaleFactor = 1.3 - i * 0.08;
      let shape = new THREE.Shape();
      let steps = 50;

      for (let j = 0; j <= steps; j++) {
        let angle = (j / steps) * Math.PI - Math.PI / 2;
        let rad = 1.4 * scaleFactor;
        let x = Math.cos(angle) * rad;
        let z = Math.sin(angle) * rad * curveFactor - i * 0.15;
        if (j === 0) shape.moveTo(x, z);
        else shape.lineTo(x, z);
      }
      for (let j = steps; j >= 0; j--) {
        let angle = (j / steps) * Math.PI - Math.PI / 2;
        let rad = 1.15 * scaleFactor;
        let x = Math.cos(angle) * rad;
        let z = Math.sin(angle) * rad * curveFactor - i * 0.15;
        shape.lineTo(x, z);
      }

      let extrudeSettings = {
        depth: 0.22,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.04,
        bevelThickness: 0.04,
      };
      let geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geo.center();

      let mat = new THREE.MeshStandardMaterial({
        color: 0xea580c,
        roughness: 0.4,
        metalness: 0.1,
      });

      let mesh = new THREE.Mesh(geo, mat);
      mesh.position.x = (i - cisternaCount / 2) * 0.32;
      mesh.rotation.y = Math.PI / 2;
      golgiGroup.add(mesh);
      cisternae.push(mesh);
    }

    let vesicles = [];
    let vesGeo = new THREE.SphereGeometry(0.08, 16, 16);
    let vesMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.3,
    });
    for (let v = 0; v < 8; v++) {
      let ves = new THREE.Mesh(vesGeo, vesMat);
      ves.position.set(
        (Math.random() - 0.5) * 2.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 2.0,
      );
      golgiGroup.add(ves);
      vesicles.push({ mesh: ves, seed: Math.random() * 100 });
    }

    function animationLoop(t) {
      golgiGroup.rotation.y = t / 7000;
      cisternae.forEach((c, idx) => {
        c.scale.set(1, 1 + Math.sin(t / 1000 + idx) * 0.03, 1);
      });
      vesicles.forEach((v) => {
        v.mesh.position.y += Math.sin(t / 600 + v.seed) * 0.004;
        v.mesh.position.z += Math.cos(t / 800 + v.seed) * 0.004;
      });
      controls.update();
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animationLoop);
  });
</script>
