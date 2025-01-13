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
  camera.position.y = 2;
  camera.rotation.x = -0.3;

  const ambientLight = new THREE.AmbientLight(0x404040);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 5, 5);
  scene.add(ambientLight, directionalLight);

  createStarfield();
  createCentauriBelt3D();
  
  animate();
}

function createStarfield() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.02,
    sizeAttenuation: true
  });

  const starVertices = [];
  for(let i = 0; i < 15000; i++) {
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
  // Create main belt ring with more detail
  const ringGeometry = new THREE.TorusGeometry(3, 0.6, 32, 200);
  const ringMaterial = new THREE.MeshPhongMaterial({
    color: 0x666677,
    opacity: 0.8,
    transparent: true,
    shininess: 50,
    specular: 0x444455
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 3;
  ring.rotation.y = Math.PI / 6;
  scene.add(ring);
  belt.push(ring);

  // Add multiple particle systems for a more complex dust effect
  const createDustLayer = (radius, count, size, color) => {
    const particles = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({
      color: color,
      size: size,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.6
    });

    const particlePositions = [];
    for(let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 1.2;
      const scatter = (Math.random() - 0.5) * 0.4;
      
      const x = Math.cos(angle) * r;
      const y = scatter;
      const z = Math.sin(angle) * r;
      
      particlePositions.push(x, y, z);
    }

    particles.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    const particleSystem = new THREE.Points(particles, particleMaterial);
    particleSystem.rotation.x = Math.PI / 3;
    particleSystem.rotation.y = Math.PI / 6;
    scene.add(particleSystem);
    beltParticles.push(particleSystem);
  };

  // Create multiple dust layers
  createDustLayer(2.8, 8000, 0.03, 0x8888ff);
  createDustLayer(3.0, 6000, 0.02, 0xaaaaff);
  createDustLayer(3.2, 4000, 0.015, 0x6666ff);
}

function animate() {
  requestAnimationFrame(animate);

  // Rotate belt with varying speeds
  belt.forEach(obj => {
    obj.rotation.y += 0.001;
  });

  // Rotate particle systems with slightly different speeds
  beltParticles.forEach((particles, index) => {
    particles.rotation.y += 0.001 + (index * 0.0001);
  });

  renderer.render(scene, camera);
}

export function onWindowResize() {
  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
}