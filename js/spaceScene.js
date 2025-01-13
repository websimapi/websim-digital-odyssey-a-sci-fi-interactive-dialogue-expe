import * as THREE from 'three';

let scene, camera, renderer;
let stars = [];
let belt = [];
let beltParticles = [];

export function initThreeJS() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  const canvas = document.getElementById('spaceScene');
  renderer = new THREE.WebGLRenderer({canvas, antialias: true});
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  
  camera.position.z = 5;

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  createStarfield();
  createCentauriBelt3D();
  
  animate();
}

function createStarfield() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.02
  });

  const starVertices = [];
  for(let i = 0; i < 10000; i++) {
    const x = THREE.MathUtils.randFloatSpread(100);
    const y = THREE.MathUtils.randFloatSpread(100); 
    const z = THREE.MathUtils.randFloatSpread(100);
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  const starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);
  stars.push(starField);
}

function createCentauriBelt3D() {
  const ringGeometry = new THREE.TorusGeometry(3, 0.4, 16, 100);
  const ringMaterial = new THREE.MeshPhongMaterial({
    color: 0x444455,
    opacity: 0.6,
    transparent: true
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
  belt.push(ring);

  const particles = new THREE.BufferGeometry();
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x8888ff,
    size: 0.03,
    blending: THREE.AdditiveBlending,
    transparent: true
  });

  const particlePositions = [];
  for(let i = 0; i < 10000; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 2.8 + Math.random() * 0.8;
    const scatter = (Math.random() - 0.5) * 0.3;
    
    const x = Math.cos(angle) * radius;
    const y = scatter;
    const z = Math.sin(angle) * radius;
    
    particlePositions.push(x, y, z);
  }

  particles.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);
  beltParticles.push(particleSystem);
}

function animate() {
  requestAnimationFrame(animate);

  belt.forEach(obj => {
    obj.rotation.y += 0.001;
  });

  beltParticles.forEach(particles => {
    particles.rotation.y += 0.001;
  });

  renderer.render(scene, camera);
}

export function onWindowResize() {
  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
}