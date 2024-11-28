// Set up Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.8);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Load Hanuman model
const loader = new THREE.GLTFLoader();
loader.load('img/mahavira_hanuman.glb', function(gltf) {
  const hanuman = gltf.scene;
  hanuman.position.set(0, 0, 0);
  hanuman.scale.set(1, 1, 1); // Adjust the scale if necessary
  scene.add(hanuman);
}, undefined, function(error) {
  console.error('An error occurred while loading the model:', error);
});

// Create a simple ground plane
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1; // Lower the ground if needed
scene.add(ground);

// Set up camera position
camera.position.z = 10;
camera.position.y = 5;
camera.lookAt(0, 0, 0);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
