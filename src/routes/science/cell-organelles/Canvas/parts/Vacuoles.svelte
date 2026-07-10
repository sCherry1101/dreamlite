<script>
  import { onMount, getContext } from 'svelte'
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";

  onMount(() => {
    let { scene, camera, renderer } = getContext('three')

    let controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    let ambient = new THREE.AmbientLight(0x0c4a6e, 3.0);
    scene.add(ambient);

    let dLight = new THREE.DirectionalLight(0x38bdf8, 5.0);
    dLight.position.set(3, 5, 4);
    scene.add(dLight);

    let vacGeo = new THREE.SphereGeometry(1.3, 64, 64);
    let vacMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
    });
    let vacuoleMesh = new THREE.Mesh(vacGeo, vacMat);
    scene.add(vacuoleMesh);

    function animationLoop(t) {
      let posAttr = vacGeo.attributes.position;
      let timeFactor = t / 400;

      for (let i = 0; i < posAttr.count; i++) {
        let x = posAttr.getX(i);
        let y = posAttr.getY(i);
        let z = posAttr.getZ(i);

        let wave =
          Math.sin(x * 2.0 + timeFactor) * 0.04 +
          Math.cos(z * 2.0 + timeFactor) * 0.04;
        let normalVec = new THREE.Vector3(x, y, z)
          .normalize()
          .multiplyScalar(1.3 + wave);
        posAttr.setXYZ(i, normalVec.x, normalVec.y, normalVec.z);
      }
      vacGeo.computeVertexNormals();
      posAttr.needsUpdate = true;

      vacuoleMesh.rotation.y = t / 12000;

      controls.update();
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animationLoop);
  });
</script>
