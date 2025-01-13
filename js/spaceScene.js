import * as THREE from 'three';

let scene, camera, renderer;
let stars = [];
let beltParticles = [];
let deepSpaceObjects = [];

export function initThreeJS() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000005); // Very dark blue-black
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

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x8888ff, 1, 100);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x4444ff, 0.8, 100);
  pointLight2.position.set(-5, -5, -5);
  scene.add(pointLight2);

  createDeepSpaceObjects();
  createStarfield();
  createCentauriBelt3D();
  
  animate();
}

function createDeepSpaceObjects() {
  // Create distant nebulae
  for (let i = 0; i < 5; i++) {
    const nebulaGeometry = new THREE.SphereGeometry(20, 32, 32);
    const nebulaMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(Math.random(), 0.5, 0.1),
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide
    });
    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    
    // Position far away at random locations
    nebula.position.set(
      THREE.MathUtils.randFloatSpread(200),
      THREE.MathUtils.randFloatSpread(200),
      -100 - Math.random() * 100
    );
    nebula.scale.set(2 + Math.random() * 3, 2 + Math.random() * 3, 1);
    scene.add(nebula);
    deepSpaceObjects.push(nebula);
  }

  // Create distant galaxies
  const galaxyGeometry = new THREE.BufferGeometry();
  const galaxyPositions = [];
  const galaxyColors = [];

  for (let i = 0; i < 3; i++) {
    const centerX = THREE.MathUtils.randFloatSpread(300);
    const centerY = THREE.MathUtils.randFloatSpread(300);
    const centerZ = -150 - Math.random() * 200;
    
    // Create spiral galaxy pattern
    for (let j = 0; j < 2000; j++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 10;
      const spiralX = centerX + Math.cos(angle) * radius;
      const spiralY = centerY + Math.sin(angle) * radius;
      const spiralZ = centerZ + (Math.random() - 0.5) * 2;
      
      galaxyPositions.push(spiralX, spiralY, spiralZ);
      
      const color = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 1, 0.5);
      galaxyColors.push(color.r, color.g, color.b);
    }
  }

  galaxyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(galaxyPositions, 3));
  galaxyGeometry.setAttribute('color', new THREE.Float32BufferAttribute(galaxyColors, 3));

  const galaxyMaterial = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  });

  const galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
  scene.add(galaxyPoints);
  deepSpaceObjects.push(galaxyPoints);
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
  // Create more stars and spread them further
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

function createCentauriBelt3D() {
  // Create multiple particle systems for more depth
  for (let i = 0; i < 5; i++) { // Increased from 3 to 5 layers for more density
    const particles = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x8888ff,
      size: 0.04 - (i * 0.007),
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8 - (i * 0.15)
    });

    const particlePositions = [];
    const particleCount = 20000; // Increased particle count
    
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
  for(let i = 0; i < 8000; i++) { // Increased dust particles
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

  beltParticles.forEach((particles, index) => {
    particles.rotation.y += 0.0005 + (index * 0.0001);
  });

  // Slowly rotate deep space objects
  deepSpaceObjects.forEach((object, index) => {
    if (object.rotation) {
      object.rotation.z += 0.0001;
      object.rotation.y += 0.0002;
    }
  });

  renderer.render(scene, camera);
}

export function onWindowResize() {
  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
}