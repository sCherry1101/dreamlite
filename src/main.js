import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);


const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 8);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 1;
controls.maxDistance = 50;


// const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 5);
// pointLight.position.set(3, 3, 3);
// scene.add(pointLight);

const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set (5,10,7);
scene.add (directional);

const nucleusGeometry = new THREE.SphereGeometry(1.5, 64, 64);

const nucleusMaterial = new THREE.MeshStandardMaterial({
  color: 0x7b2cbf,
  emissive: 0x240046,
  transparent: true,
  opacity: 0.6,
  side: THREE.DoubleSide
});

const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
scene.add(nucleus);


const coreGeometry = new THREE.SphereGeometry(0.5, 32, 32);

const coreMaterial = new THREE.MeshStandardMaterial({
  color: 0xc77dff,
  emissive: 0x5a189a,
  metalness: 0.3,
  roughness: 0.2
});

const core = new THREE.Mesh(coreGeometry, coreMaterial);
scene.add(core);

function animate() {
  requestAnimationFrame(animate);

  controls.update();

 
  core.rotation.y += 0.01;

 
  const scale = 1 + Math.sin(Date.now() * 0.002) * 0.03;
  nucleus.scale.set(scale, scale, scale);

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});