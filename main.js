import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

var t = 0;  
var speed_time = 1e-5;

// Objeto base para os atributos
const celestialObjectBase = {
  radius: 1,
  texturePath: '',
};

class CelestialObject {
  constructor(options) {
    // Combinar os atributos base com as opções específicas do objeto
    const mergedOptions = { ...celestialObjectBase, ...options };
    this.radius = mergedOptions.radius;
    this.texturePath = mergedOptions.texturePath;
    this.name = mergedOptions.name;
    this.position = mergedOptions.position || new THREE.Vector3(0, 0, 0);
    this.instance = this.createInstance();
  }

  createInstance() {
    const sphere = new THREE.SphereGeometry(this.radius, 32, 32);
    const texture = textureLoader.load(this.texturePath);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const instance = new THREE.Mesh(sphere, material);
    instance.name = this.name;
    instance.position.copy(this.position);
    scene.add(instance);
    return instance;
  }
}

class Sun extends CelestialObject {
  constructor(options) {
    super(options);
  }
}

class Planet extends CelestialObject {
  constructor(options) {
    super(options);
  }

  rotate(speed) {
    this.instance.rotation.y += speed * speed_time * 1000 * Math.PI;
  }

  translate(instance_center, angular_speed) {
    const radius = getDistance(this.instance, instance_center);
    const center_x = instance_center.position.x;
    const center_z = instance_center.position.z;
    this.instance.position.x = center_x + radius * Math.cos(Math.PI * 2 * t * angular_speed);
    this.instance.position.z = center_z + radius * Math.sin(Math.PI * 2 * t * angular_speed);
  }
}

class Satellite extends CelestialObject {
  constructor(options) {
    super(options);
  }

  rotate(speed) {
    this.instance.rotation.y += speed * speed_time * 1000 * Math.PI;
  }

  translate(instance_center, angular_speed) {
    const radius = getDistance(this.instance, instance_center);
    const center_x = instance_center.position.x;
    const center_z = instance_center.position.z;
    this.instance.position.x = center_x + radius * Math.cos(Math.PI * 2 * t * angular_speed);
    this.instance.position.z = center_z + radius * Math.sin(Math.PI * 2 * t * angular_speed);
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

const passTime = (speed = 1e-10) => {
    t += speed;
}

// Agora, você pode criar instâncias das classes para o Sol, planetas e satélites
const sun = new Sun({
  radius: 2,
  texturePath: './textures/sun.jpg',
  name: 'sun',
});

const earth = new Planet({
  radius: 0.1,
  texturePath: './textures/earth.jpg',
  name: 'earth',
  position: new THREE.Vector3(9, 0, 0),
});

const moon = new Satellite({
  radius: 0.02,
  texturePath: './textures/moon.jpg',
  name: 'moon',
  position: new THREE.Vector3(9.2, 0, 0),
});

// Função de animação
const animate = () => {
  requestAnimationFrame(animate);
  passTime(speed_time);

  earth.rotate(1);
  moon.rotate(1/365);

  earth.translate(sun, 1);
  moon.translate(earth, 1/365);

  renderer.render(scene, camera);
};

animate();