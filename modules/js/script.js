const initialPos = (instance, x, y, z) => {
    instance.position.x = x;
    instance.position.y = y;
    instance.position.z = z;
}
const rotation = (instance, speed) => {
    instance.rotation.y += speed;
}

// Configuração básica
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const textureLoader = new THREE.TextureLoader();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sun
const sphereSun = new THREE.SphereGeometry(2,32,32);
const textureSun = textureLoader.load('./textures/sun.jpg');
const materialSun = new THREE.MeshBasicMaterial({ map: textureSun });
const sun = new THREE.Mesh(sphereSun, materialSun);
scene.add(sun);

const sphereMoon = new THREE.SphereGeometry(0.1,32,32);
const textureMoon = textureLoader.load('./textures/moon.jpg');
const materialMoon = new THREE.MeshBasicMaterial({ map: textureMoon });
const moon = new THREE.Mesh(sphereMoon, materialMoon);
moon.position.x = 2.5;
scene.add(moon);

// Posicionando a câmera
camera.position.z = 5;

// Função de renderização
const animate = () => {
  requestAnimationFrame(animate);

  // Girando o cubo
  rotation(sun, 0.001);
  rotation(moon, 0.001);

  renderer.render(scene, camera);
};

animate();