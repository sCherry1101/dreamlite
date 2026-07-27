<script>
  import { onMount, getContext } from 'svelte'
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";

  onMount(() => {
    let { scene, camera, renderer } = getContext('three')

    let controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    let ambient = new THREE.AmbientLight(0xffecd1, 2.0);
    scene.add(ambient);

    let light1 = new THREE.DirectionalLight(0xfbbf24, 3.5);
    light1.position.set(6, 10, 6);
    scene.add(light1);

    let light2 = new THREE.DirectionalLight(0x38bdf8, 1.5);
    light2.position.set(-6, -4, -4);
    scene.add(light2);

    let archGroup = new THREE.Group();
    scene.add(archGroup);

    // Base Plinth (Jagati)
    let baseGeo = new THREE.BoxGeometry(4, 0.4, 4);
    let stoneMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.7,
      metalness: 0.1
    });
    let base = new THREE.Mesh(baseGeo, stoneMat);
    base.position.y = -1;
    archGroup.add(base);

    // Inner Sanctum (Garbhagriha)
    let sanctumGeo = new THREE.BoxGeometry(2.4, 1.6, 2.4);
    let sanctumMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.6
    });
    let sanctum = new THREE.Mesh(sanctumGeo, sanctumMat);
    sanctum.position.y = 0;
    archGroup.add(sanctum);

    // Shikhara (Tower Tiers)
    for (let i = 0; i < 5; i++) {
      let scale = 2.2 - i * 0.35;
      let height = 0.5;
      let tierGeo = new THREE.BoxGeometry(scale, height, scale);
      let tierMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xd97706 : 0x92400e,
        roughness: 0.5
      });
      let tier = new THREE.Mesh(tierGeo, tierMat);
      tier.position.y = 0.8 + height / 2 + i * 0.45;
      archGroup.add(tier);
    }

    // Amalaka & Kalasha (Cap Stone and Crown)
    let amalakaGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.25, 16);
    let crownMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      roughness: 0.3
    });
    let amalaka = new THREE.Mesh(amalakaGeo, crownMat);
    amalaka.position.y = 3.3;
    archGroup.add(amalaka);

    let kalashaGeo = new THREE.ConeGeometry(0.3, 0.5, 16);
    let kalasha = new THREE.Mesh(kalashaGeo, crownMat);
    kalasha.position.y = 3.7;
    archGroup.add(kalasha);

    // Surrounding Pillars (Mandapa Pillars)
    let pillarGeo = new THREE.CylinderGeometry(0.12, 0.15, 1.6, 12);
    let pillarMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.6 });
    let offsets = [[-1.6, -1.6], [1.6, -1.6], [-1.6, 1.6], [1.6, 1.6]];
    offsets.forEach(([x, z]) => {
      let p = new THREE.Mesh(pillarGeo, pillarMat);
      p.position.set(x, 0, z);
      archGroup.add(p);
    });

    function animationLoop(t) {
      archGroup.rotation.y = t / 9000;
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
