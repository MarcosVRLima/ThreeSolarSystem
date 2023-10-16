import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

var t = 0;
var zoom_factor = 1;
var speed_time = 1e-5;

document.getElementById("speed-time").addEventListener("change", () => {
  let setting_speed = parseFloat(document.getElementById("speed-time").value) / 100;
  speed_time = 1e-5 * setting_speed;
})

const setPos = (instance, x=0, y=0, z=0) => {
  instance.position.x = x;
  instance.position.y = y;
  instance.position.z = z;
}

const rotation = (instance, speed) => {
  instance.rotation.y += speed * speed_time * 1000 * Math.PI;
}

const getPos = (instance) => {
  return [instance.position.x, instance.position.y, instance.position.z];
}

const translation = (instance, instance_center, angular_speed) => {
  let radius = getDistance(instance, instance_center);
  let center_x = instance_center.position.x;
  let center_z = instance_center.position.z;
  instance.position.x = center_x + radius * Math.cos(Math.PI * 2 * t * angular_speed);
  instance.position.z = center_z + radius * Math.sin(Math.PI * 2 * t * angular_speed);
}

const translateMoon = (moon, earth, radius, angular_speed) => {
  const angle = t * angular_speed;
  const x = earth.position.x + radius * Math.cos(angle);
  const z = earth.position.z + radius * Math.sin(angle);
  moon.position.set(x, moon.position.y, z);
};

const getDistance = (instance1, instance2) => {
  let pos1 = getPos(instance1);
  let pos2 = getPos(instance2);
  return Math.sqrt(Math.pow(pos1[0] - pos2[0],2) + Math.pow(pos1[1] - pos2[1],2) + Math.pow(pos1[2] - pos2[2],2));
}

const passTime = (speed = 1e-10) => {
  t += speed;
}

const newInstance = (radius, texture_path, name = "") => {
  const sphere = new THREE.SphereGeometry(radius,64,64);
  const texture = textureLoader.load(texture_path);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const instance = new THREE.Mesh(sphere, material);
  instance.name = name;
  scene.add(instance);
  return instance;
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
function onMouseClick(event) {
  // Calculate mouse coordinates in normalized device coordinates (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections with the object
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    inspected_instance = intersects[0].object;
  } else{
    inspected_instance = sun;
  }
}
document.addEventListener('click', onMouseClick, false);

const zoom = (zoomFactor) => {
  // Adjusting the field of view for zooming in
  if (camera.isPerspectiveCamera) {
      camera.fov *= zoomFactor;
      camera.updateProjectionMatrix();
  }
  // Adjusting position for orthographic camera
  else if (camera.isOrthographicCamera) {
      camera.zoom /= zoomFactor;
      camera.updateProjectionMatrix();
  }
  zoom_factor = 1;
}

document.addEventListener('wheel', onWheel);

function onWheel(event) {
    let zoomFactor;
    if (camera.fov <= 100){
      zoomFactor = event.deltaY > 0 ? 1.25 : 0.75; // Zoom out for negative deltaY
    } else {
      camera.fov = 100;
      zoomFactor = 1;
    }
    if (camera.isPerspectiveCamera) {
        camera.fov *= zoomFactor;
        camera.updateProjectionMatrix();
    } else if (camera.isOrthographicCamera) {
        camera.zoom /= zoomFactor;
        camera.updateProjectionMatrix();
    }
}

// Configuração básica
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
const textureLoader = new THREE.TextureLoader();
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls( camera, renderer.domElement );
controls.update()
document.body.appendChild(renderer.domElement);
camera.position.z += 10;
camera.position.y = 10;
camera.rotation.x = -0.8;

const starTexture = new THREE.TextureLoader().load('./textures/stars.jpg');
const starGeometry = new THREE.SphereGeometry(200, 64, 64); // Tamanho do cubo deve ser grande o suficiente para envolver toda a cena

const starMaterial = new THREE.MeshBasicMaterial({
  map: starTexture,
  side: THREE.BackSide, // Garante que a textura seja visível do lado de dentro do cubo
});

const starField = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starField);


const sun = newInstance(2, './textures/sun.jpg', 'sun');
var inspected_instance = sun;

const mercury = newInstance(0.05, './textures/mercury.jpg', 'mercury');
setPos(mercury, 5);

const venus = newInstance(0.1, './textures/venus.jpg', 'venus');
setPos(venus, 7);

const earth = newInstance(0.1, './textures/earth_8k.jpg', 'earth');
setPos(earth, 9);
const moon = newInstance(0.02, './textures/moon.jpg', 'moon');
setPos(moon, 9.2);
rotation(moon, 700);

const mars = newInstance(0.07, './textures/mars.jpg', 'mars');
setPos(mars, 11);

const jupiter = newInstance(0.3, './textures/jupiter.jpg', 'jupiter');
setPos(jupiter, 13);

const saturn = newInstance(0.28, './textures/saturn.jpg', 'saturn');
setPos(saturn, 15);

const uranus = newInstance(0.2, './textures/uranus.jpg', 'uranus');
setPos(uranus, 17);

const neptune = newInstance(0.2, './textures/neptune.jpg', 'neptune');
setPos(neptune, 19);

// Função de renderização
const animate = () => {
  requestAnimationFrame(animate);
  passTime(speed_time);
  // follow(inspected_instance);

  rotation(sun, 1/25);
  rotation(earth, 1);
  rotation(mercury, 1 / 58.64);
  rotation(venus, 1 / 243);
  rotation(mars, 1);      
  rotation(jupiter, 2.4);
  rotation(saturn, 1 / 0.44);
  rotation(neptune, 1 / 0.67);
  rotation(uranus, 1 / 0.71);

  translation(mercury, sun, 1 / 0.24);
  translation(venus, sun, -1 / 0.61);
  translation(earth, sun, 1);
  translateMoon(moon, earth, 0.2,  10);
  translation(mars, sun, 1 / 1.88);
  translation(jupiter, sun, 1 / 12);
  translation(saturn, sun, 1 / 29.5);
  translation(neptune, sun, 1 / 164.79);
  translation(uranus, sun, 1 / 82.02);

  renderer.render(scene, camera);
  
console.log(ringTexture)
};

animate();