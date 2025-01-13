import * as THREE from 'three';

let scene, camera, renderer;
let stars = [];
let beltParticles = [];

export function initThreeJS() {
  scene = new THREE.Scene();

  // Create the ship's interior
  createShipInterior();

  // Create the window and space scene
  createWindowAndSpaceScene();

  // Set up the camera inside the ship
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 1.6, 5); // Positioned inside the ship, facing the window

  const canvas = document.getElementById('spaceScene');
  renderer = new THREE.WebGLRenderer({
    canvas, 
    antialias: true
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Add ambient light inside the ship
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add point light to simulate interior lighting
  const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
  pointLight.position.set(0, 5, 0);
  scene.add(pointLight);

  animate();
}

function createShipInterior() {
  // Create the room (ship's interior)
  const roomGeometry = new THREE.BoxGeometry(10, 6, 10);
  
  // Materials for walls, floor, and ceiling
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, side: THREE.BackSide });
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x202020, side: THREE.BackSide });
  const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, side: THREE.BackSide });

  // Assign materials to each face of the box
  const materials = [
    wallMaterial, // Right side
    wallMaterial, // Left side
    ceilingMaterial, // Top side
    floorMaterial, // Bottom side
    wallMaterial, // Front side (behind the camera)
    wallMaterial  // Back side (facing the window)
  ];

  const room = new THREE.Mesh(roomGeometry, materials);
  scene.add(room);

  // Create a window by removing part of the front wall
  createWindowInWall();
}

function createWindowInWall() {
  // Create a window opening
  const windowGeometry = new THREE.PlaneGeometry(6, 3);
  const windowMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 });
  const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
  windowMesh.position.set(0, 1.6, -5.01); // Slightly beyond the wall to prevent z-fighting
  scene.add(windowMesh);
}

function createWindowAndSpaceScene() {
  // Group for the space scene
  const spaceGroup = new THREE.Group();
  spaceGroup.position.set(0, 1.6, -15); // Positioned outside the ship

  createDistantStars(spaceGroup);
  createStarfield(spaceGroup);
  createCentauriBelt3D(spaceGroup);

  scene.add(spaceGroup);
}

function createDistantStars(group) {
  // Create distant stars and add to the group
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
  group.add(distantStarField);
  stars.push(distantStarField);
}

function createStarfield(group) {
  // Create nearby stars and add to the group
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
  group.add(starField);
  stars.push(starField);
}

function createCentauriBelt3D(group) {
  // Create the Centauri Belt and add to the group
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
    group.add(particleSystem);
    beltParticles.push(particleSystem);
  }

  // Dust particles
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
  group.add(dustSystem);
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