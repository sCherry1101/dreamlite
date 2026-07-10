<script>
  import { onMount, getContext } from 'svelte'
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";

  onMount(() => {
    let { scene, camera, renderer } = getContext('three')

    let controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    let ambient = new THREE.AmbientLight(0x1a1a2e, 2.5);
    scene.add(ambient);

    let light1 = new THREE.DirectionalLight(0xd8b4fe, 4.0);
    light1.position.set(5, 8, 5);
    scene.add(light1);

    let light2 = new THREE.DirectionalLight(0x00ffff, 2.0);
    light2.position.set(-5, -4, -3);
    scene.add(light2);

    let cellGroup = new THREE.Group();
    scene.add(cellGroup);

    let membraneGeo = new THREE.SphereGeometry(2.5, 64, 64);
    let membraneMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    let membrane = new THREE.Mesh(membraneGeo, membraneMat);
    cellGroup.add(membrane);

    let nucleusGeo = new THREE.SphereGeometry(0.7, 48, 48);
    let nucleusMat = new THREE.MeshStandardMaterial({
      color: 0x6b21a8,
      emissive: 0x2e1065,
      roughness: 0.5,
    });
    let nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    nucleus.position.set(-0.2, 0.1, 0);
    cellGroup.add(nucleus);

    let nucleolusGeo = new THREE.SphereGeometry(0.2, 32, 32);
    let nucleolusMat = new THREE.MeshStandardMaterial({
      color: 0xdb2777,
      roughness: 0.4,
    });
    let nucleolus = new THREE.Mesh(nucleolusGeo, nucleolusMat);
    nucleolus.position.set(0.1, 0.1, 0.1);
    nucleus.add(nucleolus);

    let mitoGroup = new THREE.Group();
    cellGroup.add(mitoGroup);
    let mitoGeo = new THREE.CapsuleGeometry(0.12, 0.3, 16, 32);
    let mitoMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.4,
    });
    let mitoPositions = [
      [1.2, 0.8, 0.5],
      [-1.1, -1.0, 0.6],
      [0.5, -1.3, -0.8],
      [-1.3, 0.9, -0.5],
      [1.0, -0.6, 1.1],
    ];
    mitoPositions.forEach((pos) => {
      let m = new THREE.Mesh(mitoGeo, mitoMat);
      m.position.set(pos[0], pos[1], pos[2]);
      m.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      );
      mitoGroup.add(m);
    });

    let golgiGroup = new THREE.Group();
    cellGroup.add(golgiGroup);
    for (let i = 0; i < 4; i++) {
      let gGeo = new THREE.TorusGeometry(
        0.35 - i * 0.04,
        0.04,
        8,
        24,
        Math.PI * 0.8,
      );
      let gMat = new THREE.MeshStandardMaterial({
        color: 0xea580c,
        roughness: 0.4,
      });
      let gMesh = new THREE.Mesh(gGeo, gMat);
      gMesh.position.set(0.9, 0.2 + i * 0.06, -0.5);
      gMesh.rotation.set(0.3, 0.5, 1.2);
      golgiGroup.add(gMesh);
    }

    let vacGeo = new THREE.SphereGeometry(0.22, 24, 24);
    let vacMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.7,
      roughness: 0.1,
    });
    let vacPositions = [
      [-0.5, 1.3, 0.7],
      [0.3, -1.2, 0.5],
      [-0.8, -0.7, -1.1],
    ];
    vacPositions.forEach((pos) => {
      let v = new THREE.Mesh(vacGeo, vacMat);
      v.position.set(pos[0], pos[1], pos[2]);
      cellGroup.add(v);
    });

    let lysoGeo = new THREE.SphereGeometry(0.14, 16, 16);
    let lysoMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      roughness: 0.5,
    });
    let lysoPositions = [
      [0.2, 1.4, -0.6],
      [-1.4, -0.2, 0.8],
      [1.4, -0.7, -0.5],
    ];
    lysoPositions.forEach((pos) => {
      let l = new THREE.Mesh(lysoGeo, lysoMat);
      l.position.set(pos[0], pos[1], pos[2]);
      cellGroup.add(l);
    });

    function animationLoop(t) {
      cellGroup.rotation.y = t / 8000;
      cellGroup.rotation.x = Math.sin(t / 10000) * 0.1;

      let posAttr = membraneGeo.attributes.position;
      let timeFactor = t / 500;
      for (let i = 0; i < posAttr.count; i++) {
        let x = posAttr.getX(i);
        let y = posAttr.getY(i);
        let z = posAttr.getZ(i);
        let wave =
          Math.sin(x * 1.5 + timeFactor) * 0.03 +
          Math.cos(y * 1.5 + timeFactor) * 0.03;
        let norm = new THREE.Vector3(x, y, z)
          .normalize()
          .multiplyScalar(2.5 + wave);
        posAttr.setXYZ(i, norm.x, norm.y, norm.z);
      }
      membraneGeo.computeVertexNormals();
      posAttr.needsUpdate = true;

      controls.update();
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animationLoop);
  });
</script>
