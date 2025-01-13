import * as THREE from 'three';

let spaceScene, spaceCamera, shipScene, shipCamera, renderer;
let stars = [];
let beltParticles = [];
let shipRoom, windowMesh;

export function initThreeJS() {
  // Initialize renderer
  const canvas = document.getElementById('spaceScene');
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.autoClear = false;

  // Initialize space scene (the view through the window)
  spaceScene = new THREE.Scene();
  spaceScene.background = new THREE.Color(0x000000);
  
  spaceCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  spaceCamera.position.z = 8;
  spaceCamera.position.y = 2;
  spaceCamera.lookAt(0, 0, 0);

  // Initialize ship interior scene
  shipScene = new THREE.Scene();
  shipCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  shipCamera.position.z = 10;
  shipCamera.position.y = 2;

  // Create ship interior
  createShipInterior();
  
  // Add lights to space scene
  const ambientLight = new THREE.AmbientLight(0x101010);
  spaceScene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x8888ff, 1, 100);
  pointLight1.position.set(5, 5, 5);
  spaceScene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x4444ff, 0.8, 100);
  pointLight2.position.set(-5, -5, -5);
  spaceScene.add(pointLight2);

  // Add lights to ship scene
  const shipAmbient = new THREE.AmbientLight(0x333333);
  shipScene.add(shipAmbient);

  const shipLight = new THREE.PointLight(0x6666ff, 0.8, 20);
  shipLight.position.set(0, 5, 5);
  shipScene.add(shipLight);

  createStarfield();
  createDistantStars();
  createCentauriBelt3D();
  
  animate();
}

function createShipInterior() {
  // Create room geometry
  const roomGeometry = new THREE.BoxGeometry(20, 15, 20);
  const roomMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.8,
    roughness: 0.2,
    side: THREE.BackSide
  });
  shipRoom = new THREE.Mesh(roomGeometry, roomMaterial);
  shipScene.add(shipRoom);

  // Add window frame
  const frameGeometry = new THREE.BoxGeometry(12, 8, 0.5);
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x444444,
    metalness: 0.9,
    roughness: 0.1
  });
  const windowFrame = new THREE.Mesh(frameGeometry, frameMaterial);
  windowFrame.position.z = -9.7;
  shipScene.add(windowFrame);

  // Add panels and details to the room
  addRoomDetails();
}

function addRoomDetails() {
  // Add wall panels
  const panelGeometry = new THREE.PlaneGeometry(2, 2);
  const panelMaterial = new THREE.MeshStandardMaterial({
    color: 0x444444,
    metalness: 0.7,
    roughness: 0.3
  });

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 4; j++) {
      const panel = new THREE.Mesh(panelGeometry, panelMaterial);
      panel.position.set(-8 + i * 2.5, -4 + j * 2.5, -9.5);
      shipScene.add(panel);
    }
  }

  // Add ceiling lights
  const lightGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
  const lightMaterial = new THREE.MeshStandardMaterial({
    color: 0x88aaff,
    emissive: 0x4477ff,
    emissiveIntensity: 0.5
  });

  for (let i = 0; i < 3; i++) {
    const light = new THREE.Mesh(lightGeometry, lightMaterial);
    light.rotation.x = Math.PI / 2;
    light.position.set(-4 + i * 4, 6, -8);
    shipScene.add(light);
  }
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
  spaceScene.add(distantStarField);
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
  spaceScene.add(starField);
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
    spaceScene.add(particleSystem);
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
  spaceScene.add(dustSystem);
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

  // Render both scenes
  renderer.clear();
  renderer.render(shipScene, shipCamera);
  renderer.clearDepth();
  renderer.render(spaceScene, spaceCamera);
}

export function onWindowResize() {
  const canvas = renderer.domElement;
  const aspect = canvas.clientWidth / canvas.clientHeight;
  
  spaceCamera.aspect = aspect;
  spaceCamera.updateProjectionMatrix();
  
  shipCamera.aspect = aspect;
  shipCamera.updateProjectionMatrix();
  
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
}

export function zoomOutFromWindow() {
  const startZ = shipCamera.position.z;
  const targetZ = 15;
  const duration = 2000; // 2 seconds
  const startTime = Date.now();

  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Use easing function for smooth animation
    const eased = 1 - Math.pow(1 - progress, 3);
    
    shipCamera.position.z = startZ + (targetZ - startZ) * eased;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  
  animate();
}