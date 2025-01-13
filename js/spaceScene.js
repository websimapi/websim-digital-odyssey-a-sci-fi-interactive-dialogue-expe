import * as THREE from 'three';

let scene, camera, renderer;
let stars = [];
let beltParticles = [];
let shipInterior;
let nova;
let cameraTarget = new THREE.Vector3(0, 2, 0);
let isTransitioning = false;

export function initThreeJS() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  
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

  const ambientLight = new THREE.AmbientLight(0x101010);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x8888ff, 1, 100);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x4444ff, 0.8, 100);
  pointLight2.position.set(-5, -5, -5);
  scene.add(pointLight2);

  createShipInterior();
  createNovaModel();
  createStarfield();
  createDistantStars();
  createCentauriBelt3D();
  
  animate();
}

function createShipInterior() {
  // Create room geometry
  const roomGeometry = new THREE.BoxGeometry(20, 10, 30);
  const roomMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.8,
    roughness: 0.2,
    side: THREE.BackSide
  });
  shipInterior = new THREE.Mesh(roomGeometry, roomMaterial);
  shipInterior.position.set(0, 2, 0);
  scene.add(shipInterior);

  // Create window frame
  const windowFrameGeometry = new THREE.BoxGeometry(10, 6, 0.5);
  const windowFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0x444444,
    metalness: 0.9,
    roughness: 0.1
  });
  const windowFrame = new THREE.Mesh(windowFrameGeometry, windowFrameMaterial);
  windowFrame.position.set(0, 2, -14.7);
  scene.add(windowFrame);
}

function createNovaModel() {
  // Create simple placeholder for Nova
  const novaGeometry = new THREE.CapsuleGeometry(0.5, 1.5, 1, 4);
  const novaMaterial = new THREE.MeshStandardMaterial({ color: 0x8aadf4 });
  nova = new THREE.Mesh(novaGeometry, novaMaterial);
  nova.position.set(0, 0.75, -12);
  scene.add(nova);
}

function createStarfield() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.01, 
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true
  });

  const starVertices = [];
  for(let i = 0; i < 30000; i++) { 
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

function createDistantStars() {
  // Create very small, distant stars
  const distantStarGeometry = new THREE.BufferGeometry();
  const distantStarMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.005, 
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true
  });

  const distantStarVertices = [];
  for(let i = 0; i < 50000; i++) { 
    const x = THREE.MathUtils.randFloatSpread(500); 
    const y = THREE.MathUtils.randFloatSpread(500);
    const z = THREE.MathUtils.randFloatSpread(500);
    distantStarVertices.push(x, y, z);
  }

  distantStarGeometry.setAttribute('position', new THREE.Float32BufferAttribute(distantStarVertices, 3));
  const distantStarField = new THREE.Points(distantStarGeometry, distantStarMaterial);
  scene.add(distantStarField);
}

function createCentauriBelt3D() {
  for (let i = 0; i < 5; i++) {
    const particles = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x8888ff,
      size: 0.04 - (i * 0.007),
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.6 - (i * 0.1) 
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
    opacity: 0.15 
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

export function transitionToFullScene() {
  isTransitioning = true;
  const dialogueBox = document.querySelector('.dialogue-box');
  const portraits = document.querySelectorAll('.character-portrait');
  
  dialogueBox.style.opacity = '0';
  portraits.forEach(portrait => portrait.style.display = 'none');
  
  setTimeout(() => {
    dialogueBox.style.display = 'none';
  }, 1000);
}

function animate() {
  requestAnimationFrame(animate);

  if (isTransitioning) {
    // Smoothly move camera back
    camera.position.z += 0.1;
    camera.position.y += 0.05;
    
    // Look at Nova
    camera.lookAt(cameraTarget);
  }

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