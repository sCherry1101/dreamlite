<script>
  import { onMount, getContext } from 'svelte'
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";

  onMount(() => {
    let { scene, camera, renderer } = getContext('three')

    let controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    let ambient = new THREE.AmbientLight(0x0f172a, 2.0);
    scene.add(ambient);

    let light1 = new THREE.DirectionalLight(0x38bdf8, 4.0);
    light1.position.set(5, 8, 5);
    scene.add(light1);

    let light2 = new THREE.DirectionalLight(0x818cf8, 2.5);
    light2.position.set(-5, -4, -3);
    scene.add(light2);

    let modGroup = new THREE.Group();
    scene.add(modGroup);

    // Modern Curved Pavilion / Lotus Petal Structure
    let glassMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    });

    let frameMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.3,
      metalness: 0.8
    });

    // Parametric Shell Petals
    for (let i = 0; i < 8; i++) {
      let angle = (i / 8) * Math.PI * 2;
      let petalGeo = new THREE.ConeGeometry(1.2, 3.5, 4, 1, true);
      let petal = new THREE.Mesh(petalGeo, glassMat);
      petal.position.x = Math.cos(angle) * 1.2;
      petal.position.z = Math.sin(angle) * 1.2;
      petal.position.y = 0.5;
      petal.rotation.y = angle;
      petal.rotation.z = 0.4;
      modGroup.add(petal);

      // Edge Frame Accent
      let frameGeo = new THREE.TorusGeometry(1.2, 0.04, 8, 32);
      let frame = new THREE.Mesh(frameGeo, frameMat);
      frame.position.set(Math.cos(angle) * 0.6, 0, Math.sin(angle) * 0.6);
      frame.rotation.x = Math.PI / 2;
      modGroup.add(frame);
    }

    // Central Core Prism
    let coreGeo = new THREE.CylinderGeometry(0.6, 0.8, 4, 8);
    let coreMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      emissive: 0x1e1b4b,
      roughness: 0.2
    });
    let core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 0.5;
    modGroup.add(core);

    // Reflective Water Base
    let poolGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.2, 32);
    let poolMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.05,
      metalness: 0.95
    });
    let pool = new THREE.Mesh(poolGeo, poolMat);
    pool.position.y = -1.2;
    modGroup.add(pool);

    function animationLoop(t) {
      modGroup.rotation.y = t / 10000;
      controls.update();
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animationLoop);

    return () => {
      renderer.setAnimationLoop(null);
      scene.clear();
    }
  });
</script>
