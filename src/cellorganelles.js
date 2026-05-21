import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

var container = document.getElementById('nucleus_dia');

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x010103);
scene.fog = new THREE.FogExp2(0x010103, 0.12);

var camera = new THREE.PerspectiveCamera(30, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(3, 4, 8);
camera.lookAt(scene.position);

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(container.clientWidth - 16, container.clientHeight - 16);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setAnimationLoop(animationLoop);
container.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 0.8;
controls.maxDistance = 12;

var ambientLight = new THREE.AmbientLight(0x0d071a, 3.0);
scene.add(ambientLight);

var light1 = new THREE.DirectionalLight(0xd8b4fe, 6.0);
light1.position.set(5, 7, 4);
scene.add(light1);

var light2 = new THREE.DirectionalLight(0x00ffff, 2.5);
light2.position.set(-5, -3, -2);
scene.add(light2);

var innerGlowLight = new THREE.PointLight(0xbd66ff, 4.0, 4.0);
innerGlowLight.position.set(0, 0, 0);
scene.add(innerGlowLight);

var nucleusGroup = new THREE.Group();
scene.add(nucleusGroup);

var envelopeGeo = new THREE.SphereGeometry(2, 64, 64);
var envelopeMat = new THREE.MeshStandardMaterial({
    color: 0x2e085c,
    emissive: 0x070114,
    roughness: 0.4,
    metalness: 0.1,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide
});
var nuclearEnvelope = new THREE.Mesh(envelopeGeo, envelopeMat);
nucleusGroup.add(nuclearEnvelope);

var fluidGeo = new THREE.SphereGeometry(1.92, 64, 64);
var fluidMat = new THREE.MeshStandardMaterial({
    color: 0x411175,
    emissive: 0x130226,
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide
});
var nucleoplasmFluid = new THREE.Mesh(fluidGeo, fluidMat);
nucleusGroup.add(nucleoplasmFluid);

var coreGroup = new THREE.Group();
nucleusGroup.add(coreGroup);

var nucleolusGeo = new THREE.SphereGeometry(0.55, 64, 64);
var nucleolusMat = new THREE.MeshStandardMaterial({
    color: 0x8a00c2,
    emissive: 0x2d0044,
    roughness: 0.6,
    metalness: 0.2,
    flatShading: true
});
var nucleolus = new THREE.Mesh(nucleolusGeo, nucleolusMat);
coreGroup.add(nucleolus);

var strandsGroup = new THREE.Group();
coreGroup.add(strandsGroup);

var strandCount = 28;
var pointsPerStrand = 24;
var strandCurves = [];

for (let s = 0; s < strandCount; s++) {
    var points = [];
    var phiStart = Math.random() * Math.PI;
    var thetaStart = Math.random() * Math.PI * 2;
    
    for (let p = 0; p < pointsPerStrand; p++) {
        var t = p / (pointsPerStrand - 1);
        var phi = phiStart + (Math.random() - 0.5) * 0.5;
        var theta = thetaStart + t * Math.PI * 1.2;
        var r = 0.6 + t * 0.5 + Math.sin(t * Math.PI) * 0.12;

        var x = r * Math.sin(phi) * Math.cos(theta);
        var y = r * Math.sin(phi) * Math.sin(theta);
        var z = r * Math.cos(phi);
        points.push(new THREE.Vector3(x, y, z));
    }

    var curve = new THREE.CatmullRomCurve3(points);
    var tubeGeo = new THREE.TubeGeometry(curve, 32, 0.012, 6, false);
    var tubeMat = new THREE.MeshStandardMaterial({
        color: 0xf3e8ff,
        emissive: 0x3b0b5a,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9
    });
    
    var strandMesh = new THREE.Mesh(tubeGeo, tubeMat);
    strandsGroup.add(strandMesh);
    
    strandCurves.push({
        mesh: strandMesh,
        basePoints: points,
        speed: 0.8 + Math.random() * 1.4,
        phase: Math.random() * Math.PI
    });
}

var particulateCount = 80;
var particulateGeo = new THREE.BufferGeometry();
var particulatePositions = new Float32Array(particulateCount * 3);

for (let i = 0; i < particulateCount * 3; i += 3) {
    var u = Math.random();
    var th = Math.random() * Math.PI * 2;
    var ph = Math.acos(2 * Math.random() - 1);
    var r = 0.6 + u * 1.2;

    particulatePositions[i] = r * Math.sin(ph) * Math.cos(th);
    particulatePositions[i + 1] = r * Math.sin(ph) * Math.sin(th);
    particulatePositions[i + 2] = r * Math.cos(ph);
}

particulateGeo.setAttribute('position', new THREE.BufferAttribute(particulatePositions, 3));
var particulateMat = new THREE.PointsMaterial({
    color: 0xe9d5ff,
    size: 0.025,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});
var particulates = new THREE.Points(particulateGeo, particulateMat);
coreGroup.add(particulates);

function animationLoop(t) {
    nucleusGroup.rotation.y = t / 6000;
    
    var posAttribute = fluidGeo.attributes.position;
    var timeFactor = t / 300;
    for (let i = 0; i < posAttribute.count; i++) {
        var x = posAttribute.getX(i);
        var y = posAttribute.getY(i);
        var z = posAttribute.getZ(i);
        
        var wave = Math.sin(x * 2.5 + timeFactor) * 0.035 + Math.cos(y * 2.5 + timeFactor) * 0.035;
        var vector = new THREE.Vector3(x, y, z).normalize().multiplyScalar(1.92 + wave);
        posAttribute.setXYZ(i, vector.x, vector.y, vector.z);
    }
    fluidGeo.computeVertexNormals();
    posAttribute.needsUpdate = true;

    for (let s = 0; s < strandCurves.length; s++) {
        var sc = strandCurves[s];
        var dynamicPoints = [];
        var offsetTime = (t / 1000) * sc.speed + sc.phase;

        for (let p = 0; p < pointsPerStrand; p++) {
            var bp = sc.basePoints[p];
            var shift = Math.sin(p * 0.4 + offsetTime) * 0.025;
            
            dynamicPoints.push(new THREE.Vector3(
                bp.x + shift,
                bp.y + Math.cos(p * 0.4 + offsetTime) * 0.025,
                bp.z + shift
            ));
        }
        
        var newCurve = new THREE.CatmullRomCurve3(dynamicPoints);
        sc.mesh.geometry.dispose();
        sc.mesh.geometry = new THREE.TubeGeometry(newCurve, 32, 0.012, 6, false);
    }

    coreGroup.rotation.x = Math.sin(t / 4000) * 0.04;
    coreGroup.rotation.z = Math.cos(t / 4500) * 0.04;

    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth - 16, container.clientHeight - 16);
});