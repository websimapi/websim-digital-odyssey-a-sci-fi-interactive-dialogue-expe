import * as THREE from 'three';
import { initSpaceWindow, updateSpaceWindow } from './spaceScene.js';

let scene, camera, renderer;
let shipInterior, dialoguePanel, novaPortrait, fatherPortrait;
const textureLoader = new THREE.TextureLoader();

export function initMainScene() {
  // Main scene setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const canvas = document.getElementById('mainScene');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Create ship interior environment
  createShipInterior();
  
  // Create window view
  const windowScene = initSpaceWindow();
  scene.add(windowScene);
  
  // Create UI elements
  createUIElements();
  
  // Add lights
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  
  const mainLight = new THREE.PointLight(0x8888ff, 1);
  mainLight.position.set(0, 5, 5);
  scene.add(mainLight);

  animate();
}

function createShipInterior() {
  // Create repeating pattern for ship interior
  const pattern = new THREE.PlaneGeometry(20, 20);
  const patternMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.7,
    metalness: 0.3
  });
  
  shipInterior = new THREE.Mesh(pattern, patternMaterial);
  shipInterior.position.z = -10;
  scene.add(shipInterior);
}

function createUIElements() {
  // Create dialogue panel
  const dialoguePanelGeometry = new THREE.PlaneGeometry(4, 1);
  const dialoguePanelMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.8
  });
  
  dialoguePanel = new THREE.Mesh(dialoguePanelGeometry, dialoguePanelMaterial);
  dialoguePanel.position.y = -2;
  dialoguePanel.position.z = -2;
  scene.add(dialoguePanel);

  // Create character portraits
  const portraitGeometry = new THREE.PlaneGeometry(1, 1);
  
  // Nova portrait
  const novaTexture = textureLoader.load('/nova.png');
  const novaMaterial = new THREE.MeshBasicMaterial({
    map: novaTexture,
    transparent: true,
    opacity: 0
  });
  
  novaPortrait = new THREE.Mesh(portraitGeometry, novaMaterial);
  novaPortrait.position.set(-2, -1.5, -1.5);
  scene.add(novaPortrait);

  // Father portrait
  const fatherTexture = textureLoader.load('/father.png');
  const fatherMaterial = new THREE.MeshBasicMaterial({
    map: fatherTexture,
    transparent: true,
    opacity: 0
  });
  
  fatherPortrait = new THREE.Mesh(portraitGeometry, fatherMaterial);
  fatherPortrait.position.set(2, -1.5, -1.5);
  scene.add(fatherPortrait);
}

function animate() {
  requestAnimationFrame(animate);
  
  // Update space window scene
  updateSpaceWindow();
  
  // Render main scene
  renderer.render(scene, camera);
}

export function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

export function updatePortraits(speaker) {
  if (speaker === 'female') {
    novaPortrait.material.opacity = 1;
    fatherPortrait.material.opacity = 0;
  } else {
    novaPortrait.material.opacity = 0;
    fatherPortrait.material.opacity = 1;
  }
}

export function hidePortraits() {
  novaPortrait.material.opacity = 0;
  fatherPortrait.material.opacity = 0;
}