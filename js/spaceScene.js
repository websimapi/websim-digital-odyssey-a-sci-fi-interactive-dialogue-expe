import * as THREE from 'three';

let scene, camera, renderer;
let stars = [];
let belt = [];
let beltParticles = [];

export function initThreeJS() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  
  const canvas = document.getElementById('spaceScene');
  renderer = new THREE.WebGLRenderer({
    canvas, 
    antialias: true,
    alpha: true
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  // Position camera to see full belt
  camera.position.z = 8;
  camera.position.y = 2;
  camera.lookAt(0, 0, 0);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  // Add point lights for better belt illumination
  const pointLight1 = new THREE.PointLight(0x8888ff, 1, 100);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x4444ff, 0.8, 100);
  pointLight2.position.set(-5, -5, -5);
  scene.add(pointLight2);

  createStarfield();
  createCentauriBelt3D();
  
  animate();
}

function createStarfield() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.015,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  });

  const starVertices = [];
  for(let i = 0; i < 20000; i++) {
    const x = THREE.MathUtils.randFloatSpread(200);
    const y = THREE.MathUtils.randFloatSpread(200); 
    const z = THREE.MathUtils.randFloatSpread(200);
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  const starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);
  stars.push(starField);
}

function createCentauriBelt3D() {
  // Main belt ring
  const ringGeometry = new THREE.TorusGeometry(6, 0.8, 32, 200);
  const ringMaterial = new THREE.MeshPhongMaterial({
    color: 0x444455,
    opacity: 0.6,
    transparent: true,
    shininess: 50,
    specular: 0x4444ff
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
  belt.push(ring);

  // Create multiple particle systems for more depth
  for (let i = 0; i < 3; i++) {
    const particles = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x8888ff,
      size: 0.03 - (i * 0.01),
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8 - (i * 0.2)
    });

    const particlePositions = [];
    const particleCount = 15000;
    
    for(let j = 0; j < particleCount; j++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5.6 + Math.random() * 1.6;
      const scatter = (Math.random() - 0.5) * 0.6;
      
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

  // Add dust clouds
  const dustGeometry = new THREE.BufferGeometry();
  const dustMaterial = new THREE.PointsMaterial({
    color: 0x4444aa,
    size: 0.1,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.2
  });

  const dustPositions = [];
  for(let i = 0; i < 5000; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 5.2 + Math.random() * 2.4;
    const scatter = (Math.random() - 0.5) * 1.2;
    
    const x = Math.cos(angle) * radius;
    const y = scatter;
    const z = Math.sin(angle) * radius;
    
    dustPositions.push(x, y, z);
  }

  dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustPositions, 3));
  const dustSystem = new THREE.Points(dustGeometry, dustMaterial);
  scene.add(dustSystem);
  beltParticles.push(dustSystem);
}

function animate() {
  requestAnimationFrame(animate);

  belt.forEach(obj => {
    obj.rotation.y += 0.0005;
  });

  beltParticles.forEach((particles, index) => {
    particles.rotation.y += 0.0005 + (index * 0.0001);
  });

  renderer.render(scene, camera);
}

export function onWindowResize() {
  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
}