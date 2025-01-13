import * as THREE from 'three';

let scene, camera, renderer;
let stars = [];
let beltParticles = [];

export function initThreeJS() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000); // Set scene background to pure black
  
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  
  const canvas = document.getElementById('spaceScene');
  renderer = new THREE.WebGLRenderer({
    canvas, 
    antialias: true,
    alpha: true
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  camera.position.z = 8;
  camera.position.y = 2;
  camera.lookAt(0, 0, 0);

  const ambientLight = new THREE.AmbientLight(0x101010); // Reduced ambient light
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x8888ff, 1, 100);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x4444ff, 0.8, 100);
  pointLight2.position.set(-5, -5, -5);
  scene.add(pointLight2);

  createStarfield();
  createDistantStars();
  createCentauriBelt3D();
  
  animate();
}

function createDistantStars() {
  // Create very small, distant stars
  const distantStarGeometry = new THREE.BufferGeometry();
  const distantStarMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.005, // Very small stars
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true
  });

  const distantStarVertices = [];
  for(let i = 0; i < 50000; i++) { // More stars for denser background
    const x = THREE.MathUtils.randFloatSpread(500); // Spread wider
    const y = THREE.MathUtils.randFloatSpread(500);
    const z = THREE.MathUtils.randFloatSpread(500);
    distantStarVertices.push(x, y, z);
  }

  distantStarGeometry.setAttribute('position', new THREE.Float32BufferAttribute(distantStarVertices, 3));
  const distantStarField = new THREE.Points(distantStarGeometry, distantStarMaterial);
  scene.add(distantStarField);
}

function createStarfield() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.01, // Smaller stars
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true
  });

  const starVertices = [];
  for(let i = 0; i < 30000; i++) { // More stars
    const x = THREE.MathUtils.randFloatSpread(300);
    const y = THREE.MathUtils.randFloatSpread(300);
    const z = THREE.MathUtils.randFloatSpread(300);
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  const starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);
  stars.push(starField);
}

function createCentauriBelt3D() {
  for (let i = 0; i < 5; i++) {
    const particles = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x8888ff,
      size: 0.04 - (i * 0.007),
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.6 - (i * 0.1) // Slightly reduced opacity
    });

    const particlePositions = [];
    const particleCount = 20000;
    
    for(let j = 0; j < particleCount; j++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5.6 + Math.random() * 1.8;
      const scatter = (Math.random() - 0.5) * 0.8;
      
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

  const dustGeometry = new THREE.BufferGeometry();
  const dustMaterial = new THREE.PointsMaterial({
    color: 0x4444aa,
    size: 0.1,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.15 // Reduced dust opacity
  });

  const dustPositions = [];
  for(let i = 0; i < 8000; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 5.2 + Math.random() * 2.4;
    const scatter = (Math.random() - 0.5) * 1.4;
    
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

  // Rotate stars slightly for subtle movement
  stars.forEach(starField => {
    starField.rotation.y += 0.0001;
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