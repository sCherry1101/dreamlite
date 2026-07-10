<script>
  import { onMount, getContext } from 'svelte'
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";

  onMount(() => {
    let { scene, camera, renderer } = getContext('three')

    scene.fog = new THREE.FogExp2(0x010103, 0.12);

    let controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 0.8;
    controls.maxDistance = 12;

    let ambientLight = new THREE.AmbientLight(0x0d071a, 3.0);
    scene.add(ambientLight);

    let light1 = new THREE.DirectionalLight(0xd8b4fe, 6.0);
    light1.position.set(5, 7, 4);
    scene.add(light1);

    let light2 = new THREE.DirectionalLight(0x00ffff, 2.5);
    light2.position.set(-5, -3, -2);
    scene.add(light2);

    let innerGlowLight = new THREE.PointLight(0xbd66ff, 4.0, 4.0);
    innerGlowLight.position.set(0, 0, 0);
    scene.add(innerGlowLight);

    let nucleusGroup = new THREE.Group();
    scene.add(nucleusGroup);

    let envelopeGeo = new THREE.SphereGeometry(2, 64, 64);
    let envelopeMat = new THREE.MeshStandardMaterial({
      color: 0x2e085c,
      emissive: 0x070114,
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });
    let nuclearEnvelope = new THREE.Mesh(envelopeGeo, envelopeMat);
    nucleusGroup.add(nuclearEnvelope);

    let fluidGeo = new THREE.SphereGeometry(1.92, 64, 64);
    let fluidMat = new THREE.MeshStandardMaterial({
      color: 0x411175,
      emissive: 0x130226,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    let nucleoplasmFluid = new THREE.Mesh(fluidGeo, fluidMat);
    nucleusGroup.add(nucleoplasmFluid);

    let coreGroup = new THREE.Group();
    nucleusGroup.add(coreGroup);

    let nucleolusGeo = new THREE.SphereGeometry(0.55, 64, 64);
    let nucleolusMat = new THREE.MeshStandardMaterial({
      color: 0x8a00c2,
      emissive: 0x2d0044,
      roughness: 0.6,
      metalness: 0.2,
      flatShading: true,
    });
    let nucleolus = new THREE.Mesh(nucleolusGeo, nucleolusMat);
    coreGroup.add(nucleolus);

    let strandsGroup = new THREE.Group();
    coreGroup.add(strandsGroup);

    let strandCount = 28;
    let pointsPerStrand = 24;
    let strandCurves = [];

    for (let s = 0; s < strandCount; s++) {
      let points = [];
      let phiStart = Math.random() * Math.PI;
      let thetaStart = Math.random() * Math.PI * 2;

      for (let p = 0; p < pointsPerStrand; p++) {
        let t = p / (pointsPerStrand - 1);
        let phi = phiStart + (Math.random() - 0.5) * 0.5;
        let theta = thetaStart + t * Math.PI * 1.2;
        let r = 0.6 + t * 0.5 + Math.sin(t * Math.PI) * 0.12;

        let x = r * Math.sin(phi) * Math.cos(theta);
        let y = r * Math.sin(phi) * Math.sin(theta);
        let z = r * Math.cos(phi);
        points.push(new THREE.Vector3(x, y, z));
      }

      let curve = new THREE.CatmullRomCurve3(points);
      let tubeGeo = new THREE.TubeGeometry(curve, 32, 0.012, 6, false);
      let tubeMat = new THREE.MeshStandardMaterial({
        color: 0xf3e8ff,
        emissive: 0x3b0b5a,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9,
      });

      let strandMesh = new THREE.Mesh(tubeGeo, tubeMat);
      strandsGroup.add(strandMesh);

      strandCurves.push({
        mesh: strandMesh,
        basePoints: points,
        speed: 0.8 + Math.random() * 1.4,
        phase: Math.random() * Math.PI,
      });
    }

    let particulateCount = 80;
    let particulateGeo = new THREE.BufferGeometry();
    let particulatePositions = new Float32Array(particulateCount * 3);

    for (let i = 0; i < particulateCount * 3; i += 3) {
      let u = Math.random();
      let th = Math.random() * Math.PI * 2;
      let ph = Math.acos(2 * Math.random() - 1);
      let r = 0.6 + u * 1.2;

      particulatePositions[i] = r * Math.sin(ph) * Math.cos(th);
      particulatePositions[i + 1] = r * Math.sin(ph) * Math.sin(th);
      particulatePositions[i + 2] = r * Math.cos(ph);
    }

    particulateGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particulatePositions, 3),
    );
    let particulateMat = new THREE.PointsMaterial({
      color: 0xe9d5ff,
      size: 0.025,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    let particulates = new THREE.Points(particulateGeo, particulateMat);
    coreGroup.add(particulates);

    function animationLoop(t) {
      nucleusGroup.rotation.y = t / 6000;

      let posAttribute = fluidGeo.attributes.position;
      let timeFactor = t / 300;
      for (let i = 0; i < posAttribute.count; i++) {
        let x = posAttribute.getX(i);
        let y = posAttribute.getY(i);
        let z = posAttribute.getZ(i);

        let wave =
          Math.sin(x * 2.5 + timeFactor) * 0.035 +
          Math.cos(y * 2.5 + timeFactor) * 0.035;
        let vector = new THREE.Vector3(x, y, z)
          .normalize()
          .multiplyScalar(1.92 + wave);
        posAttribute.setXYZ(i, vector.x, vector.y, vector.z);
      }
      fluidGeo.computeVertexNormals();
      posAttribute.needsUpdate = true;

      for (let s = 0; s < strandCurves.length; s++) {
        let sc = strandCurves[s];
        let dynamicPoints = [];
        let offsetTime = (t / 1000) * sc.speed + sc.phase;

        for (let p = 0; p < pointsPerStrand; p++) {
          let bp = sc.basePoints[p];
          let shift = Math.sin(p * 0.4 + offsetTime) * 0.025;

          dynamicPoints.push(
            new THREE.Vector3(
              bp.x + shift,
              bp.y + Math.cos(p * 0.4 + offsetTime) * 0.025,
              bp.z + shift,
            ),
          );
        }

        let newCurve = new THREE.CatmullRomCurve3(dynamicPoints);
        sc.mesh.geometry.dispose();
        sc.mesh.geometry = new THREE.TubeGeometry(
          newCurve,
          32,
          0.012,
          6,
          false,
        );
      }

      coreGroup.rotation.x = Math.sin(t / 4000) * 0.04;
      coreGroup.rotation.z = Math.cos(t / 4500) * 0.04;

      controls.update();
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animationLoop);
  });
</script>
