<script>
  import { onMount, getContext } from 'svelte'
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";

  onMount(() => {
    let { scene, camera, renderer } = getContext('three')

    let controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    let ambient = new THREE.AmbientLight(0x142b14, 2.5);
    scene.add(ambient);

    let light1 = new THREE.DirectionalLight(0xa7f3d0, 4.5);
    light1.position.set(6, 9, 5);
    scene.add(light1);

    let light2 = new THREE.DirectionalLight(0x38bdf8, 1.5);
    light2.position.set(-6, -4, -3);
    scene.add(light2);

    let plantGroup = new THREE.Group();
    scene.add(plantGroup);

    let wallGeo = new THREE.BoxGeometry(4.6, 4.6, 4.6);
    let wallMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.6,
      metalness: 0.1,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    });
    let cellWall = new THREE.Mesh(wallGeo, wallMat);
    plantGroup.add(cellWall);

    let wallWireMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    let cellWallWire = new THREE.Mesh(wallGeo, wallWireMat);
    plantGroup.add(cellWallWire);

    let vacGeo = new THREE.BoxGeometry(1.8, 2.4, 1.8);
    let vacMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x075985,
      roughness: 0.1,
      transparent: true,
      opacity: 0.6,
    });
    let centralVacuole = new THREE.Mesh(vacGeo, vacMat);
    centralVacuole.position.set(0, -0.2, 0);
    plantGroup.add(centralVacuole);

    let nucleusGeo = new THREE.SphereGeometry(0.65, 48, 48);
    let nucleusMat = new THREE.MeshStandardMaterial({
      color: 0x6b21a8,
      emissive: 0x3b0764,
      roughness: 0.5,
    });
    let nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    nucleus.position.set(1.2, 0.9, 0.8);
    plantGroup.add(nucleus);

    let nucleolusGeo = new THREE.SphereGeometry(0.18, 32, 32);
    let nucleolusMat = new THREE.MeshStandardMaterial({ color: 0xdb2777 });
    let nucleolus = new THREE.Mesh(nucleolusGeo, nucleolusMat);
    nucleolus.position.set(-0.08, 0.08, 0.08);
    nucleus.add(nucleolus);

    let erGroup = new THREE.Group();
    erGroup.position.copy(nucleus.position);
    plantGroup.add(erGroup);

    for (let i = 0; i < 3; i++) {
      let erRadius = 0.75 + i * 0.15;
      let erGeo = new THREE.TorusGeometry(erRadius, 0.05, 8, 32, Math.PI * 1.2);
      let erMat = new THREE.MeshStandardMaterial({
        color: 0xe8b49f,
        emissive: 0x2d1b18,
        roughness: 0.5,
        side: THREE.DoubleSide,
      });
      let erMesh = new THREE.Mesh(erGeo, erMat);
      erMesh.rotation.set(Math.PI / 2, Math.random() * 0.5, i * 0.4);
      erGroup.add(erMesh);

      for (let r = 0; r < 8; r++) {
        let riboGeo = new THREE.SphereGeometry(0.025, 6, 6);
        let riboMat = new THREE.MeshStandardMaterial({ color: 0xd97706 });
        let ribo = new THREE.Mesh(riboGeo, riboMat);
        let angle = Math.random() * Math.PI * 1.2;
        ribo.position.set(
          Math.cos(angle) * erRadius,
          (Math.random() - 0.5) * 0.08,
          Math.sin(angle) * erRadius,
        );
        erGroup.add(ribo);
      }
    }

    let chloroGroup = new THREE.Group();
    plantGroup.add(chloroGroup);
    let chloroGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.14, 24);
    let chloroMat = new THREE.MeshStandardMaterial({
      color: 0x16a34a,
      roughness: 0.4,
    });
    let chloroPositions = [
      [-1.4, 1.4, 1.2],
      [-1.5, -1.2, 0.8],
      [1.3, -1.4, 1.0],
      [-1.2, 1.3, -1.4],
      [1.5, -1.1, -0.9],
      [-1.6, 0.2, -1.1],
    ];
    chloroPositions.forEach((pos) => {
      let c = new THREE.Mesh(chloroGeo, chloroMat);
      c.position.set(pos[0], pos[1], pos[2]);
      c.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      );
      chloroGroup.add(c);
    });

    let mitoGeo = new THREE.CapsuleGeometry(0.1, 0.24, 16, 32);
    let mitoMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.4,
    });
    let mitoPositions = [
      [-1.3, 1.2, -0.5],
      [-1.2, -1.5, -0.5],
      [1.4, -0.2, -1.4],
      [-0.5, 1.6, 0.8],
    ];
    mitoPositions.forEach((pos) => {
      let m = new THREE.Mesh(mitoGeo, mitoMat);
      m.position.set(pos[0], pos[1], pos[2]);
      m.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      );
      plantGroup.add(m);
    });

    function animationLoop(t) {
      plantGroup.rotation.y = t / 9000;
      plantGroup.rotation.x = Math.sin(t / 11000) * 0.08;

      erGroup.children.forEach((child, index) => {
        if (
          child instanceof THREE.Mesh &&
          child.geometry instanceof THREE.TorusGeometry
        ) {
          let scaleFactor = 1 + Math.sin(t / 1000 + index) * 0.02;
          child.scale.set(scaleFactor, scaleFactor, 1);
        }
      });

      let vacPosAttr = vacGeo.attributes.position;
      let timeFactor = t / 400;
      for (let i = 0; i < vacPosAttr.count; i++) {
        let x = vacPosAttr.getX(i);
        let y = vacPosAttr.getY(i);
        let z = vacPosAttr.getZ(i);
        let wave =
          Math.sin(x * 2.0 + timeFactor) * 0.02 +
          Math.cos(y * 2.0 + timeFactor) * 0.02;
        vacPosAttr.setY(i, y + wave * 0.1);
      }
      vacGeo.computeVertexNormals();
      vacPosAttr.needsUpdate = true;

      controls.update();
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animationLoop);
  });
</script>
