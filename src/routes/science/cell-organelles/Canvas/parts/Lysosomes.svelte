<script>
  import { onMount, getContext } from 'svelte'
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";

  onMount(() => {
    let { scene, camera, renderer } = getContext('three')

    let controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    let ambient = new THREE.AmbientLight(0x450a0a, 3.0);
    scene.add(ambient);

    let dLight = new THREE.DirectionalLight(0xdc2626, 6.0);
    dLight.position.set(4, 5, 3);
    scene.add(dLight);

    let pLight = new THREE.PointLight(0xd97706, 5.0, 4.0);
    pLight.position.set(0, 0, 0);
    scene.add(pLight);

    let lysoGroup = new THREE.Group();
    scene.add(lysoGroup);

    let mainSphereGeo = new THREE.SphereGeometry(1.2, 64, 64);
    let mainSphereMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    let membrane = new THREE.Mesh(mainSphereGeo, mainSphereMat);
    lysoGroup.add(membrane);

    let enzymeGroup = new THREE.Group();
    lysoGroup.add(enzymeGroup);

    let enzymeCount = 35;
    let enzymes = [];
    let enzGeo = new THREE.SphereGeometry(0.08, 8, 8);
    let enzMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      flatShading: true,
    });

    for (let i = 0; i < enzymeCount; i++) {
      let mesh = new THREE.Mesh(enzGeo, enzMat);
      let u = Math.random();
      let th = Math.random() * Math.PI * 2;
      let ph = Math.acos(2 * Math.random() - 1);
      let r = u * 0.95;

      mesh.position.set(
        r * Math.sin(ph) * Math.cos(th),
        r * Math.sin(ph) * Math.sin(th),
        r * Math.cos(ph),
      );
      enzymeGroup.add(mesh);
      enzymes.push({
        mesh: mesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
        ),
      });
    }

    function animationLoop(t) {
      lysoGroup.rotation.y = t / 9000;
      enzymeGroup.rotation.x = t / 12000;

      enzymes.forEach((e) => {
        e.mesh.position.add(e.velocity);
        if (e.mesh.position.length() > 0.98) {
          e.velocity.reflect(e.mesh.position.clone().normalize());
        }
      });

      controls.update();
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animationLoop);
  });
</script>
